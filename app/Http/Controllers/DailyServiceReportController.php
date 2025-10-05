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
        // Orden y categorías de grados
        $gradesOrdered = [
            'Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5',
            '1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria','7° Primaria',
            '1° Secundaria','2° Secundaria','3° Secundaria','4° Secundaria','5° Secundaria','6° Secundaria','7° Secundaria',
        ];
        $gradeIndex = array_flip($gradesOrdered);
        $gradesMJ = ['Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5'];
        $gradesPrim = ['1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria','7° Primaria'];
        $gradesSec = ['1° Secundaria','2° Secundaria','3° Secundaria','4° Secundaria','5° Secundaria','6° Secundaria','7° Secundaria'];

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
                'children.condition',
                'daily_orders.status'
            )
            ->orderBy('children.school')
            ->orderBy('children.lastname')
            ->orderBy('children.name')
            ->get()
            ->groupBy('school')
            ->map(function ($group) use ($gradeIndex) {
                // Estructura: por escuela -> por grado -> lista ordenada
                return $group->map(function ($r) {
                    return [
                        'full_name' => trim($r->name . ' ' . $r->lastname),
                        'dni' => $r->dni,
                        'grado' => $r->grado,
                        'condition' => $r->condition,
                        'status' => $r->status,
                    ];
                })
                ->groupBy('grado')
                ->sortBy(function($_, $grado) use ($gradeIndex) { return $gradeIndex[$grado] ?? 999; })
                ->map(function($items){
                    return $items->sortBy('full_name')->values();
                });
            });

        $pdf = Pdf::loadView('reports.daily-service', [
            'serviceName' => $serviceName,
            'dateLabel' => $targetDate->format('d/m/Y'),
            'groups' => $rows,
            'gradeIndex' => $gradeIndex,
            'gradesMJ' => $gradesMJ,
            'gradesPrim' => $gradesPrim,
            'gradesSec' => $gradesSec,
        ])->setPaper('a4', 'portrait');

        $filename = 'reporte-' . str_replace(' ', '-', strtolower($serviceName)) . '-' . $targetDate->format('Ymd') . '.pdf';
        return $pdf->download($filename);
    }
}
