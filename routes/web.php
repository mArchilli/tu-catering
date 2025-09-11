<?php

use App\Http\Controllers\ChildrenController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\OrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $today = today();
    $todayOrders = \App\Models\DailyOrder::query()
        ->whereDate('date', $today)
        ->where('daily_orders.status', 'paid')
        ->join('service_types', 'daily_orders.service_type_id', '=', 'service_types.id')
        ->join('children', 'daily_orders.child_id', '=', 'children.id')
        ->select(
            'daily_orders.child_id',
            'service_types.name as service_name',
            'children.name',
            'children.lastname',
            'children.dni',
            'children.school',
            'children.grado',
            'children.condition'
        )
        ->orderBy('children.lastname')
        ->orderBy('children.name')
        ->get();

    $mapFn = fn($row) => [
        'child_id' => $row->child_id,
        'full_name' => trim($row->name . ' ' . $row->lastname),
        'dni' => $row->dni,
        'school' => $row->school,
        'grado' => $row->grado,
        'condition' => $row->condition,
    ];

    $viandaToday = $todayOrders->where('service_name', 'Vianda')->map($mapFn)->values();
    $comedorEconomicoToday = $todayOrders->where('service_name', 'Comedor Económico')->map($mapFn)->values();
    $comedorPremiumToday = $todayOrders->where('service_name', 'Comedor Premium')->map($mapFn)->values();

    // Alumnos con estado pendiente o sin días (mes actual)
    $monthStart = now()->startOfMonth()->toDateString();
    $monthEnd = now()->endOfMonth()->toDateString();
    $pendingOrEmptyQuery = \App\Models\Children::query()
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
        ->orderBy('children.name');

    $page = (int) request()->get('p_page', 1);
    $perPage = 10;
    $results = $pendingOrEmptyQuery->get()->map(function($r){
        if ($r->total_days == 0) {
            $status = 'none';
        } else {
            $status = ($r->paid_days == $r->total_days) ? 'paid' : 'pending';
        }
        return [
            'id' => $r->id,
            'name' => $r->name,
            'lastname' => $r->lastname,
            'dni' => $r->dni,
            'school' => $r->school,
            'grado' => $r->grado,
            'condition' => $r->condition,
            'status' => $status,
            'total_cents' => (int) $r->total_cents,
            'total_days' => (int) $r->total_days,
            'paid_days' => (int) $r->paid_days,
        ];
    })->filter(function($row){
        return in_array($row['status'], ['pending','none']);
    })->values();

    // Filtro por escuela (p_school)
    $schoolParam = request()->get('p_school', 'all');
    $schools = $results->pluck('school')->filter()->unique()->sort()->values();
    if ($schoolParam !== 'all') {
        $results = $results->filter(fn($r) => ($r['school'] ?? '') === $schoolParam)->values();
    }

    $totalPendingRecords = $results->count();
    $paged = $results->forPage($page, $perPage)->values();
    $pagination = [
        'page' => $page,
        'per_page' => $perPage,
        'total' => $totalPendingRecords,
        'last_page' => (int) ceil(max(1,$totalPendingRecords) / $perPage),
    ];

    return Inertia::render('Dashboard', [
        'viandaToday' => $viandaToday,
        'comedorEconomicoToday' => $comedorEconomicoToday,
        'comedorPremiumToday' => $comedorPremiumToday,
        'dateLabel' => $today->format('d/m/Y'),
        'pendingStudents' => $paged,
        'pendingStudentsPagination' => $pagination,
        'pendingStudentsSchools' => $schools,
        'pendingStudentsFilters' => [
            'school' => $schoolParam,
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard-padre', function () {
    return Inertia::render('DashboardPadre');
})->middleware(['auth', 'verified'])->name('dashboard.padre');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/perfil', [ProfileController::class, 'editParent'])->name('parent.profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('children', ChildrenController::class);
    Route::delete('children/{child}', [ChildrenController::class, 'destroy'])->name('children.destroy');
    Route::get('children/{child}/view', [ChildrenController::class, 'show'])->name('children.view');
    Route::get('/menu', [MenuController::class, 'edit'])->name('menu.edit');
    Route::post('/menu', [MenuController::class, 'update'])->name('menu.update');
    Route::get('/prices', [PriceController::class, 'edit'])->name('prices.edit');
    Route::post('/prices', [PriceController::class, 'update'])->name('prices.update');
    Route::post('/prices/service-types', [PriceController::class, 'updateServiceTypePrices'])->name('prices.update.service-types');
    Route::get('/padre/menu', [MenuController::class, 'padre'])->name('menus.padre');
    Route::get('/padre/precios', [MenuController::class, 'preciosPadre'])->name('precios.padre');
    // Calendario de pedidos por hijo
    Route::get('children/{child}/orders', [OrderController::class, 'create'])->name('children.orders.create');
    Route::get('children/{child}/orders/summary', [OrderController::class, 'summaryExisting'])->name('children.orders.summary.get');
    Route::post('children/{child}/orders/summary', [OrderController::class, 'summary'])->name('children.orders.summary');
    Route::post('children/{child}/orders', [OrderController::class, 'store'])->name('children.orders.store');
    Route::get('children/{child}/payment', [OrderController::class, 'payment'])->name('children.payment');
    Route::post('children/{child}/payment/confirm', [OrderController::class, 'paymentConfirm'])->name('children.payment.confirm');
    // Admin: órdenes mensuales (protegidas por middleware de admin)
    Route::middleware([\App\Http\Middleware\AdminOnly::class])->group(function () {
    Route::get('/admin/monthly-orders', [OrderController::class, 'adminMonthlyIndex'])->name('admin.monthly-orders.index');
    Route::post('/admin/daily-orders/confirm', [OrderController::class, 'adminDailyConfirm'])->name('admin.daily-orders.confirm');
    Route::get('/admin/reports/daily-service/{service}', [\App\Http\Controllers\DailyServiceReportController::class, 'servicePdf'])->name('admin.reports.daily-service');
    Route::get('/admin/reports/pending-students', [\App\Http\Controllers\PendingStudentsReportController::class, 'pdf'])->name('admin.reports.pending-students');
    });
});

require __DIR__.'/auth.php';

// Fallback 404 para rutas no existentes (después de todas las definiciones anteriores)
Route::fallback(function () {
    if (request()->is('api/*')) {
        return response()->json(['message' => 'Not Found'], 404);
    }
    return Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404);
});
