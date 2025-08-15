<?php

use App\Http\Controllers\ChildrenController;
use App\Http\Controllers\ProfileController;
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
});

require __DIR__.'/auth.php';
