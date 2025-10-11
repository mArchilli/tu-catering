<?php

namespace App\Http\Controllers;

use App\Models\Children;
use App\Models\DailyOrder;
use App\Models\ServiceType;
use App\Models\MonthlyOrder; // Deprecated: mantener hasta limpiar referencias de edición/permisos
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Support\ArBusinessDays;

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

    // Día hábil actual del mes para mostrar en UI (permitir override en debug)
    $today = $this->resolveToday($request);
    $businessDayIndex = \App\Support\ArBusinessDays::businessDayIndexInMonth($today, $month, $year);

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
            'businessDayIndex' => $businessDayIndex,
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

        // Intentar inferir mes/año desde el primer ítem para calcular día hábil actual
    $firstDate = $summary->first()['date'] ?? null;
    $month = $firstDate ? (int) \Illuminate\Support\Carbon::parse($firstDate)->month : now()->month;
    $year = $firstDate ? (int) \Illuminate\Support\Carbon::parse($firstDate)->year : now()->year;
    $today = $this->resolveToday($request);
    $businessDayIndex = \App\Support\ArBusinessDays::businessDayIndexInMonth($today, $month, $year);

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
            'businessDayIndex' => $businessDayIndex,
        ]);
    }

    /**
     * Muestra la página de pago como vista previa sin persistir daily_orders.
     * Recibe los items seleccionados y calcula los totales.
     */
    public function paymentPreview(Request $request, Children $child)
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

        // Mes/año inferidos desde el primer ítem
        $firstDate = $summary->first()['date'] ?? null;
        $month = $firstDate ? (int) \Illuminate\Support\Carbon::parse($firstDate)->month : now()->month;
        $year = $firstDate ? (int) \Illuminate\Support\Carbon::parse($firstDate)->year : now()->year;
        $today = $this->resolveToday($request);
        $businessDayIndex = \App\Support\ArBusinessDays::businessDayIndexInMonth($today, $month, $year);

        // Recargo como en payment()
        $surchargePercent = ArBusinessDays::surchargePercentForMonth($month, $year, $today);
        $surchargeCents = ArBusinessDays::applySurchargeCents($totalCents, $surchargePercent);
        $totalWithSurchargeCents = $totalCents + $surchargeCents;

        // Datos de pago genéricos, igual que payment()
        $payment = [
            'bank' => 'Naranja X',
            'cbu' => env('PAYMENT_CBU', ''),
            'alias' => env('PAYMENT_ALIAS', ''),
            'holder' => 'Oscar Daniel Aguilera',
            'cuil' => '20-11321905-0',
        ];

        return Inertia::render('Children/Payment', [
            'child' => [
                'name' => $child->name,
                'lastname' => $child->lastname,
                'dni' => $child->dni,
                'school' => $child->school,
                'grado' => $child->grado,
                'condition' => $child->condition,
            ],
            'childId' => $child->id,
            'totalCents' => $totalCents,
            'surcharge' => [
                'percent' => $surchargePercent,
                'cents' => $surchargeCents,
                'label' => $surchargePercent > 0 ? ("Recargo por pago fuera de término ({$surchargePercent}% )") : null,
            ],
            'totalWithSurchargeCents' => $totalWithSurchargeCents,
            'payment' => $payment,
            'totalsByService' => $totalsByService,
            'daysCount' => $summary->count(),
            'summary' => $summary,
            'year' => $year,
            'month' => $month,
            'businessDayIndex' => $businessDayIndex,
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

    $today = $this->resolveToday($request);
    $businessDayIndex = \App\Support\ArBusinessDays::businessDayIndexInMonth($today, $month, $year);

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
            'businessDayIndex' => $businessDayIndex,
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

    // Recargo por día hábil argentino (permitir override del "hoy" en debug)
    $today = $this->resolveToday($request);
    $surchargePercent = ArBusinessDays::surchargePercentForMonth($month, $year, $today);
    $surchargeCents = ArBusinessDays::applySurchargeCents($totalCents, $surchargePercent);
    $totalWithSurchargeCents = $totalCents + $surchargeCents;

        // Datos de pago (CBU y ALIAS opcionalmente desde variables de entorno)
        $payment = [
            'bank' => 'Naranja X',
            'cbu' => env('PAYMENT_CBU', ''),
            'alias' => env('PAYMENT_ALIAS', ''),
            'holder' => 'Oscar Daniel Aguilera',
            'cuil' => '20-11321905-0',
        ];

    $businessDayIndex = \App\Support\ArBusinessDays::businessDayIndexInMonth($today, $month, $year);

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
            'surcharge' => [
                'percent' => $surchargePercent,
                'cents' => $surchargeCents,
                'label' => $surchargePercent > 0 ? ("Recargo por pago fuera de término ({$surchargePercent}% )") : null,
            ],
            'totalWithSurchargeCents' => $totalWithSurchargeCents,
            'payment' => $payment,
            'totalsByService' => $totalsByService,
            'daysCount' => $daysCount,
            // 'summary' => $summary, // disponible si luego se quiere mostrar por día
            'year' => $year,
            'month' => $month,
            'businessDayIndex' => $businessDayIndex,
        ]);
    }

    public function paymentConfirm(Request $request, Children $child)
    {
        $this->authorizeChild($child);
        // Si llegan items, creamos aquí las daily_orders (no antes)
        $items = collect($request->input('items', []));
        if ($items->count() > 0) {
            $validated = $request->validate([
                'items' => ['required','array','min:1'],
                'items.*.date' => ['required','date'],
                'items.*.service_type_id' => ['required','exists:service_types,id'],
            ]);
            $items = collect($validated['items']);
            $payload = $items->map(fn($i) => [
                'child_id' => $child->id,
                'service_type_id' => $i['service_type_id'],
                'date' => $i['date'],
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ])->all();
            DailyOrder::upsert($payload, ['child_id','date'], ['service_type_id','status','updated_at']);
        }

        // Determinar mes/año (por query o actual)
        $month = (int)($request->get('month', now()->month));
        $year = (int)($request->get('year', now()->year));

        // Calcular total del período desde lo que esté almacenado
        $start = now()->setDate($year, $month, 1)->startOfMonth()->toDateString();
        $end = now()->setDate($year, $month, 1)->endOfMonth()->toDateString();
        $orders = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->with('serviceType:id,price_cents')
            ->get();
    $totalCents = $orders->sum(fn($o) => optional($o->serviceType)->price_cents ?? 0);
    // Aplicar recargo al momento de confirmar (respetando override en debug si viene)
    $today = $this->resolveToday($request);
    $surchargePercent = \App\Support\ArBusinessDays::surchargePercentForMonth($month, $year, $today);
    $surchargeCents = \App\Support\ArBusinessDays::applySurchargeCents($totalCents, $surchargePercent);
    $totalWithSurchargeCents = $totalCents + $surchargeCents;

        // Crear o actualizar orden mensual con estado pendiente
        MonthlyOrder::updateOrCreate(
            [
                'child_id' => $child->id,
                'month' => $month,
                'year' => $year,
            ],
            [
                'status' => 'pending',
                'total_cents' => $totalWithSurchargeCents,
            ]
        );

        return redirect()
            ->route('dashboard.padre')
            ->with('success', 'Se informó a la administración su pedido. No verá cambios hasta que el administrador confirme la recepción del pago.');
    }

    /**
     * Elimina todas las órdenes diarias en estado 'pending' para el niño y período indicado (mes/año).
     */
    public function clearPending(Request $request, Children $child)
    {
        $this->authorizeChild($child);

        $validated = $request->validate([
            'month' => ['required','integer','min:1','max:12'],
            'year' => ['required','integer','min:2000'],
        ]);

        $start = Carbon::create($validated['year'], $validated['month'], 1)->startOfMonth()->toDateString();
        $end = Carbon::create($validated['year'], $validated['month'], 1)->endOfMonth()->toDateString();

        $deleted = DailyOrder::where('child_id', $child->id)
            ->whereBetween('date', [$start, $end])
            ->where('status', 'pending')
            ->delete();

        if ($request->wantsJson()) {
            return response()->json(['ok' => true, 'deleted' => $deleted]);
        }

        return back()->with('success', "Pedidos pendientes eliminados: $deleted");
    }

    /**
     * Permite simular la fecha "de hoy" cuando config('app.debug') es true o ALLOW_AS_OF_OVERRIDE=true.
     * Usar query ?as_of=YYYY-MM-DD.
     */
    private function resolveToday(Request $request): \Illuminate\Support\Carbon
    {
        $allow = (bool) config('app.debug') || (bool) env('ALLOW_AS_OF_OVERRIDE', false);
        $asOf = trim((string) $request->get('as_of', ''));
        if ($allow && $asOf !== '') {
            try {
                return \Illuminate\Support\Carbon::parse($asOf)->startOfDay();
            } catch (\Throwable $e) {
                // fallback
            }
        }
        return now();
    }

    // ADMIN: listado agregado por alumno (estado derivado de daily_orders: paid si todos los días están pagados)
    public function adminMonthlyIndex(Request $request)
    {
        // Nuevo listado: agrupar información desde daily_orders por alumno para un período (mes/año)
        $month = (int) $request->get('month', now()->month);
        $year = (int) $request->get('year', now()->year);
    $statusParam = $request->get('status'); // all|pending|paid|rejected
    $status = in_array($statusParam, ['pending','paid','rejected','all'], true) ? $statusParam : 'all';
        $search = trim((string) $request->get('q', ''));

        $start = now()->setDate($year, $month, 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $rows = DailyOrder::query()
            ->selectRaw('children.id as child_id, children.name, children.lastname, children.dni, '
                .'MAX(children.school) as school, MAX(children.grado) as grado, '
                .'SUM(service_types.price_cents) as total_cents, '
                .'GROUP_CONCAT(DISTINCT daily_orders.date ORDER BY daily_orders.date) as days, '
                .'SUM(CASE WHEN daily_orders.status = "paid" THEN 1 ELSE 0 END) as paid_days, '
                .'COUNT(*) as total_days, '
                .'MAX(monthly_orders.status) as monthly_status')
            ->join('children', 'children.id', '=', 'daily_orders.child_id')
            ->join('service_types', 'service_types.id', '=', 'daily_orders.service_type_id')
            ->leftJoin('monthly_orders', function($join) use ($month, $year) {
                $join->on('monthly_orders.child_id', '=', 'daily_orders.child_id')
                     ->where('monthly_orders.month', '=', $month)
                     ->where('monthly_orders.year', '=', $year);
            })
            ->whereBetween('daily_orders.date', [$start->toDateString(), $end->toDateString()])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('children.name', 'like', "%$search%")
                       ->orWhere('children.lastname', 'like', "%$search%")
                       ->orWhere('children.dni', 'like', "%$search%");
                });
            })
            ->groupBy('children.id', 'children.name', 'children.lastname', 'children.dni')
            ->orderBy('children.lastname')
            ->orderBy('children.name')
            ->get();

        // Cargar detalles día/servicio para los niños del período
        $childIds = $rows->pluck('child_id')->unique()->values();
        $details = DailyOrder::query()
            ->select('daily_orders.child_id','daily_orders.date','service_types.name as service')
            ->join('service_types', 'service_types.id', '=', 'daily_orders.service_type_id')
            ->whereBetween('daily_orders.date', [$start->toDateString(), $end->toDateString()])
            ->whereIn('daily_orders.child_id', $childIds)
            ->orderBy('daily_orders.date')
            ->get()
            ->groupBy('child_id');

        // Traer monthly_orders para detectar recargo aplicado
        $monthlyByChild = \App\Models\MonthlyOrder::query()
            ->whereIn('child_id', $childIds)
            ->where('month', $month)
            ->where('year', $year)
            ->get()
            ->keyBy('child_id');

        $aggregated = $rows->map(function ($r) use ($status, $details, $monthlyByChild) {
            $monthlyStatus = $r->monthly_status;
            $computedStatus = $monthlyStatus === 'rejected'
                ? 'rejected'
                : (($r->paid_days == $r->total_days && $r->total_days > 0) ? 'paid' : 'pending');
            if ($status !== 'all' && $computedStatus !== $status) {
                return null;
            }
            $days = collect(explode(',', (string) $r->days))
                ->filter()
                ->values()
                ->all();
            $byDay = collect($details->get($r->child_id, collect()))
                ->map(fn($d) => [
                    'date' => \Illuminate\Support\Carbon::parse($d->date)->toDateString(),
                    'service' => (string) $d->service,
                ])->values()->all();

            // Calcular recargo aplicado si existe monthly_orders (comparar total mensual vs base)
            $monthly = $monthlyByChild->get($r->child_id);
            $baseTotal = (int) $r->total_cents;
            $surcharge = [ 'applied' => false, 'percent' => 0, 'cents' => 0 ];
            if ($monthly) {
                $monthlyTotal = (int) $monthly->total_cents;
                $diff = $monthlyTotal - $baseTotal;
                if ($diff > 0 && $baseTotal > 0) {
                    $pct = round(($diff / $baseTotal) * 100);
                    // Aproximar a 5 o 10 si corresponde
                    $mapped = 0;
                    if ($pct >= 8) { $mapped = 10; }
                    elseif ($pct >= 3) { $mapped = 5; }
                    $surcharge = [ 'applied' => $mapped > 0, 'percent' => $mapped, 'cents' => $diff ];
                }
            }
            return [
                'child_id' => $r->child_id,
                'dni' => $r->dni,
                'child' => trim($r->name . ' ' . $r->lastname),
                'school' => $r->school,
                'grado' => $r->grado,
                'days' => $days,
                'days_count' => count($days),
                'total_cents' => (int) $r->total_cents,
                'status' => $computedStatus,
                'days_with_service' => $byDay,
                'surcharge' => $surcharge,
            ];
        })->filter()->values();

        return Inertia::render('Admin/MonthlyOrders', [
            'filters' => [
                'status' => $status,
                'q' => $search,
                'month' => $month,
                'year' => $year,
            ],
            'orders' => $aggregated,
            'month' => $month,
            'year' => $year,
        ]);
    }
    // ADMIN: confirmar pago por días (marca todas las daily_orders del período como paid)
    public function adminDailyConfirm(Request $request)
    {
        $validated = $request->validate([
            'child_id' => ['required','exists:children,id'],
            'month' => ['required','integer','min:1','max:12'],
            'year' => ['required','integer','min:2000'],
        ]);

        $start = Carbon::create($validated['year'], $validated['month'], 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $updated = DailyOrder::where('child_id', $validated['child_id'])
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->update([
                'status' => 'paid',
                'updated_at' => now(),
            ]);

        // Actualizar/crear monthly_orders como pagada
        MonthlyOrder::updateOrCreate(
            [
                'child_id' => $validated['child_id'],
                'month' => (int) $validated['month'],
                'year' => (int) $validated['year'],
            ],
            [
                'status' => 'paid',
                'decision_at' => now(),
            ]
        );

        return back()->with('success', "Pago confirmado. Días actualizados: $updated");
    }

    // ADMIN: detalle de una orden mensual por alumno (por mes/año)
    public function adminMonthlyShow(Request $request, Children $child, int $month, int $year)
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $orders = DailyOrder::query()
            ->where('child_id', $child->id)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->with('serviceType:id,name,price_cents')
            ->orderBy('date')
            ->get();

        $summary = $orders->map(function ($o) {
            return [
                'date' => \Illuminate\Support\Carbon::parse($o->date)->toDateString(),
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
                'status' => $o->status,
            ];
        });

        $baseTotal = $summary->sum('price_cents');

        $monthly = MonthlyOrder::where('child_id', $child->id)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        $surcharge = [ 'applied' => false, 'percent' => 0, 'cents' => 0 ];
        if ($monthly) {
            $diff = (int) $monthly->total_cents - (int) $baseTotal;
            if ($diff > 0 && $baseTotal > 0) {
                $pct = round(($diff / $baseTotal) * 100);
                $mapped = 0;
                if ($pct >= 8) { $mapped = 10; }
                elseif ($pct >= 3) { $mapped = 5; }
                $surcharge = [ 'applied' => $mapped > 0, 'percent' => $mapped, 'cents' => $diff ];
            }
        }

    return Inertia::render('Admin/MonthlyOrderDetail', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'lastname' => $child->lastname,
                'dni' => $child->dni,
                'school' => $child->school,
                'grado' => $child->grado,
            ],
            'month' => $month,
            'year' => $year,
            'summary' => $summary->values(),
            'baseTotalCents' => (int) $baseTotal,
            'monthlyTotalCents' => (int) optional($monthly)->total_cents ?? (int) $baseTotal,
            'surcharge' => $surcharge,
            // Si monthly existe y está rechazado, priorizar ese estado
            'status' => ($monthly && $monthly->status === 'rejected')
                ? 'rejected'
                : ($orders->count() > 0 && $orders->every(fn($o) => $o->status === 'paid') ? 'paid' : 'pending'),
        ]);
    }

    // ADMIN: historial de pagos (solo días en estado 'paid') para un alumno en un período
    public function adminMonthlyPaidShow(Request $request, Children $child, int $month, int $year)
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
                'date' => \Illuminate\Support\Carbon::parse($o->date)->toDateString(),
                'service' => optional($o->serviceType)->name,
                'price_cents' => optional($o->serviceType)->price_cents ?? 0,
                'status' => $o->status,
            ];
        })->values();

        $baseTotal = $summary->sum('price_cents');

        $monthly = MonthlyOrder::where('child_id', $child->id)
            ->where('month', $month)
            ->where('year', $year)
            ->first();

        $surcharge = [ 'applied' => false, 'percent' => 0, 'cents' => 0 ];
        if ($monthly) {
            $diff = (int) $monthly->total_cents - (int) $baseTotal;
            if ($diff > 0 && $baseTotal > 0) {
                $pct = round(($diff / $baseTotal) * 100);
                $mapped = 0;
                if ($pct >= 8) { $mapped = 10; }
                elseif ($pct >= 3) { $mapped = 5; }
                $surcharge = [ 'applied' => $mapped > 0, 'percent' => $mapped, 'cents' => $diff ];
            }
        }

        return Inertia::render('Admin/MonthlyOrderPaidDetail', [
            'child' => [
                'id' => $child->id,
                'name' => $child->name,
                'lastname' => $child->lastname,
                'dni' => $child->dni,
                'school' => $child->school,
                'grado' => $child->grado,
            ],
            'month' => $month,
            'year' => $year,
            'summary' => $summary,
            'baseTotalCents' => (int) $baseTotal,
            'monthlyTotalCents' => (int) optional($monthly)->total_cents ?? (int) $baseTotal,
            'surcharge' => $surcharge,
        ]);
    }

    // ADMIN: rechazo de orden mensual (marca daily_orders del período como pending y opcionalmente registra decision)
    public function adminMonthlyReject(Request $request)
    {
        $validated = $request->validate([
            'child_id' => ['required','exists:children,id'],
            'month' => ['required','integer','min:1','max:12'],
            'year' => ['required','integer','min:2000'],
            'reason' => ['nullable','string','max:500'],
        ]);

        $start = Carbon::create($validated['year'], $validated['month'], 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        // Colocar todas las órdenes en rejected (si estaban paid, se revierte y deja constancia de rechazo)
        DailyOrder::where('child_id', $validated['child_id'])
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->update([
                'status' => 'rejected',
                'updated_at' => now(),
            ]);

        // Registrar decisión a nivel monthly_orders si existe (y marcar rechazado)
        MonthlyOrder::where('child_id', $validated['child_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->update([
                'status' => 'rejected',
                'decision_at' => now(),
            ]);

        return back()->with('success', 'Orden rechazada y días marcados como pendientes.');
    }

    // ADMIN: eliminar registros del período (todas las daily_orders del mes/año para un alumno)
    public function adminMonthlyDelete(Request $request)
    {
        $validated = $request->validate([
            'child_id' => ['required','exists:children,id'],
            'month' => ['required','integer','min:1','max:12'],
            'year' => ['required','integer','min:2000'],
        ]);

        $start = Carbon::create($validated['year'], $validated['month'], 1)->startOfMonth();
        $end = (clone $start)->endOfMonth();

        $deleted = DailyOrder::where('child_id', $validated['child_id'])
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->delete();

        // También remover monthly_orders del período si existe
        MonthlyOrder::where('child_id', $validated['child_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->delete();

        return back()->with('success', "Registros eliminados: $deleted");
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
            // Nueva lógica: permitir siempre editar (re-contratar) incluso si el mes vigente continúa.
            // El ciclo anterior se considera un bloque cerrado; las nuevas selecciones pueden sobrescribir días futuros del mismo mes.
            return [true, ''];
        }

        // Estado desconocido: por seguridad, bloquear
        return [false, 'No es posible editar este período en este momento.'];
    }
}
