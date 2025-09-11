import ParentLayout from '@/Layouts/ParentLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react'; // + NUEVO

export default function DashboardPadre() {
    // clases base + hover (mismas que se usan en el dashboard del panel de administración)
    const cardBase = 'rounded-xl border border-orange-100 bg-white p-6 shadow-sm transition-transform duration-200 transform';
    const cardHover = 'hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:border-orange-200';
    const cardClasses = `${cardBase} ${cardHover}`;

    // NUEVO: modal de confirmación de comprobante
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    useEffect(() => {
        try {
            if (localStorage.getItem('paymentConfirmed') === '1') {
                setShowPaymentModal(true);
                localStorage.removeItem('paymentConfirmed');
            }
        } catch (e) {
            // no-op
        }
    }, []);

    return (
        <ParentLayout
        >
            <Head title="Inicio" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Banner de bienvenida */}
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-400 shadow-sm">
                        <div className="p-6 text-white sm:p-8">
                            <h3 className="text-lg font-semibold">¡Bienvenido!</h3>
                            <p className="mt-1 text-sm text-orange-50">
                                Gestioná tus hijos y mantené actualizada su información.
                            </p>
                            
                        </div>
                    </div>

                    {/* Sección de ayuda */}
                    <div className="mt-4 sm:mt-6">
                        <div className="rounded-xl bg-white border border-orange-100/60 p-4 sm:p-5 text-center">
                            <p className="text-sm text-gray-600">
                                ¿Estás perdido? Hace click en
                                {' '}
                                <a
                                    href="/docs/tutorial.pdf"
                                    download
                                    className="font-semibold text-orange-500 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 rounded"
                                >
                                    Tutorial
                                </a>
                                {' '}para bajar el PDF con las instrucciones.
                            </p>
                        </div>
                    </div>

                    {/* Accesos rápidos */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        { /* Mis alumnos - aplicado cardClasses */ }
                        <div className={cardClasses}>
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Mis hijos</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultá o edita los datos de tus hijos/as.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route().has('children.index') ? route('children.index') : '#'}
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Ver hijos →
                                </Link>
                            </div>
                        </div>

                        { /* Mi perfil - aplicado cardClasses */ }
                        <div className={cardClasses}>
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
                                    <path d="M2 22a9.94 9.94 0 0 1 10-6 9.94 9.94 0 0 1 10 6" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Mi perfil</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Actualizá tu nombre, email o contraseña cuando lo necesites.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route('parent.profile.edit')}
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Editar perfil →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                        { /* Menu - aplicado cardClasses */ }
                        <div className={cardClasses}>
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Menu</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultá el menú, conoce nuestro menú general y nuestro menú económico.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route('menus.padre')}
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Ver menu →
                                </Link>
                            </div>
                        </div>

                        { /* Precios - aplicado cardClasses */ }
                        <div className={cardClasses}>
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" />
                                    <path d="M2 22a9.94 9.94 0 0 1 10-6 9.94 9.94 0 0 1 10 6" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Precios</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultá nuestros precios, de nuestro menú general y nuestro menú económico.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route('precios.padre')}
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Ver precios →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NUEVO: Modal de confirmación */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" aria-hidden="true"></div>
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="relative z-10 w-full max-w-md rounded-xl bg-white p-7 shadow-xl mx-5"
                    >
                        <h3 className="text-lg font-semibold text-gray-900">Comprobante enviado</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Se informó a la administración su pedido. No verá cambios hasta que el administrador confirme la recepción del pago.
                        </p>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ParentLayout>
    );
}
