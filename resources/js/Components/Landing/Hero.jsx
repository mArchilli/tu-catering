import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';

export default function Hero() {
    const user = usePage().props.auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

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
        <header className="relative isolate overflow-hidden bg-gradient-to-b from-orange-500 via-orange-500/80 to-white text-white">
            {/* Barra superior con logo y acciones */}
            <div className="absolute inset-x-0 top-0 z-10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8 backdrop-blur-sm">
                    {/* Logo de la marca en blanco mediante filtro (usa tu archivo en /public) */}
                    <Link href="/" className="inline-flex items-center gap-3 text-white">
                        <img
                            src="/logo-hero.png"
                            alt="Tu Catering"
                            className="h-16 w-auto filter brightness-0 invert drop-shadow"
                        />
                    </Link>
                    <div className="flex items-center gap-3">
                        {/* Acciones desktop */}
                        <div className="hidden sm:flex items-center gap-3">
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
                                        className="inline-flex items-center rounded-md border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 btn-zoom"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50 btn-zoom"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                        {/* Botón hamburguesa mobile */}
                        <button
                            type="button"
                            aria-label="Abrir menú"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="sm:hidden inline-flex items-center justify-center rounded-md border border-white/40 p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                {/* Panel móvil */}
                {mobileOpen && (
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 sm:hidden">
                        <div className="mt-2 rounded-lg border border-white/20 bg-white/10 backdrop-blur shadow-lg p-2">
                            {user ? (
                                <Link
                                    href={dashboardHref}
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full rounded-md px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Ir al panel
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMobileOpen(false)}
                                        className="block w-full rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={() => setMobileOpen(false)}
                                        className="block w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm hover:bg-orange-50"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Blobs decorativos para un look más orgánico */}
            <div className="pointer-events-none absolute -top-12 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
            <div className="pointer-events-none absolute top-20 -right-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl"></div>

            <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-40 sm:pt-50 sm:pb-50 lg:px-8">
                <div className="grid lg:grid-cols-2 items-center gap-10 mx-auto">
                    <div className="text-center lg:text-left">
                        {/* Badge superior con el servicio */}
                        
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight pb-4 sm:pb-2">Tu Catering</h1>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur ">
                            Servicio alimentario escolar
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                            <a
                                href="#services"
                                className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50 btn-zoom"
                            >
                                Conocer servicios
                            </a>
                            <a
                                href="#contacto"
                                className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 btn-zoom"
                            >
                                Contactanos
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block w-full">
                        {/* Rotor de 3 contenedores visibles con superposición */}
                        <div className="mx-auto max-w-lg hero-rotor" style={{ ['--gap']: '0.5rem' }}>
                            <div className="hero-card hero-card--a border border-white/20 bg-white/10 text-orange-50 shadow-lg p-4">
                                <p className="text-base leading-7">
                                    Nos dedicamos a brindar un servicio de calidad desde hace mas de 5 años.
                                </p>
                            </div>
                            <div className="hero-card hero-card--b border border-white/20 bg-white/10 text-orange-50 shadow-lg p-4">
                                <p className="text-base leading-7">
                                    Productos frescos, menús equilibrados y pensados para la comunidad escolar.
                                </p>
                            </div>
                            <div className="hero-card hero-card--c border border-white/20 bg-white/10 text-orange-50 shadow-lg p-4">
                                <p className="text-base leading-7">
                                    Compromiso, higiene y cumplimiento: tres pilares de nuestro servicio diario.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
