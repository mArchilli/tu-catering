import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

// Icono de tacho de basura (SVG inline)
const TrashIcon = ({ className = "h-4 w-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.75A2.25 2.25 0 0011.25 6h1.5A2.25 2.25 0 0015 3.75h3.75a.75.75 0 010 1.5H18v.375A2.625 2.625 0 0115.375 8.25H8.625A2.625 2.625 0 016 5.625V5.25H5.25a.75.75 0 010-1.5H9zm-1.2 6.75h8.4l-.66 8.23A2.25 2.25 0 0113.3 21H10.7a2.25 2.25 0 01-2.24-2.27L7.8 10.5z" clipRule="evenodd" />
    <path d="M10 12.25a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5zm3 0a.75.75 0 011.5 0v5.5a.75.75 0 01-1.5 0v-5.5z" />
  </svg>
);

// Nueva versión que recibe "orders" (array simple) más filtros {status,q,month,year}
export default function MonthlyOrders({ orders = [], filters = { status: 'all', q: '', month: null, year: null } }) {
  const [q, setQ] = useState(filters?.q ?? '');
  const [status, setStatus] = useState(filters?.status ?? 'all');
  const [month, setMonth] = useState(filters?.month ?? new Date().getMonth() + 1);
  const [year, setYear] = useState(filters?.year ?? new Date().getFullYear());

  // NOTA: Las acciones (confirmar / rechazar / eliminar) requerían IDs de monthly_orders.
  // Con el nuevo agregado desde daily_orders no siempre existe una monthly_order creada.
  // Se ocultan botones hasta que se defina un flujo para generar/obtener esos IDs.

  const applyFilters = (over = {}) => {
    const params = { q, status, month, year, ...over };
    router.get(route('admin.monthly-orders.index'), params, { preserveState: true, replace: true });
  };

  const clearFilters = () => {
    const d = new Date();
    setQ('');
    setStatus('all');
    setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
    router.get(route('admin.monthly-orders.index'), {}, { preserveState: true, replace: true });
  };

  // Filtrado en cliente (ya se filtra en servidor, pero reforzamos por si cambia props sin recarga)
  const filtered = useMemo(() => {
    return orders.filter(o => {
      const term = q.trim().toLowerCase();
      if (term === '') return true;
      return o.child.toLowerCase().includes(term) || (o.dni || '').toLowerCase().includes(term);
    });
  }, [orders, q]);

  const pending = filtered.filter(o => o.status === 'pending');
  const paid = filtered.filter(o => o.status === 'paid');
  // Ordenar pagadas por fecha más reciente (máximo día del array) desc
  const paidSorted = useMemo(() => {
    const toTime = (o) => {
      if (!o?.days || o.days.length === 0) return 0;
      // fechas YYYY-MM-DD
      const max = o.days.reduce((acc, d) => (d > acc ? d : acc), o.days[0]);
      return new Date(max).getTime();
    };
    return [...paid].sort((a, b) => toTime(b) - toTime(a));
  }, [paid]);
  const rejected = filtered.filter(o => o.status === 'rejected');
  const rejectedSorted = useMemo(() => {
    const toTime = (o) => {
      if (!o?.days || o.days.length === 0) return 0;
      const max = o.days.reduce((acc, d) => (d > acc ? d : acc), o.days[0]);
      return new Date(max).getTime();
    };
    return [...rejected].sort((a, b) => toTime(b) - toTime(a));
  }, [rejected]);

  // Helper para formatear la lista de días con servicio (si viene del backend)
  const formatDaysWithService = (o) => {
    if (!o?.days_with_service || o.days_with_service.length === 0) {
      // fallback a los días sin etiqueta si no viene detallado
      return (
        <>
          <span className="font-medium">{o.days_count} días</span>
          <span className="text-[10px] text-gray-500 max-w-xs truncate" title={o.days?.join(', ') || ''}>{o.days?.join(', ')}</span>
        </>
      );
    }
    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{o.days_with_service.length} días</span>
        <span className="text-[10px] text-gray-500 max-w-xs truncate"
          title={o.days_with_service.map(d => `${d.date} (${d.service})`).join(', ')}>
          {o.days_with_service.map(d => `${d.date} (${d.service})`).join(', ')}
        </span>
      </div>
    );
  };

  const SurchargeBadge = ({ s }) => {
    if (!s || !s.applied) return null;
    const label = s.percent ? `${s.percent}%` : 'Recargo';
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-800" title={`Recargo aplicado: ${label}`}>
        {label}
      </span>
    );
  };
  const [modal, setModal] = useState({ open: false, row: null, loading: false });
  // Modal para eliminar 1 elemento
  const [deleteModal, setDeleteModal] = useState({ open: false, row: null, loading: false });
  // Modal para vaciar tabla completa (pagadas o rechazadas visibles)
  const [bulkDeleteModal, setBulkDeleteModal] = useState({ open: false, scope: null, count: 0, loading: false });

  const openModal = (row) => setModal({ open: true, row, loading: false });
  const closeModal = () => setModal({ open: false, row: null, loading: false });
  const confirmPayment = () => {
    if (!modal.row) return;
    setModal(m => ({ ...m, loading: true }));
    router.post(route('admin.daily-orders.confirm'), {
      child_id: modal.row.child_id,
      month,
      year
    }, {
      preserveScroll: true,
      onFinish: () => closeModal(),
    });
  };

  // Abrir modal de eliminación individual
  const openDelete = (row) => setDeleteModal({ open: true, row, loading: false });
  const closeDelete = () => setDeleteModal({ open: false, row: null, loading: false });
  const confirmDelete = () => {
    if (!deleteModal.row) return;
    setDeleteModal(m => ({ ...m, loading: true }));
    router.post(route('admin.monthly-orders.delete'), { child_id: deleteModal.row.child_id, month, year }, {
      preserveScroll: true,
      onFinish: () => closeDelete(),
    });
  };

  // Abrir modal para vaciar sección (scope: 'paid' | 'rejected')
  const openBulkDelete = (scope) => {
    const list = scope === 'paid' ? paid : rejected;
    setBulkDeleteModal({ open: true, scope, count: list.length, loading: false });
  };
  const closeBulkDelete = () => setBulkDeleteModal({ open: false, scope: null, count: 0, loading: false });
  const confirmBulkDelete = async () => {
    const scope = bulkDeleteModal.scope;
    if (!scope) return;
    const list = scope === 'paid' ? paid : rejected;
    if (!list.length) return closeBulkDelete();
    setBulkDeleteModal(m => ({ ...m, loading: true }));

    // Helper para promisificar router.post
    const postDelete = (childId) => new Promise((resolve) => {
      router.post(route('admin.monthly-orders.delete'), { child_id: childId, month, year }, {
        preserveScroll: true,
        onFinish: () => resolve(),
      });
    });

    for (const item of list) {
      // Evitar bloquear completamente la UI: ejecutar secuencialmente
      // eslint-disable-next-line no-await-in-loop
      await postDelete(item.child_id);
    }
    closeBulkDelete();
    // Refrescar vista con los filtros actuales
    router.get(route('admin.monthly-orders.index'), { q, status, month, year }, { preserveState: true, replace: true });
  };

  const headerTitle = useMemo(() => {
    if (status === 'pending') return 'Órdenes (pendientes)';
    if (status === 'paid') return 'Órdenes (pagadas)';
    return 'Órdenes mensuales';
  }, [status]);

  useEffect(() => {
    setQ(filters?.q ?? '');
    setStatus(filters?.status ?? 'all');
    if (filters?.month) setMonth(filters.month);
    if (filters?.year) setYear(filters.year);
  }, [filters?.q, filters?.status, filters?.month, filters?.year]);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{headerTitle}</h2>}>
      <Head title="Órdenes mensuales" />
      <div className="mx-auto max-w-7xl p-6">
        {/* Filtros (layout flex, sin grid) */}
    <div className="mb-2 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:mb-1 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="sm:flex-[2] w-full">
            <input
              type="text"
              className="w-full rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
              placeholder="Buscar por nombre o DNI"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }}
            />
          </div>
      <div className="flex flex-col gap-2 w-full sm:flex-[1.5] sm:flex-row sm:items-center">
            <select
        className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-full sm:w-auto"
              value={status}
              onChange={(e) => { const next = e.target.value; setStatus(next); applyFilters({ status: next }); }}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagadas</option>
            </select>
            <select
        className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-full sm:w-20"
              value={month}
              onChange={(e) => { const m = Number(e.target.value); setMonth(m); applyFilters({ month: m }); }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i+1} value={i+1}>{String(i+1).padStart(2,'0')}</option>
              ))}
            </select>
            <select
        className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-full sm:w-24"
              value={year}
              onChange={(e) => { const y = Number(e.target.value); setYear(y); applyFilters({ year: y }); }}
            >
              {Array.from({ length: 3 }).map((_, idx) => {
                const y = new Date().getFullYear() - 1 + idx; // año anterior, actual y siguiente
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </div>
      <div className="flex flex-col gap-2 w-full sm:flex-1 sm:flex-row sm:items-stretch sm:ml-auto">
            <button
        onClick={() => applyFilters()}
        className="w-full rounded-md bg-orange-400 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500 sm:flex-1"
            >Buscar</button>
            <button
        onClick={clearFilters}
        className="w-full rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 sm:flex-1"
            >Limpiar</button>
          </div>
        </div>
        {/* Contador fuera de la barra */}
        <div className="mb-4 text-right text-xs text-gray-500">Total registros: {filtered.length}</div>

        {/* Tabla Pendientes */}
        <div className="mb-10">
          <h3 className="mb-2 text-base font-semibold text-gray-800">Pendientes ({pending.length})</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Alumno</th>
                  <th className="px-3 py-2 font-medium">DNI</th>
                  <th className="px-3 py-2 font-medium">Institución</th>
                  <th className="px-3 py-2 font-medium">Grado</th>
                  <th className="px-3 py-2 font-medium">Periodo</th>
                  
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map(o => (
                  <tr key={o.child_id} className="text-gray-800">
                    <td className="px-3 py-2">{o.child}</td>
                    <td className="px-3 py-2">{o.dni || '-'}</td>
                    <td className="px-3 py-2">{o.school || '-'}</td>
                    <td className="px-3 py-2">{o.grado || '-'}</td>
                    <td className="px-3 py-2">{String(month).padStart(2,'0')}/{year}</td>
                    
                   
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.get(route('admin.monthly-orders.show', { child: o.child_id, month, year }))}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                        >Ver detalle</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-gray-600">No hay órdenes pendientes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Pagadas */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Pagadas ({paid.length})</h3>
            {paid.length > 0 && (
              <button
                onClick={() => openBulkDelete('paid')}
                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                title="Vaciar tabla (pagadas)"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Alumno</th>
                  <th className="px-3 py-2 font-medium">DNI</th>
                  <th className="px-3 py-2 font-medium">Institución</th>
                  <th className="px-3 py-2 font-medium">Grado</th>
                  <th className="px-3 py-2 font-medium">Periodo</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paidSorted.map(o => (
                  <tr key={o.child_id} className="text-gray-800">
                    <td className="px-3 py-2">{o.child}</td>
                    <td className="px-3 py-2">{o.dni || '-'}</td>
                    <td className="px-3 py-2">{o.school || '-'}</td>
                    <td className="px-3 py-2">{o.grado || '-'}</td>
                    <td className="px-3 py-2">{String(month).padStart(2,'0')}/{year}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Pagado</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.get(route('admin.monthly-orders.paid.show', { child: o.child_id, month, year }))}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                        >Ver historial</button>
                        <button
                          onClick={() => openDelete(o)}
                          className="inline-flex items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-500"
                          title="Eliminar"
                          aria-label="Eliminar"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paid.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-gray-600">No hay órdenes pagadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Rechazadas */}
        <div className="mt-10">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">Rechazadas ({rejected.length})</h3>
            {rejected.length > 0 && (
              <button
                onClick={() => openBulkDelete('rejected')}
                className="inline-flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                title="Vaciar tabla (rechazadas)"
              >
                <TrashIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Alumno</th>
                  <th className="px-3 py-2 font-medium">DNI</th>
                  <th className="px-3 py-2 font-medium">Institución</th>
                  <th className="px-3 py-2 font-medium">Grado</th>
                  <th className="px-3 py-2 font-medium">Periodo</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rejectedSorted.map(o => (
                  <tr key={o.child_id} className="text-gray-800">
                    <td className="px-3 py-2">{o.child}</td>
                    <td className="px-3 py-2">{o.dni || '-'}</td>
                    <td className="px-3 py-2">{o.school || '-'}</td>
                    <td className="px-3 py-2">{o.grado || '-'}</td>
                    <td className="px-3 py-2">{String(month).padStart(2,'0')}/{year}</td>
                    
                    
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">Rechazado</span>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openDelete(o)}
                        className="inline-flex items-center justify-center rounded-md bg-red-600 p-2 text-white hover:bg-red-500"
                        title="Eliminar"
                        aria-label="Eliminar"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {rejected.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-4 text-gray-600">No hay órdenes rechazadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-md scale-100 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">Confirmar pago</h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
              <p><span className="font-medium">Alumno:</span> {modal.row?.child}</p>
              <p><span className="font-medium">Período:</span> {String(month).padStart(2,'0')}/{year}</p>
              <p><span className="font-medium">Días:</span> {modal.row?.days_count} ({modal.row?.days.join(', ')})</p>
              <p><span className="font-medium">Total:</span> {money(modal.row?.total_cents)}</p>
              <div className="rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-700 border border-orange-200">Esta acción marcará TODOS los días de este período como pagados. No se puede deshacer desde aquí.</div>
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button onClick={closeModal} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100">Cancelar</button>
              <button
                disabled={modal.loading}
                onClick={confirmPayment}
                className="rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50"
              >{modal.loading ? 'Guardando...' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal: confirmar eliminación individual */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDelete}></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">Eliminar registros del período</h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
              <p>Se eliminarán todos los registros de este período para:</p>
              <ul className="list-disc pl-5 text-gray-800">
                <li><span className="font-medium">Alumno:</span> {deleteModal.row?.child}</li>
                <li><span className="font-medium">Período:</span> {String(month).padStart(2,'0')}/{year}</li>
              </ul>
              <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">Esta acción eliminará definitivamente los días cargados del período para este alumno.</div>
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button onClick={closeDelete} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100">Cancelar</button>
              <button
                disabled={deleteModal.loading}
                onClick={confirmDelete}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                <TrashIcon />
                {deleteModal.loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: confirmar vaciar tabla */}
      {bulkDeleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeBulkDelete}></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">Vaciar tabla ({bulkDeleteModal.scope === 'paid' ? 'pagadas' : 'rechazadas'})</h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
              <p>Se eliminarán {bulkDeleteModal.count} registros visibles del período {String(month).padStart(2,'0')}/{year}.</p>
              <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">Esta acción eliminará definitivamente los días cargados de los alumnos listados.</div>
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button onClick={closeBulkDelete} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100">Cancelar</button>
              <button
                disabled={bulkDeleteModal.loading}
                onClick={confirmBulkDelete}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                <TrashIcon />
                {bulkDeleteModal.loading ? 'Vaciando...' : 'Vaciar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
