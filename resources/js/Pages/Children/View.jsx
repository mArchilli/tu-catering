import ParentLayout from '@/Layouts/ParentLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function View({ child, dailyOrders = [], summary = { total_days:0, paid_days:0, pending_days:0, total_cents:0 }, month, year }) {
    const [showDelete, setShowDelete] = useState(false);
    // Controles de período (para sección Pagadas)
    const [m, setM] = useState(month);
    const [y, setY] = useState(year);
    useEffect(() => { setM(month); }, [month]);
    useEffect(() => { setY(year); }, [year]);
    const applyPeriod = () => router.get(route('children.view', child.id), { month: m, year: y }, { preserveScroll: true, replace: true });

    // Separar pendientes y pagadas
    const pendingOrders = useMemo(() => dailyOrders.filter(d => d.status === 'pending'), [dailyOrders]);
    const paidOrders = useMemo(() => dailyOrders.filter(d => d.status === 'paid'), [dailyOrders]);
    const pendingTotalCents = useMemo(() => pendingOrders.reduce((acc, d) => acc + (d.price_cents || 0), 0), [pendingOrders]);
    const paidTotalCents = useMemo(() => paidOrders.reduce((acc, d) => acc + (d.price_cents || 0), 0), [paidOrders]);
    // Paginación para pagadas (10 elementos por página)
    const pageSize = 10;
    const [paidPage, setPaidPage] = useState(1);
    useEffect(() => { setPaidPage(1); }, [m, y, paidOrders.length]);
    const paidTotalPages = useMemo(() => Math.max(1, Math.ceil(paidOrders.length / pageSize)), [paidOrders.length]);
    const paidPageItems = useMemo(() => paidOrders.slice((paidPage - 1) * pageSize, paidPage * pageSize), [paidOrders, paidPage]);

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
                        <Link
                            href={route('children.orders.create', child.id)}
                            className="inline-flex items-center rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
                        >
                            Calendario de servicios
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Detalle de Alumno" />
            
            <div className="mx-auto max-w-7xl p-6 space-y-8">
                {/* Contenedor: Datos del alumno */}
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
                            <dt className="text-sm text-gray-500">Observacion</dt>
                            <dd className="text-base font-medium text-gray-900">{child.condition || '-'}</dd>
                        </div>
                    </dl>

                </div>

                {/* Contenedor: Pendientes */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-800">Pendientes</h3>
                            <p className="text-xs text-gray-500">Período: {String(month).padStart(2,'0')}/{year}</p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs">
                            <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-medium text-yellow-800">Días: {pendingOrders.length}</span>
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-700">Total: {money(pendingTotalCents)}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-50 text-left text-gray-600">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Fecha</th>
                                    <th className="px-3 py-2 font-medium">Servicio</th>
                                    <th className="px-3 py-2 font-medium">Precio</th>
                                    <th className="px-3 py-2 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingOrders.map(d => (
                                    <tr key={d.date + d.service} className="text-gray-800">
                                        <td className="px-3 py-2 whitespace-nowrap">{d.date}</td>
                                        <td className="px-3 py-2">{d.service || '-'}</td>
                                        <td className="px-3 py-2 font-medium">{money(d.price_cents)}</td>
                                        <td className="px-3 py-2">
                                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-800">Pendiente</span>
                                        </td>
                                    </tr>
                                ))}
                                {pendingOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-600">No hay días pendientes para este mes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Contenedor: Pagadas con selector de período y paginación */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-800">Pagadas</h3>
                            <p className="text-xs text-gray-500">Período: {String(month).padStart(2,'0')}/{year}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <label className="text-xs text-gray-600">Periodo</label>
                            <select
                                className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-20"
                                value={m}
                                onChange={(e) => setM(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <option key={i+1} value={i+1}>{String(i+1).padStart(2,'0')}</option>
                                ))}
                            </select>
                            <select
                                className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-24"
                                value={y}
                                onChange={(e) => setY(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }).map((_, idx) => {
                                    const yr = new Date().getFullYear() - 2 + idx; // desde hace 2 hasta el próximo 2
                                    return <option key={yr} value={yr}>{yr}</option>;
                                })}
                            </select>
                            <button
                                onClick={applyPeriod}
                                className="rounded-md bg-orange-400 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500"
                            >Ver</button>
                            <div className="ml-2 hidden sm:block text-xs text-gray-500">Días: {paidOrders.length} · Total: {money(paidTotalCents)}</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="min-w-full table-auto text-sm">
                            <thead className="bg-gray-50 text-left text-gray-600">
                                <tr>
                                    <th className="px-3 py-2 font-medium">Fecha</th>
                                    <th className="px-3 py-2 font-medium">Servicio</th>
                                    <th className="px-3 py-2 font-medium">Precio</th>
                                    <th className="px-3 py-2 font-medium">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paidPageItems.map(d => (
                                    <tr key={d.date + d.service} className="text-gray-800">
                                        <td className="px-3 py-2 whitespace-nowrap">{d.date}</td>
                                        <td className="px-3 py-2">{d.service || '-'}</td>
                                        <td className="px-3 py-2 font-medium">{money(d.price_cents)}</td>
                                        <td className="px-3 py-2">
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">Pagado</span>
                                        </td>
                                    </tr>
                                ))}
                                {paidOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-600">No hay días pagados para este mes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Paginación */}
                    {paidOrders.length > 0 && (
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                        <div>
                          Página {paidPage} de {paidTotalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPaidPage(p => Math.max(1, p - 1))}
                            disabled={paidPage <= 1}
                            className="rounded-md bg-white px-3 py-1.5 font-medium ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >Anterior</button>
                          <button
                            onClick={() => setPaidPage(p => Math.min(paidTotalPages, p + 1))}
                            disabled={paidPage >= paidTotalPages}
                            className="rounded-md bg-white px-3 py-1.5 font-medium ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                          >Siguiente</button>
                        </div>
                      </div>
                    )}
                </div>

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
        </ParentLayout>
    );
}
