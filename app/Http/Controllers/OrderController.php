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

    private function authorizeChild(Children $child): void
    {
        if ($child->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
