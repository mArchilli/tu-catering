<?php

namespace App\Http\Controllers;

use App\Models\Children;
use App\Models\DailyOrder;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function create(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        $serviceTypes = ServiceType::select('id','name','price_cents')->get();
        // Pedimos órdenes existentes para el mes consultado (si viene), por defecto mes actual
        $month = (int)($request->get('month', now()->month));
        $year = (int)($request->get('year', now()->year));
        $start = now()->setDate($year, $month, 1)->startOfMonth()->toDateString();
        $end = now()->setDate($year, $month, 1)->endOfMonth()->toDateString();

        $existing = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->with('serviceType:id,name,price_cents')
            ->get()
            ->map(fn($o) => [
                'date' => $o->date->toDateString(),
                'service_type_id' => $o->service_type_id,
                'service' => $o->serviceType->name,
                'price_cents' => $o->serviceType->price_cents,
            ]);

        return Inertia::render('Children/OrderCalendar', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'lastname' => $child->lastname,
            ],
            'serviceTypes' => $serviceTypes,
            'existing' => $existing,
            'year' => $year,
            'month' => $month,
        ]);
    }

    public function store(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        $validated = $request->validate([
            'items' => ['required','array','min:1'],
            'items.*.date' => ['required','date'],
            'items.*.service_type_id' => ['required','exists:service_types,id'],
        ]);

        $items = collect($validated['items']);

        // Usamos upsert por child+date para actualizar o crear
        $payload = $items->map(fn($i) => [
            'child_id' => $child->id,
            'service_type_id' => $i['service_type_id'],
            'date' => $i['date'],
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ])->all();

        DailyOrder::upsert($payload, ['child_id','date'], ['service_type_id','status','updated_at']);

        return back()->with('success', 'Selección guardada');
    }

    public function summary(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        $validated = $request->validate([
            'items' => ['required','array','min:1'],
            'items.*.date' => ['required','date'],
            'items.*.service_type_id' => ['required','exists:service_types,id'],
        ]);

        $items = collect($validated['items']);
        $serviceTypes = ServiceType::select('id','name','price_cents')->get()->keyBy('id');

        $summary = $items
            ->map(function ($i) use ($serviceTypes) {
                $s = $serviceTypes[$i['service_type_id']] ?? null;
                return [
                    'date' => $i['date'],
                    'service_type_id' => $i['service_type_id'],
                    'service' => $s?->name,
                    'price_cents' => $s?->price_cents ?? 0,
                ];
            })
            ->sortBy('date')
            ->values();

        $totalsByService = $summary->groupBy('service_type_id')->map(function ($rows) {
            $service = $rows->first();
            return [
                'service_type_id' => $service['service_type_id'],
                'service' => $service['service'],
                'days' => $rows->count(),
                'subtotal_cents' => $rows->sum('price_cents'),
            ];
        })->values();

        $totalCents = $summary->sum('price_cents');

        return Inertia::render('Children/OrderSummary', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'lastname' => $child->lastname,
            ],
            'summary' => $summary,
            'totalsByService' => $totalsByService,
            'totalCents' => $totalCents,
        ]);
    }

    // Permite acceder por GET para ver el resumen del mes a partir de órdenes guardadas
    public function summaryExisting(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        $month = (int)($request->get('month', now()->month));
        $year = (int)($request->get('year', now()->year));
        $start = now()->setDate($year, $month, 1)->startOfMonth()->toDateString();
        $end = now()->setDate($year, $month, 1)->endOfMonth()->toDateString();

        $orders = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->with('serviceType:id,name,price_cents')
            ->get();

        $summary = $orders->map(function ($o) {
            return [
                'date' => $o->date->toDateString(),
                'service_type_id' => $o->service_type_id,
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
            ];
        })->sortBy('date')->values();

        $totalsByService = $summary->groupBy('service_type_id')->map(function ($rows) {
            $service = $rows->first();
            return [
                'service_type_id' => $service['service_type_id'],
                'service' => $service['service'],
                'days' => $rows->count(),
                'subtotal_cents' => $rows->sum('price_cents'),
            ];
        })->values();

        $totalCents = $summary->sum('price_cents');

        return Inertia::render('Children/OrderSummary', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'lastname' => $child->lastname,
            ],
            'summary' => $summary,
            'totalsByService' => $totalsByService,
            'totalCents' => $totalCents,
            'year' => $year,
            'month' => $month,
        ]);
    }

    public function payment(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        // Mes/año consultados, por defecto el mes actual
        $month = (int)($request->get('month', now()->month));
        $year = (int)($request->get('year', now()->year));
        $start = now()->setDate($year, $month, 1)->startOfMonth()->toDateString();
        $end = now()->setDate($year, $month, 1)->endOfMonth()->toDateString();

        // Órdenes cargadas para el período
        $orders = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->with('serviceType:id,name,price_cents')
            ->get();

        $totalCents = $orders->sum(fn($o) => optional($o->serviceType)->price_cents ?? 0);

        // Armar resumen y totales por servicio
        $summary = $orders->map(function ($o) {
            return [
                'date' => $o->date->toDateString(),
                'service_type_id' => $o->service_type_id,
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
            ];
        })->sortBy('date')->values();

        $totalsByService = $summary->groupBy('service_type_id')->map(function ($rows) {
            $service = $rows->first();
            return [
                'service_type_id' => $service['service_type_id'],
                'service' => $service['service'],
                'days' => $rows->count(),
                'subtotal_cents' => $rows->sum('price_cents'),
            ];
        })->values();

        $daysCount = $summary->count();

        // Datos de pago (CBU y ALIAS opcionalmente desde variables de entorno)
        $payment = [
            'bank' => 'Naranja X',
            'cbu' => env('PAYMENT_CBU', ''),
            'alias' => env('PAYMENT_ALIAS', ''),
            'holder' => 'Oscar Daniel Aguilera',
            'cuil' => '20-11321905-0',
        ];

        return Inertia::render('Children/Payment', [
            'child' => [
                // Sin ID a pedido del usuario
                'name' => $child->name,
                'lastname' => $child->lastname,
                'dni' => $child->dni,
                'school' => $child->school,
                'grado' => $child->grado,
                'condition' => $child->condition,
            ],
            'childId' => $child->id,
            'totalCents' => $totalCents,
            'payment' => $payment,
            'totalsByService' => $totalsByService,
            'daysCount' => $daysCount,
            // 'summary' => $summary, // disponible si luego se quiere mostrar por día
            'year' => $year,
            'month' => $month,
        ]);
    }

    public function paymentConfirm(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        return redirect()
            ->route('dashboard.padre')
            ->with('success', 'Se informó a la administración su pedido. No verá cambios hasta que el administrador confirme la recepción del pago.');
    }

    private function authorizeChild(Children $child): void
    {
        if ($child->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
