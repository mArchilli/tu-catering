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
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard-padre', function () {
    return Inertia::render('DashboardPadre');
})->middleware(['auth', 'verified'])->name('dashboard.padre');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('children', ChildrenController::class);
    Route::delete('children/{child}', [ChildrenController::class, 'destroy'])->name('children.destroy');
    Route::get('children/{child}/view', [ChildrenController::class, 'show'])->name('children.view');
    Route::get('/menu', [MenuController::class, 'edit'])->name('menu.edit');
    Route::post('/menu', [MenuController::class, 'update'])->name('menu.update');
    Route::get('/prices', [PriceController::class, 'edit'])->name('prices.edit');
    Route::post('/prices', [PriceController::class, 'update'])->name('prices.update');
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
        Route::post('/admin/monthly-orders/{order}/confirm', [OrderController::class, 'adminMonthlyConfirm'])->name('admin.monthly-orders.confirm');
    Route::post('/admin/monthly-orders/{order}/reject', [OrderController::class, 'adminMonthlyReject'])->name('admin.monthly-orders.reject');
    Route::delete('/admin/monthly-orders/{order}', [OrderController::class, 'adminMonthlyDestroy'])->name('admin.monthly-orders.destroy');
    });
});

require __DIR__.'/auth.php';
