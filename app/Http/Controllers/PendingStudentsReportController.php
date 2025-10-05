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
            ->groupBy('status')
            ->map(function ($byStatus) {
                // Dentro de cada estado, agrupar por escuela (institución)
                return $byStatus->groupBy(function ($row) {
                    return $row['school'] ?: 'Sin especificar';
                })->sortKeys();
            });

        $pdf = Pdf::loadView('reports.pending-students', [
            'dateLabel' => now()->format('d/m/Y'),
            'groups' => $rows,
            'gradeIndex' => $gradeIndex,
            'gradesMJ' => $gradesMJ,
            'gradesPrim' => $gradesPrim,
            'gradesSec' => $gradesSec,
        ])->setPaper('a4','portrait');

        $filename = 'alumnos-pendientes-'.now()->format('Ymd').'.pdf';
        return $pdf->download($filename);
    }
}
