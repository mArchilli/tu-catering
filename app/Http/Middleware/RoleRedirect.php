<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware que redirige según el role del usuario autenticado.
 */
class RoleRedirect
{
    /**
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // No intervenir en métodos distintos de GET (para permitir POST logout, updates, etc.)
        if (!$request->isMethod('get')) {
            return $next($request);
        }

        // Evitar interferir en rutas de autenticación/gestión específicas.
        if ($request->routeIs('logout', 'profile.*', 'verification.*', 'password.*')) {
            return $next($request);
        }

        if ($user) {
            // Solo actuar si el usuario está en un dashboard que no corresponde.
            if ($user->role === 'admin' && $request->routeIs('dashboard.padre')) {
                return redirect()->route('dashboard');
            }
            if ($user->role === 'padre' && $request->routeIs('dashboard')) {
                return redirect()->route('dashboard.padre');
            }
            // Si está en '/', cualquier otra página, o en su propio dashboard: permitir.
        }

        return $next($request);
    }
}
