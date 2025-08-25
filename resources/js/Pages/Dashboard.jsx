import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Dashboard({ viandaToday = [], comedorEconomicoToday = [], comedorPremiumToday = [], dateLabel = '' }) {
    // Estados de filtro por escuela
    const [schoolVianda, setSchoolVianda] = useState('all');
    const [schoolEco, setSchoolEco] = useState('all');
    const [schoolPrem, setSchoolPrem] = useState('all');

    const schoolsVianda = useMemo(() => Array.from(new Set(viandaToday.map(r => r.school || ''))).filter(Boolean), [viandaToday]);
    const schoolsEco = useMemo(() => Array.from(new Set(comedorEconomicoToday.map(r => r.school || ''))).filter(Boolean), [comedorEconomicoToday]);
    const schoolsPrem = useMemo(() => Array.from(new Set(comedorPremiumToday.map(r => r.school || ''))).filter(Boolean), [comedorPremiumToday]);

    const viandaFiltered = useMemo(() => schoolVianda === 'all' ? viandaToday : viandaToday.filter(r => (r.school || '') === schoolVianda), [viandaToday, schoolVianda]);
    const ecoFiltered = useMemo(() => schoolEco === 'all' ? comedorEconomicoToday : comedorEconomicoToday.filter(r => (r.school || '') === schoolEco), [comedorEconomicoToday, schoolEco]);
    const premFiltered = useMemo(() => schoolPrem === 'all' ? comedorPremiumToday : comedorPremiumToday.filter(r => (r.school || '') === schoolPrem), [comedorPremiumToday, schoolPrem]);

    const downloadPdf = (serviceKey) => {
        const url = route('admin.reports.daily-service', serviceKey) + '?date=' + (dateLabel.split('/').reverse().join('-')); // dd/mm/YYYY -> YYYY-mm-dd
        window.open(url, '_blank');
    };
    return (
        <AuthenticatedLayout>
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
                        {/* <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <h4 className="text-base font-semibold text-gray-900">Soporte</h4>
                            <p className="mt-1 text-sm text-gray-600">contacto@tucatering.com</p>
                        </div> */}
                    </div>

                    {/* Tablas del día por servicio */}
                    <div className="mt-12 space-y-10">
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">Vianda - Hoy ({dateLabel})</h3>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <select value={schoolVianda} onChange={e=>setSchoolVianda(e.target.value)} className="rounded-md border-gray-300 text-xs focus:border-orange-400 focus:ring-orange-400">
                                            <option value="all">Todas las escuelas</option>
                                            {schoolsVianda.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={()=>downloadPdf('vianda')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">PDF</button>
                                    <span className="text-xs text-gray-500">Total: {viandaFiltered.length}</span>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                                <table className="min-w-full table-auto text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="px-4 py-2 font-medium">Alumno</th>
                                            <th className="px-4 py-2 font-medium">DNI</th>
                                            <th className="px-4 py-2 font-medium">Escuela</th>
                                            <th className="px-4 py-2 font-medium">Grado</th>
                                            <th className="px-4 py-2 font-medium">Observacion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {viandaFiltered.map(row => (
                                            <tr key={row.child_id} className="text-gray-800">
                                                <td className="px-4 py-2">{row.full_name}</td>
                                                <td className="px-4 py-2">{row.dni || '-'}</td>
                                                <td className="px-4 py-2">{row.school || '-'}</td>
                                                <td className="px-4 py-2">{row.grado || '-'}</td>
                                                <td className="px-4 py-2">{row.condition || '-'}</td>
                                            </tr>
                                        ))}
                                        {viandaFiltered.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio hoy.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">Comedor Económico - Hoy ({dateLabel})</h3>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <select value={schoolEco} onChange={e=>setSchoolEco(e.target.value)} className="rounded-md border-gray-300 text-xs focus:border-orange-400 focus:ring-orange-400">
                                            <option value="all">Todas las escuelas</option>
                                            {schoolsEco.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={()=>downloadPdf('economico')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">PDF</button>
                                    <span className="text-xs text-gray-500">Total: {ecoFiltered.length}</span>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                                <table className="min-w-full table-auto text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="px-4 py-2 font-medium">Alumno</th>
                                            <th className="px-4 py-2 font-medium">DNI</th>
                                            <th className="px-4 py-2 font-medium">Escuela</th>
                                            <th className="px-4 py-2 font-medium">Grado</th>
                                            <th className="px-4 py-2 font-medium">Observacion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ecoFiltered.map(row => (
                                            <tr key={row.child_id} className="text-gray-800">
                                                <td className="px-4 py-2">{row.full_name}</td>
                                                <td className="px-4 py-2">{row.dni || '-'}</td>
                                                <td className="px-4 py-2">{row.school || '-'}</td>
                                                <td className="px-4 py-2">{row.grado || '-'}</td>
                                                <td className="px-4 py-2">{row.condition || '-'}</td>
                                            </tr>
                                        ))}
                                        {ecoFiltered.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio hoy.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900">Comedor Premium - Hoy ({dateLabel})</h3>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <select value={schoolPrem} onChange={e=>setSchoolPrem(e.target.value)} className="rounded-md border-gray-300 text-xs focus:border-orange-400 focus:ring-orange-400">
                                            <option value="all">Todas las escuelas</option>
                                            {schoolsPrem.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={()=>downloadPdf('premium')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">PDF</button>
                                    <span className="text-xs text-gray-500">Total: {premFiltered.length}</span>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                                <table className="min-w-full table-auto text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-600">
                                            <th className="px-4 py-2 font-medium">Alumno</th>
                                            <th className="px-4 py-2 font-medium">DNI</th>
                                            <th className="px-4 py-2 font-medium">Escuela</th>
                                            <th className="px-4 py-2 font-medium">Grado</th>
                                            <th className="px-4 py-2 font-medium">Observacion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {premFiltered.map(row => (
                                            <tr key={row.child_id} className="text-gray-800">
                                                <td className="px-4 py-2">{row.full_name}</td>
                                                <td className="px-4 py-2">{row.dni || '-'}</td>
                                                <td className="px-4 py-2">{row.school || '-'}</td>
                                                <td className="px-4 py-2">{row.grado || '-'}</td>
                                                <td className="px-4 py-2">{row.condition || '-'}</td>
                                            </tr>
                                        ))}
                                        {premFiltered.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio hoy.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
