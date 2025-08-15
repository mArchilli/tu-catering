import { Link, usePage } from '@inertiajs/react';

export default function Hero() {
    const user = usePage().props.auth?.user;

    // Destino de panel según rol
    const dashboardHref = (() => {
        if (!user) return null;
        const role = (user.role || '').toString().toLowerCase();
        if (typeof route === 'function') {
            if (route().has('dashboard.padre') && ['padre', 'parent', 'tutor'].includes(role)) {
                return route('dashboard.padre');
            }
            if (route().has('dashboard')) {
                return route('dashboard');
            }
        }
        return '/dashboard';
    })();

    return (
        <header className="relative isolate overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-500 text-white">
            {/* Barra superior con botones a la derecha */}
            <div className="absolute inset-x-0 top-0 z-10">
                <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-6 py-4 lg:px-8">
                    {user ? (
                        <Link
                            href={dashboardHref}
                            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
                        >
                            Ir al panel
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Iniciar sesión
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                        Tu Catering
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-orange-50">
                        Servicio Alimentario Escolar. Trabajamos con personal con
                        muchos años de experiencia y nos dedicamos a brindar un
                        servicio de calidad desde hace 5 años.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="#services"
                            className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
                        >
                            Conocer servicios
                        </a>
                        <a
                            href="#contacto"
                            className="inline-flex items-center rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Contactanos
                        </a>
                        {/* ...existing code... (eliminados botones de login/registro del bloque central) */}
                    </div>
                </div>
            </div>
        </header>
    );
}
