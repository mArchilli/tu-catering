<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $flash = [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ];

        // Notificación automática a padres por cambios (paid/rejected) aún no notificados
        $autoNotice = null;
        if ($user = $request->user()) {
            try {
                if (method_exists($user, 'children')) {
                    $childIds = $user->children()->pluck('id');
                    if ($childIds->isNotEmpty()) {
                        $pendingNotices = \App\Models\MonthlyOrder::whereIn('child_id', $childIds)
                            ->whereIn('status', ['paid','rejected'])
                            ->where('notified', false)
                            ->orderByDesc('decision_at')
                            ->limit(1)
                            ->first();
                        if ($pendingNotices) {
                            $autoNotice = $pendingNotices->status === 'paid'
                                ? 'Tu pago mensual fue aprobado.'
                                : 'Tu pago mensual fue rechazado. Revisá tus datos y volvé a intentarlo.';
                            // Marcar como notificado (best-effort, no crítico)
                            $pendingNotices->forceFill(['notified' => true])->save();
                        }
                    }
                }
            } catch (\Throwable $e) {
                // Silenciar: no romper la navegación por un aviso
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => $flash,
            'autoNotice' => $autoNotice,
        ];
    }
}
