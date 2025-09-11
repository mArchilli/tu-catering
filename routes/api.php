<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
*/

// Ejemplo: obtener usuario autenticado (por defecto de Laravel)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Formulario de contacto
Route::post('/contact', [ContactController::class, 'send']);
Route::options('/contact', function () { return response()->noContent(); });

// Diagnóstico
Route::get('/contact/ping', function () {
    return response()->json(['ok' => true, 'ts' => now()->toISOString()]);
});