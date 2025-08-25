import ParentLayout from '@/Layouts/ParentLayout';
import { Link, usePage } from '@inertiajs/react';

export default function ChildrenIndex({ children: items = [] }) {
    const { auth } = usePage().props;

    return (
        <ParentLayout    
        >
            
            <div className="mx-auto max-w-7xl p-6">
                <div className="overflow-hidden rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-400 shadow-sm my-6">
                        <div className="p-6 text-white sm:p-8">
                            <h3 className="text-lg font-semibold">Alumnos registrados</h3>
                            <p className="mt-1 text-sm text-orange-50">
                                Consultá los alumnos registrados y gestiona su información.
                            </p>
                        </div>
                    </div>
                
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {items.length
                            ? `Total: ${items.length} alumno(s)`
                            : ''}
                    </p>
                    <Link
                        href={route().has('children.create') ? route('children.create') : '#'}
                        className="rounded bg-orange-400 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-500 focus:outline-none focus:ring"
                    >
                        Agregar alumno
                    </Link>
                </div>

                {items.length === 0 && (
                    <div className="rounded border border-dashed border-gray-300 bg-white p-10 text-center">
                        <p className="mb-4 text-gray-700">
                            Aún no registraste ningún alumno.
                        </p>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map(child => (
                            <div
                                key={child.id}
                                className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-semibold">
                                        {child.name?.[0]}{child.lastname?.[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="truncate text-base font-semibold text-gray-900">
                                            {child.name} {child.lastname}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            DNI: <span className="font-medium">{child.dni}</span>
                                        </div>
                                        <div className="mt-0.5 text-sm text-gray-500">
                                            Escuela: {child.school || '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {child.payment_status === 'paid' && (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Pago confirmado</span>
                                    )}
                                    {child.payment_status === 'pending' && (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">Pago pendiente</span>
                                    )}
                                    {child.payment_status === null && (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">Sin días cargados</span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-end gap-2">
                                    <Link
                                        href={route().has('children.show') ? route('children.show', child.id) : '#'}
                                        className="inline-flex items-center rounded-md border border-orange-400 bg-white px-3 py-1.5 text-sm font-medium text-orange-400 hover:bg-orange-50"
                                    >
                                        Ver
                                    </Link>
                                    <Link
                                        href={route().has('children.edit') ? route('children.edit', child.id) : '#'}
                                        className="inline-flex items-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-500"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ParentLayout>
    );
}
