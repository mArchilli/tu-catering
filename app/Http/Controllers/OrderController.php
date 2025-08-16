<?php

namespace App\Http\Controllers;

use App\Models\Children;
use App\Models\DailyOrder;
use App\Models\ServiceType;
use App\Models\MonthlyOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
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

        // Bloqueo de edición si hay una orden mensual pendiente o pagada vigente
        [$allowed, $reason] = $this->canEditPeriod($child, $month, $year);
        if (!$allowed) {
            return redirect()
                ->route('children.view', $child->id)
                ->with('error', $reason);
        }
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

        // Determinar período de los ítems (asumimos un solo mes)
        $firstDate = Carbon::parse($items->first()['date']);
        $month = (int)$firstDate->month;
        $year = (int)$firstDate->year;

        // Bloqueo de edición si hay una orden mensual pendiente o pagada vigente
        [$allowed, $reason] = $this->canEditPeriod($child, $month, $year);
        if (!$allowed) {
            return back()->with('error', $reason);
        }

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
        // Determinar mes/año (por query o actual)
        $month = (int)($request->get('month', now()->month));
        $year = (int)($request->get('year', now()->year));

        // Calcular total del período
        $start = now()->setDate($year, $month, 1)->startOfMonth()->toDateString();
        $end = now()->setDate($year, $month, 1)->endOfMonth()->toDateString();
        $orders = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->with('serviceType:id,price_cents')
            ->get();
        $totalCents = $orders->sum(fn($o) => optional($o->serviceType)->price_cents ?? 0);

        // Crear o actualizar orden mensual con estado pendiente
        MonthlyOrder::updateOrCreate(
            [
                'child_id' => $child->id,
                'month' => $month,
                'year' => $year,
            ],
            [
                'status' => 'pending',
                'total_cents' => $totalCents,
            ]
        );

        return redirect()
            ->route('dashboard.padre')
            ->with('success', 'Se informó a la administración su pedido. No verá cambios hasta que el administrador confirme la recepción del pago.');
    }

    // ADMIN: listar órdenes mensuales pendientes
    public function adminMonthlyIndex(Request $request)
    {
    $statusParam = $request->get('status'); // all|pending|paid
    $status = in_array($statusParam, ['pending','paid','all'], true) ? $statusParam : 'all';
    $search = trim((string) $request->get('q', ''));

        $base = MonthlyOrder::query()
            ->with(['child:id,name,lastname'])
            ->when(in_array($status, ['pending','paid'], true), fn($q) => $q->where('status', $status))
            ->when($search !== '', function ($q) use ($search) {
                $q->whereHas('child', function ($qc) use ($search) {
                    $qc->where('name', 'like', "%$search%")
                       ->orWhere('lastname', 'like', "%$search%");
                });
            })
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->select(['id','child_id','month','year','status','total_cents']);

        // Paginamos por separado para cada listado usando distintos nombres de página
        $ordersPending = (clone $base)
            ->where('status','pending')
            ->paginate(10, ['*'], 'page_pending')
            ->appends(['status' => $status, 'q' => $search]);

        $ordersPaid = (clone $base)
            ->where('status','paid')
            ->paginate(10, ['*'], 'page_paid')
            ->appends(['status' => $status, 'q' => $search]);

        return Inertia::render('Admin/MonthlyOrders', [
            'filters' => [
                'status' => $status,
                'q' => $search,
            ],
            'ordersPending' => $ordersPending,
            'ordersPaid' => $ordersPaid,
        ]);
    }

    // ADMIN: confirmar pago de una orden mensual
    public function adminMonthlyConfirm(Request $request, MonthlyOrder $order)
    {
        $order->update([
            'status' => 'paid',
            'decision_at' => now(),
            'notified' => false,
        ]);

        return back()->with('success', 'Orden confirmada como pagada.');
    }

    // ADMIN: eliminar una orden mensual (solo si está pagada)
    public function adminMonthlyDestroy(Request $request, MonthlyOrder $order)
    {
        if ($order->status !== 'paid') {
            return back()->with('error', 'Solo se pueden eliminar órdenes marcadas como pagadas.');
        }

        $order->delete();

        return back()->with('success', 'Orden eliminada correctamente.');
    }

    // ADMIN: rechazar pago de una orden mensual
    public function adminMonthlyReject(Request $request, MonthlyOrder $order)
    {
        $order->update([
            'status' => 'rejected',
            'decision_at' => now(),
            'notified' => false,
        ]);

        return back()->with('success', 'Orden rechazada.');
    }

    private function authorizeChild(Children $child): void
    {
        if ($child->user_id !== Auth::id()) {
            abort(403);
        }
    }

    /**
     * Reglas de edición del período:
     * - Si existe MonthlyOrder 'pending' para (child, month, year): bloquear.
     * - Si existe 'paid': bloquear mientras el mes/año no haya finalizado (vigente). Una vez vencido, permitir.
     * - Si existe 'rejected': permitir.
     */
    private function canEditPeriod(Children $child, int $month, int $year): array
    {
        $existing = MonthlyOrder::where('child_id', $child->id)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        if (!$existing) {
            return [true, ''];
        }

        $status = $existing->status;
        if ($status === 'rejected') {
            return [true, ''];
        }

        if ($status === 'pending') {
            return [false, 'Este período ya fue informado y está pendiente de aprobación. Esperá la confirmación o un posible rechazo para volver a editar.'];
        }

        if ($status === 'paid') {
            $periodEnd = Carbon::create($year, $month, 1)->endOfMonth();
            if (now()->lessThanOrEqualTo($periodEnd)) {
                return [false, 'Este período ya fue aprobado y continúa vigente. Podrás editar nuevamente cuando finalice el mes.'];
            }
            // Si el período está vencido, permitimos nueva edición (por ejemplo, programar un nuevo mes)
            return [true, ''];
        }

        // Estado desconocido: por seguridad, bloquear
        return [false, 'No es posible editar este período en este momento.'];
    }
}
