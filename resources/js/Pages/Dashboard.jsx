import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            
        >
            <Head title="Dashboard" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Bienvenida */}
                    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                        <div className="p-6 sm:p-8">
                            <h3 className="text-lg font-semibold text-gray-900">Bienvenido al panel de Administrador</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Accedé rápidamente a las secciones más utilizadas.
                            </p>
                            
                        </div>
                    </div>

                    {/* Tarjetas informativas */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M3 7h18M3 12h18M3 17h12" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Órdenes mensuales</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Revisá y confirmá los pagos enviados por los padres.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route().has('admin.monthly-orders.index') ? route('admin.monthly-orders.index') : '#'}
                                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                                >
                                    Ver órdenes →
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Menu</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultá el menu, carga o editá los archivos.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route().has('menu.edit') ? route('menu.edit') : '#'}
                                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                                >
                                    Ver menu →
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">Precios</h4>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultá los precios, carga o editá los archivos.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href={route().has('prices.edit') ? route('prices.edit') : '#'}
                                    className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                                >
                                    Ver precios →
                                </Link>
                            </div>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <h4 className="text-base font-semibold text-gray-900">Soporte</h4>
                            <p className="mt-1 text-sm text-gray-600">contacto@tucatering.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
