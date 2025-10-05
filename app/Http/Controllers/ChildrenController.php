<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Children;
// Eliminado MonthlyOrder: estado se calcula con daily_orders

class ChildrenController extends Controller
{
    // Listado
    public function index(Request $request)
    {
        $children = Children::where('user_id', $request->user()->id)
            ->orderBy('lastname')
            ->orderBy('name')
            ->get(['id','name','lastname','dni','school','grado','condition']);

    // Calcular estado (pending|paid|rejected|null) y total desde daily_orders del mes actual
        $start = now()->startOfMonth()->toDateString();
        $end = now()->endOfMonth()->toDateString();
        $ids = $children->pluck('id');

    $aggregates = \App\Models\DailyOrder::query()
            ->selectRaw('child_id, '
                .'SUM(service_types.price_cents) as total_cents, '
                .'SUM(CASE WHEN daily_orders.status = "paid" THEN 1 ELSE 0 END) as paid_days, '
                .'SUM(CASE WHEN daily_orders.status = "rejected" THEN 1 ELSE 0 END) as rejected_days, '
                .'COUNT(*) as total_days, '
                .'MAX(daily_orders.date) as last_date')
            ->join('service_types','service_types.id','=','daily_orders.service_type_id')
            ->whereIn('child_id', $ids)
            ->whereBetween('date', [$start, $end])
            ->groupBy('child_id')
            ->get()
            ->keyBy('child_id');

    $today = now()->toDateString();
    $children = $children->map(function ($c) use ($aggregates, $today) {
            $agg = $aggregates->get($c->id);
            if ($agg) {
                // Si ya pasó el último día contratado, se considera expirado el ciclo y vuelve a "sin días"
                if ($agg->last_date && $agg->last_date < $today) {
                    $c->payment_status = null; // expirado -> requiere nueva contratación
                    $c->payment_total_cents = 0;
                } else {
                    // Priorizar rechazado sobre pendiente/pagado
                    $status = ($agg->rejected_days ?? 0) > 0
                        ? 'rejected'
                        : (($agg->paid_days == $agg->total_days) ? 'paid' : 'pending');
                    $c->payment_status = $status; // paid | pending
                    $c->payment_total_cents = (int) $agg->total_cents;
                }
            } else {
                $c->payment_status = null; // sin días cargados
                $c->payment_total_cents = 0;
            }
            return $c;
        });

        return Inertia::render('Children/Index', [
            'children' => $children,
        ]);
    }

    // Formulario creación
    public function create()
    {
        return Inertia::render('Children/Create', [
            'schools' => [
                'Juan XXIII','Santisimo Redentor','Colegio Buenos Aires'
            ],
            'grados' => [
                'Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5','1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria', '7° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria', '6° Secundaria', '7° Secundaria'
            ],
            'conditions' => [
                'Ninguna','Celiaquia','Vegetariano','Vegano'
            ],
        ]);
    }

    // Guardar nuevo
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required','string','max:100'],
            'lastname'  => ['required','string','max:100'],
            'dni'       => ['required','string','max:20','unique:children,dni'],
            'school'    => ['nullable','string','max:150'],
            'grado'     => ['nullable','string','max:50'],
            'condition' => ['nullable','string','max:100'],
        ]);

        $data['user_id'] = $request->user()->id;

        Children::create($data);

        return redirect()->route('children.index')
            ->with('success', 'Hijo creado correctamente.');
    }

    public function show(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }
        $month = (int)$request->get('month', now()->month);
        $year = (int)$request->get('year', now()->year);
        $start = now()->setDate($year, $month, 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $orders = \App\Models\DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->with('serviceType:id,name,price_cents')
            ->orderBy('date')
            ->get();

        $dailyOrders = $orders->map(function ($o) {
            return [
                'date' => $o->date->toDateString(),
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
                'status' => $o->status,
            ];
        });

        $totalDays = $dailyOrders->count();
        $paidDays = $dailyOrders->where('status','paid')->count();
    $rejectedDays = $dailyOrders->where('status','rejected')->count();
    $pendingDays = $totalDays - $paidDays - $rejectedDays;
        $totalCents = $dailyOrders->sum('price_cents');

        return Inertia::render('Children/View', [
            'child' => $child,
            'dailyOrders' => $dailyOrders,
            'summary' => [
                'total_days' => $totalDays,
                'paid_days' => $paidDays,
                'pending_days' => $pendingDays,
                'rejected_days' => $rejectedDays,
                'total_cents' => $totalCents,
            ],
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function edit(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Children/Edit', [
            'child' => $child,
            'schools' => [
                'Juan XXIII','Santisimo Redentor','Colegio Buenos Aires'
            ],
            'grados' => [
                'Maternal','Sala de 2','Sala de 3','Sala de 4','Sala de 5','1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria', '7° Primaria', '1° Secundaria', '2° Secundaria', '3° Secundaria', '4° Secundaria', '5° Secundaria', '6° Secundaria', '7° Secundaria'
            ],
            'conditions' => [
                'Ninguna','Celiaquia','Vegetariano','Vegano'
            ],
        ]);
    }

    public function update(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        $data = $request->validate([
            'name'      => ['required','string','max:100'],
            'lastname'  => ['required','string','max:100'],
            'dni'       => ['required','string','max:20','unique:children,dni,' . $child->id],
            'school'    => ['nullable','string','max:150'],
            'grado'     => ['nullable','string','max:50'],
            'condition' => ['nullable','string','max:100'],
        ]);

        $child->update($data);

        return redirect()->route('children.index')->with('success', 'Alumno actualizado correctamente.');
    }

    public function destroy(Request $request, Children $child)
    {
        if ($child->user_id !== $request->user()->id) {
            abort(403);
        }

        $child->delete();

        return redirect()
            ->route('children.index')
            ->with('success', 'Alumno eliminado correctamente.');
    }
}
