<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class PendingStudentsReportController extends Controller
{
    public function pdf(Request $request)
    {
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();

        $rows = \App\Models\Children::query()
            ->leftJoin('daily_orders', function($join) use ($monthStart, $monthEnd) {
                $join->on('children.id','=','daily_orders.child_id')
                    ->whereBetween('daily_orders.date', [$monthStart, $monthEnd]);
            })
            ->leftJoin('service_types','service_types.id','=','daily_orders.service_type_id')
            ->selectRaw('children.id, children.name, children.lastname, children.dni, children.school, children.grado, children.condition, '
                .'SUM(service_types.price_cents) as total_cents, '
                .'SUM(CASE WHEN daily_orders.status = "paid" THEN 1 ELSE 0 END) as paid_days, '
                .'COUNT(daily_orders.id) as total_days')
            ->groupBy('children.id','children.name','children.lastname','children.dni','children.school','children.grado','children.condition')
            ->orderBy('children.lastname')
            ->orderBy('children.name')
            ->get()
            ->map(function($r){
                if ($r->total_days == 0) {
                    $status = 'none';
                } else {
                    $status = ($r->paid_days == $r->total_days) ? 'paid' : 'pending';
                }
                return [
                    'full_name' => trim($r->name.' '.$r->lastname),
                    'dni' => $r->dni,
                    'school' => $r->school,
                    'grado' => $r->grado,
                    'condition' => $r->condition,
                    'status' => $status,
                ];
            })
            ->filter(fn($row) => in_array($row['status'], ['pending','none']))
            ->groupBy('status');

        $pdf = Pdf::loadView('reports.pending-students', [
            'dateLabel' => now()->format('d/m/Y'),
            'groups' => $rows,
        ])->setPaper('a4','portrait');

        $filename = 'alumnos-pendientes-'.now()->format('Ymd').'.pdf';
        return $pdf->download($filename);
    }
}
