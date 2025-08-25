import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

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
      const matchesQ = q.trim() === '' || o.child.toLowerCase().includes(q.trim().toLowerCase());
      return matchesQ;
    });
  }, [orders, q]);

  const pending = filtered.filter(o => o.status === 'pending');
  const paid = filtered.filter(o => o.status === 'paid');
  const [modal, setModal] = useState({ open: false, row: null, loading: false });

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
              placeholder="Buscar alumno"
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
                  <th className="px-3 py-2 font-medium">Periodo</th>
                  <th className="px-3 py-2 font-medium">Días</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                  <th className="px-3 py-2 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map(o => (
                  <tr key={o.child_id} className="text-gray-800">
                    <td className="px-3 py-2">{o.child}</td>
                    <td className="px-3 py-2">{String(month).padStart(2,'0')}/{year}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{o.days_count} días</span>
                        <span className="text-[10px] text-gray-500 max-w-xs truncate" title={o.days.join(', ')}>{o.days.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-semibold">{money(o.total_cents)}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => openModal(o)}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
                      >Confirmar pago</button>
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
          <h3 className="mb-2 text-base font-semibold text-gray-800">Pagadas ({paid.length})</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Alumno</th>
                  <th className="px-3 py-2 font-medium">Periodo</th>
                  <th className="px-3 py-2 font-medium">Días</th>
                  <th className="px-3 py-2 font-medium">Total</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paid.map(o => (
                  <tr key={o.child_id} className="text-gray-800">
                    <td className="px-3 py-2">{o.child}</td>
                    <td className="px-3 py-2">{String(month).padStart(2,'0')}/{year}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{o.days_count} días</span>
                        <span className="text-[10px] text-gray-500 max-w-xs truncate" title={o.days.join(', ')}>{o.days.join(', ')}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 font-semibold">{money(o.total_cents)}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Pagado</span>
                    </td>
                  </tr>
                ))}
                {paid.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-gray-600">No hay órdenes pagadas.</td>
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
    </AuthenticatedLayout>
  );
}
