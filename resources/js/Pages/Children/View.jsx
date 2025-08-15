import ParentLayout from '@/Layouts/ParentLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function View({ child }) {
    const [showDelete, setShowDelete] = useState(false);

    return (
        <ParentLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Detalle del alumno</h2>
                    <div className="flex gap-2">
                        <Link
                            href={route('children.index')}
                            className="inline-flex items-center rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                        >
                            Volver
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="mx-auto max-w-7xl p-6">
                <div className="relative rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                    {/* Acciones dentro de la card: Editar (lápiz) + Eliminar (papelera) */}
                    <div className="absolute right-4 top-4 flex items-center gap-2">
                        <Link
                            href={route('children.edit', child.id)}
                            title="Editar"
                            aria-label="Editar"
                            className="inline-flex items-center justify-center rounded-md border border-orange-200 bg-white p-2 text-orange-600 shadow-sm transition hover:bg-orange-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5L20.5 7.5 7 21H3v-4L16.5 3.5z" />
                            </svg>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setShowDelete(true)}
                            title="Eliminar"
                            aria-label="Eliminar"
                            className="inline-flex items-center justify-center rounded-md border border-red-200 bg-white p-2 text-red-600 shadow-sm transition hover:bg-red-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                            </svg>
                        </button>
                    </div>

                    <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <dt className="text-sm text-gray-500">Nombre</dt>
                            <dd className="text-base font-medium text-gray-900">{child.name}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Apellido</dt>
                            <dd className="text-base font-medium text-gray-900">{child.lastname}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">DNI</dt>
                            <dd className="text-base font-medium text-gray-900">{child.dni}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Colegio</dt>
                            <dd className="text-base font-medium text-gray-900">{child.school || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Grado</dt>
                            <dd className="text-base font-medium text-gray-900">{child.grado || '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-sm text-gray-500">Condición</dt>
                            <dd className="text-base font-medium text-gray-900">{child.condition || '-'}</dd>
                        </div>
                    </dl>

                    {/* Modal de confirmación de eliminación */}
                    {showDelete && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setShowDelete(false)}
                            />
                            <div
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="delete-title"
                                className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
                            >
                                <h3 id="delete-title" className="text-lg font-semibold text-gray-900">
                                    Eliminar alumno
                                </h3>
                                <p className="mt-2 text-sm text-gray-600">
                                    ¿Estás seguro de eliminar este alumno? Esta acción no se puede deshacer.
                                </p>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowDelete(false)}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <Link
                                        href={route('children.destroy', child.id)}
                                        method="delete"
                                        as="button"
                                        className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                    >
                                        Eliminar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ParentLayout>
    );
}
