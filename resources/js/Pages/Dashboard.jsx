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
                            <h4 className="text-base font-semibold text-gray-900">Estado</h4>
                            <p className="mt-1 text-sm text-gray-600">Sistema funcionando correctamente.</p>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <h4 className="text-base font-semibold text-gray-900">Novedades</h4>
                            <p className="mt-1 text-sm text-gray-600">Próximas mejoras de interfaz.</p>
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
