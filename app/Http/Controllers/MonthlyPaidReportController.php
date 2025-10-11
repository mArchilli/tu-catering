<?php

namespace App\Http\Controllers;

use App\Models\Children;
use App\Models\DailyOrder;
use App\Models\MonthlyOrder;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Carbon;

class MonthlyPaidReportController extends Controller
{
    /**
     * Genera un PDF con el historial de días pagados para un alumno en un período (mes/año).
     */
    public function pdf(Request $request, Children $child, int $month, int $year)
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $orders = DailyOrder::query()
            ->where('child_id', $child->id)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->where('status', 'paid')
            ->with('serviceType:id,name,price_cents')
            ->orderBy('date')
            ->get();

        $summary = $orders->map(function ($o) {
            return [
                'date' => Carbon::parse($o->date)->toDateString(),
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
                'status' => $o->status,
            ];
        })->values();

        $baseTotalCents = (int) $summary->sum('price_cents');

        $monthly = MonthlyOrder::where('child_id', $child->id)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        $surcharge = [ 'applied' => false, 'percent' => 0, 'cents' => 0 ];
        if ($monthly) {
            $diff = (int) $monthly->total_cents - (int) $baseTotalCents;
            if ($diff > 0 && $baseTotalCents > 0) {
                $pct = round(($diff / $baseTotalCents) * 100);
                $mapped = 0;
                if ($pct >= 8) { $mapped = 10; }
                elseif ($pct >= 3) { $mapped = 5; }
                $surcharge = [ 'applied' => $mapped > 0, 'percent' => $mapped, 'cents' => $diff ];
            }
        }

        $paidMonthlyTotalCents = $baseTotalCents + ($surcharge['applied'] ? $surcharge['cents'] : 0);

        $counts = $summary->groupBy('service')->map(function ($rows, $service) {
            return [ 'service' => (string) $service, 'count' => $rows->count() ];
        })->values();

        $pdf = Pdf::loadView('reports.monthly-paid', [
            'child' => $child,
            'month' => $month,
            'year' => $year,
            'summary' => $summary,
            'baseTotalCents' => $baseTotalCents,
            'surcharge' => $surcharge,
            'paidMonthlyTotalCents' => $paidMonthlyTotalCents,
            'counts' => $counts,
        ])->setPaper('a4', 'portrait');

        $safeName = trim(($child->lastname ?: '') . '-' . ($child->name ?: ''));
        $safeName = str_replace([' ', '  '], '-', strtolower($safeName));
        $filename = 'historial-pagos-' . $safeName . '-' . str_pad((string)$month, 2, '0', STR_PAD_LEFT) . '-' . $year . '.pdf';
        return $pdf->download($filename);
    }
}
