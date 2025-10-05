import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';

export default function Dashboard({ viandaToday = [], comedorEconomicoToday = [], comedorPremiumToday = [], dateLabel = '', pendingStudents = [], pendingStudentsPagination = { page:1, per_page:10, total:0, last_page:1 }, pendingStudentsSchools = [], pendingStudentsFilters = { school: 'all' } }) {
    // Estados de filtro por escuela
    const [schoolVianda, setSchoolVianda] = useState('all');
    const [schoolEco, setSchoolEco] = useState('all');
    const [schoolPrem, setSchoolPrem] = useState('all');

    // Paginación por servicio
    const PER_PAGE = 10;
    const [pageVianda, setPageVianda] = useState(1);
    const [pageEco, setPageEco] = useState(1);
    const [pagePrem, setPagePrem] = useState(1);

    // Resetear a página 1 cuando cambian filtros o fecha
    useEffect(() => { setPageVianda(1); }, [schoolVianda, dateLabel]);
    useEffect(() => { setPageEco(1); }, [schoolEco, dateLabel]);
    useEffect(() => { setPagePrem(1); }, [schoolPrem, dateLabel]);

    // Helpers fecha
    const parseDateLabel = () => {
        const [dd, mm, yyyy] = dateLabel.split('/');
        if (!dd || !mm || !yyyy) return new Date();
        return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    };
    const toYmd = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const toDmy = (d) => {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };
    const goToDate = (d) => {
        const params = new URLSearchParams(window.location.search);
        params.set('date', toYmd(d));
        window.location.href = route('dashboard') + '?' + params.toString();
    };
    const goToday = () => {
        const now = new Date();
        goToDate(now);
    };
    const goTomorrow = () => {
        const d = parseDateLabel();
        const base = isNaN(d.getTime()) ? new Date() : d;
        const tomorrow = new Date(base);
        tomorrow.setDate(base.getDate() + 1);
        goToDate(tomorrow);
    };

    // Estado visual de botones Hoy/Mañana según la fecha mostrada
    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);
    const isTodaySelected = dateLabel === toDmy(todayDate);
    const isTomorrowSelected = dateLabel === toDmy(tomorrowDate);

    const schoolsVianda = useMemo(() => Array.from(new Set(viandaToday.map(r => r.school || ''))).filter(Boolean), [viandaToday]);
    const schoolsEco = useMemo(() => Array.from(new Set(comedorEconomicoToday.map(r => r.school || ''))).filter(Boolean), [comedorEconomicoToday]);
    const schoolsPrem = useMemo(() => Array.from(new Set(comedorPremiumToday.map(r => r.school || ''))).filter(Boolean), [comedorPremiumToday]);

    const viandaFiltered = useMemo(() => schoolVianda === 'all' ? viandaToday : viandaToday.filter(r => (r.school || '') === schoolVianda), [viandaToday, schoolVianda]);
    const ecoFiltered = useMemo(() => schoolEco === 'all' ? comedorEconomicoToday : comedorEconomicoToday.filter(r => (r.school || '') === schoolEco), [comedorEconomicoToday, schoolEco]);
    const premFiltered = useMemo(() => schoolPrem === 'all' ? comedorPremiumToday : comedorPremiumToday.filter(r => (r.school || '') === schoolPrem), [comedorPremiumToday, schoolPrem]);

    // Paginados
    const viandaLastPage = Math.max(1, Math.ceil(viandaFiltered.length / PER_PAGE));
    const ecoLastPage = Math.max(1, Math.ceil(ecoFiltered.length / PER_PAGE));
    const premLastPage = Math.max(1, Math.ceil(premFiltered.length / PER_PAGE));

    const viandaPaged = useMemo(() => viandaFiltered.slice((pageVianda - 1) * PER_PAGE, pageVianda * PER_PAGE), [viandaFiltered, pageVianda]);
    const ecoPaged = useMemo(() => ecoFiltered.slice((pageEco - 1) * PER_PAGE, pageEco * PER_PAGE), [ecoFiltered, pageEco]);
    const premPaged = useMemo(() => premFiltered.slice((pagePrem - 1) * PER_PAGE, pagePrem * PER_PAGE), [premFiltered, pagePrem]);

    const downloadPdf = (serviceKey) => {
        const url = route('admin.reports.daily-service', serviceKey) + '?date=' + (dateLabel.split('/').reverse().join('-')); // dd/mm/YYYY -> YYYY-mm-dd
        window.open(url, '_blank');
    };
    const goToPendingPage = (p) => {
        const base = route('dashboard');
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get('date');
        const next = new URLSearchParams();
        if (dateParam) next.set('date', dateParam);
        next.set('p_page', String(p));
        const schoolParam = (pendingStudentsFilters.school && pendingStudentsFilters.school !== 'all') ? pendingStudentsFilters.school : null;
        if (schoolParam) next.set('p_school', schoolParam);
        window.location.href = base + (next.toString() ? ('?' + next.toString()) : '');
    };

    const downloadPendingPdf = () => {
        window.open(route('admin.reports.pending-students'), '_blank');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Panel Administrador" />
            {/* Contenedor: fondo más sutil y menos padding vertical */}
            <div className="bg-gradient-to-b from-orange-50 to-white py-10">
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

                    {/* Tarjetas informativas: añadir transición y hover */}
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="group rounded-xl border border-orange-100 bg-white p-6 shadow-sm transform transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-50">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600 transition-transform duration-200 group-hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M3 7h18M3 12h18M3 17h12" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 transition-colors duration-150 group-hover:text-orange-600">Órdenes mensuales</h4>
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
                        <div className="group rounded-xl border border-orange-100 bg-white p-6 shadow-sm transform transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-50">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600 transition-transform duration-200 group-hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 transition-colors duration-150 group-hover:text-orange-600">Menu</h4>
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
                        <div className="group rounded-xl border border-orange-100 bg-white p-6 shadow-sm transform transition duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-orange-50">
                            <div className="mb-2 inline-flex rounded-full bg-orange-100 p-2 text-orange-600 transition-transform duration-200 group-hover:scale-105">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7h16M4 12h16M4 17h10" />
                                </svg>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 transition-colors duration-150 group-hover:text-orange-600">Precios</h4>
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
                    <div className="mt-12">
                        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                            <div className="p-6 sm:p-8">
                                {/* Controles de fecha globales */}
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Servicios del día</h3>
                                        <span className="inline-flex items-center rounded-full bg-orange-400 border border-orange-400 px-3 py-1 text-sm sm:text-base font-semibold text-white shadow-sm">{dateLabel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={goToday}
                                            aria-pressed={isTodaySelected}
                                            className={`rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 transition border ${isTodaySelected ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50'}`}
                                        >Hoy</button>
                                        <button
                                            onClick={goTomorrow}
                                            aria-pressed={isTomorrowSelected}
                                            className={`rounded-md px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-200 transition border ${isTomorrowSelected ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-50'}`}
                                        >Mañana</button>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-semibold text-gray-900">Vianda</h3>
                                                <span
                                                    title={`Total: ${viandaFiltered.length}`}
                                                    aria-label={`Total ${viandaFiltered.length}`}
                                                    className="ml-2 inline-flex items-center rounded-full bg-orange-200 border border-orange-300 px-2 py-0.5 text-xs font-semibold text-orange-800 shadow-sm"
                                                >
                                                    <span className="hidden sm:inline">Total: {viandaFiltered.length}</span>
                                                    <span className="inline sm:hidden">{viandaFiltered.length}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <div className="w-full sm:w-auto">
                                                    {/* Select: full-width en mobile, más legible */}
                                                    <select value={schoolVianda} onChange={e=>setSchoolVianda(e.target.value)} className="w-full sm:w-auto rounded-md border border-orange-300 bg-orange-100 text-orange-800 text-sm px-3 py-1.5 pr-10 sm:min-w-[10rem] truncate focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition">
                                                        <option value="all">Todas las escuelas</option>
                                                        {schoolsVianda.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                {/* Botón +PDF: indica acción de subir/añadir */}
                                                <button onClick={()=>downloadPdf('vianda')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition">+PDF</button>
                                            </div>
                                        </div>
                                        {/* Tabla: hacer scroll horizontal si es necesario y encabezado sticky */}
                                        <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                                            <table className="min-w-full table-auto text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-600 uppercase tracking-wider text-xs">
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Alumno</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">DNI</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Escuela</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Grado</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Observacion</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {viandaPaged.map(row => (
                                                        <tr key={row.child_id} className="text-gray-800 hover:bg-orange-50">
                                                            <td className="px-4 py-2">{row.full_name}</td>
                                                            <td className="px-4 py-2">{row.dni || '-'}</td>
                                                            <td className="px-4 py-2">{row.school || '-'}</td>
                                                            <td className="px-4 py-2">{row.grado || '-'}</td>
                                                            <td className="px-4 py-2">{row.condition || '-'}</td>
                                                        </tr>
                                                    ))}
                                                    {viandaPaged.length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {viandaLastPage > 1 && (
                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                                                <div>
                                                    Página {pageVianda} de {viandaLastPage}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.from({ length: viandaLastPage }).map((_, i) => {
                                                        const p = i + 1;
                                                        const active = p === pageVianda;
                                                        return (
                                                            <button key={p} onClick={() => setPageVianda(p)} className={`px-3 py-1 rounded-md border text-xs font-medium ${active ? 'bg-orange-500 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50'}`}>{p}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-semibold text-gray-900">Comedor Económico</h3>
                                                <span
                                                    title={`Total: ${ecoFiltered.length}`}
                                                    aria-label={`Total ${ecoFiltered.length}`}
                                                    className="ml-2 inline-flex items-center rounded-full bg-orange-200 border border-orange-300 px-2 py-0.5 text-xs font-semibold text-orange-800 shadow-sm"
                                                >
                                                    <span className="hidden sm:inline">Total: {ecoFiltered.length}</span>
                                                    <span className="inline sm:hidden">{ecoFiltered.length}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                <div className="w-full sm:w-auto">
                                                    <select value={schoolEco} onChange={e=>setSchoolEco(e.target.value)} className="w-full sm:w-auto rounded-md border border-orange-300 bg-orange-100 text-orange-800 text-sm px-3 py-1.5 pr-10 sm:min-w-[10rem] truncate focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition">
                                                        <option value="all">Todas las escuelas</option>
                                                        {schoolsEco.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <button onClick={()=>downloadPdf('economico')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition">+PDF</button>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                                            <table className="min-w-full table-auto text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-600 uppercase tracking-wider text-xs">
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Alumno</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">DNI</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Escuela</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Grado</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Observacion</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {ecoPaged.map(row => (
                                                        <tr key={row.child_id} className="text-gray-800 hover:bg-orange-50">
                                                            <td className="px-4 py-2">{row.full_name}</td>
                                                            <td className="px-4 py-2">{row.dni || '-'}</td>
                                                            <td className="px-4 py-2">{row.school || '-'}</td>
                                                            <td className="px-4 py-2">{row.grado || '-'}</td>
                                                            <td className="px-4 py-2">{row.condition || '-'}</td>
                                                        </tr>
                                                    ))}
                                                    {ecoPaged.length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {ecoLastPage > 1 && (
                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                                                <div>
                                                    Página {pageEco} de {ecoLastPage}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.from({ length: ecoLastPage }).map((_, i) => {
                                                        const p = i + 1;
                                                        const active = p === pageEco;
                                                        return (
                                                            <button key={p} onClick={() => setPageEco(p)} className={`px-3 py-1 rounded-md border text-xs font-medium ${active ? 'bg-orange-500 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50'}`}>{p}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-semibold text-gray-900">Comedor Premium</h3>
                                                <span
                                                    title={`Total: ${premFiltered.length}`}
                                                    aria-label={`Total ${premFiltered.length}`}
                                                    className="ml-2 inline-flex items-center rounded-full bg-orange-200 border border-orange-300 px-2 py-0.5 text-xs font-semibold text-orange-800 shadow-sm"
                                                >
                                                    <span className="hidden sm:inline">Total: {premFiltered.length}</span>
                                                    <span className="inline sm:hidden">{premFiltered.length}</span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
            
                                                <div className="w-full sm:w-auto">
                                                    <select value={schoolPrem} onChange={e=>setSchoolPrem(e.target.value)} className="w-full sm:w-auto rounded-md border border-orange-300 bg-orange-100 text-orange-800 text-sm px-3 py-1.5 pr-10 sm:min-w-[10rem] truncate focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition">
                                                        <option value="all">Todas las escuelas</option>
                                                        {schoolsPrem.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <button onClick={()=>downloadPdf('premium')} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition">+PDF</button>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                                            <table className="min-w-full table-auto text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-600 uppercase tracking-wider text-xs">
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Alumno</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">DNI</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Escuela</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Grado</th>
                                                        <th className="px-4 py-2 font-medium sticky top-0 bg-white/95 backdrop-blur-sm z-10">Observacion</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {premPaged.map(row => (
                                                        <tr key={row.child_id} className="text-gray-800 hover:bg-orange-50">
                                                            <td className="px-4 py-2">{row.full_name}</td>
                                                            <td className="px-4 py-2">{row.dni || '-'}</td>
                                                            <td className="px-4 py-2">{row.school || '-'}</td>
                                                            <td className="px-4 py-2">{row.grado || '-'}</td>
                                                            <td className="px-4 py-2">{row.condition || '-'}</td>
                                                        </tr>
                                                    ))}
                                                    {premPaged.length === 0 && (
                                                        <tr>
                                                            <td colSpan={5} className="px-4 py-4 text-gray-500 text-sm">Sin alumnos para este servicio.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        {premLastPage > 1 && (
                                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                                                <div>
                                                    Página {pagePrem} de {premLastPage}
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {Array.from({ length: premLastPage }).map((_, i) => {
                                                        const p = i + 1;
                                                        const active = p === pagePrem;
                                                        return (
                                                            <button key={p} onClick={() => setPagePrem(p)} className={`px-3 py-1 rounded-md border text-xs font-medium ${active ? 'bg-orange-500 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50'}`}>{p}</button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla alumnos pendientes / sin días (movida al final) */}
                    <div className="mt-16">
                        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                            <div className="p-6 sm:p-8">
                                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-base font-semibold text-gray-900">Alumnos pendientes / sin días</h3>
                                        <span className="inline-flex items-center rounded-full bg-orange-200 border border-orange-300 px-2 py-0.5 text-xs font-semibold text-orange-800 shadow-sm">Total: {pendingStudentsPagination.total}</span>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <select
                                            value={pendingStudentsFilters.school || 'all'}
                                            onChange={(e)=>{
                                                const val = e.target.value;
                                                const base = route('dashboard');
                                                const params = new URLSearchParams(window.location.search);
                                                const dateParam = params.get('date');
                                                const next = new URLSearchParams();
                                                if (dateParam) next.set('date', dateParam);
                                                next.set('p_page','1');
                                                if (val !== 'all') next.set('p_school', val);
                                                window.location.href = base + (next.toString() ? ('?'+next.toString()) : '');
                                            }}
                                            className="w-full sm:w-auto rounded-md border border-orange-300 bg-orange-100 text-orange-800 text-sm px-3 py-1.5 pr-10 sm:min-w-[10rem] truncate focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition">
                                            <option value="all">Todas las escuelas</option>
                                            {pendingStudentsSchools.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <button onClick={downloadPendingPdf} className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition">+PDF</button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
                                    <table className="min-w-full table-auto text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-600 uppercase tracking-wider text-xs">
                                                <th className="px-4 py-2">Alumno</th>
                                                <th className="px-4 py-2">DNI</th>
                                                <th className="px-4 py-2">Escuela</th>
                                                <th className="px-4 py-2">Grado</th>
                                                <th className="px-4 py-2">Observación</th>
                                                <th className="px-4 py-2">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pendingStudents.map(r => (
                                                <tr key={r.id} className="text-gray-800 hover:bg-orange-50">
                                                    <td className="px-4 py-2">{r.name} {r.lastname}</td>
                                                    <td className="px-4 py-2">{r.dni || '-'}</td>
                                                    <td className="px-4 py-2">{r.school || '-'}</td>
                                                    <td className="px-4 py-2">{r.grado || '-'}</td>
                                                    <td className="px-4 py-2">{r.condition || '-'}</td>
                                                    <td className="px-4 py-2">
                                                        {r.status === 'pending' && <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-800">Pendiente</span>}
                                                        {r.status === 'none' && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700">Sin días</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingStudents.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-4 py-4 text text-gray-500 text-sm">Sin alumnos pendientes o sin días.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {pendingStudentsPagination.last_page > 1 && (
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                                        <div>
                                            Página {pendingStudentsPagination.page} de {pendingStudentsPagination.last_page}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {Array.from({ length: pendingStudentsPagination.last_page }).map((_, i) => {
                                                const p = i + 1;
                                                const active = p === pendingStudentsPagination.page;
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => goToPendingPage(p)}
                                                        className={`px-3 py-1 rounded-md border text-xs font-medium ${active ? 'bg-orange-500 border-orange-600 text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50'}`}
                                                    >{p}</button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
