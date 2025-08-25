<?php

namespace App\Http\Controllers;

use App\Models\DailyOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Barryvdh\DomPDF\Facade\Pdf;

class DailyServiceReportController extends Controller
{
    public function servicePdf(Request $request, string $service)
    {
        $date = $request->input('date');
        $targetDate = $date ? \Carbon\Carbon::parse($date) : today();

        // Normalizamos el nombre de servicio esperado
        $serviceMap = [
            'vianda' => 'Vianda',
            'economico' => 'Comedor Económico',
            'premium' => 'Comedor Premium',
        ];
        if (!isset($serviceMap[$service])) {
            abort(404);
        }
        $serviceName = $serviceMap[$service];

        $rows = DailyOrder::query()
            ->whereDate('date', $targetDate)
            ->join('service_types', 'daily_orders.service_type_id', '=', 'service_types.id')
            ->join('children', 'daily_orders.child_id', '=', 'children.id')
            ->where('service_types.name', $serviceName)
            ->select(
                'children.id as child_id',
                'children.name',
                'children.lastname',
                'children.dni',
                'children.school',
                'children.grado',
                'children.condition'
            )
            ->orderBy('children.school')
            ->orderBy('children.lastname')
            ->orderBy('children.name')
            ->get()
            ->groupBy('school')
            ->map(function ($group) {
                return $group->map(function ($r) {
                    return [
                        'full_name' => trim($r->name . ' ' . $r->lastname),
                        'dni' => $r->dni,
                        'grado' => $r->grado,
                        'condition' => $r->condition,
                    ];
                });
            });

        $pdf = Pdf::loadView('reports.daily-service', [
            'serviceName' => $serviceName,
            'dateLabel' => $targetDate->format('d/m/Y'),
            'groups' => $rows,
        ])->setPaper('a4', 'portrait');

        $filename = 'reporte-' . str_replace(' ', '-', strtolower($serviceName)) . '-' . $targetDate->format('Ymd') . '.pdf';
        return $pdf->download($filename);
    }
}
