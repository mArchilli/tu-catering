import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function MonthlyOrders({ ordersPending = { data: [] }, ordersPaid = { data: [] }, filters = { status: 'all', q: '' } }) {
  const [q, setQ] = useState(filters?.q ?? '');
  const [status, setStatus] = useState(filters?.status ?? 'all');

  const handleConfirm = (id) => {
    router.post(route('admin.monthly-orders.confirm', id));
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta orden pagada? Esta acción no se puede deshacer.')) return;
    router.delete(route('admin.monthly-orders.destroy', id), { preserveState: true });
  };
  const handleReject = (id) => {
    if (!confirm('¿Rechazar esta orden?')) return;
    router.post(route('admin.monthly-orders.reject', id), {}, { preserveState: true });
  };

  const applyFilters = (overrides = {}) => {
    const params = { q, status, ...overrides };
    router.get(route('admin.monthly-orders.index'), params, { preserveState: true, replace: true });
  };

  const clearFilters = () => {
    setQ('');
    setStatus('all');
    router.get(route('admin.monthly-orders.index'), {}, { preserveState: true, replace: true });
  };

  const Paginator = ({ meta, links, pageParam }) => {
    if (!meta || meta.last_page <= 1) return null;
    // Usamos los links del paginador de Laravel que vienen con label/url
    const go = (url) => {
      if (!url) return;
      // Mantener filtros
      router.visit(url, { preserveState: true, replace: true });
    };
    return (
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando {meta.from}–{meta.to} de {meta.total}
        </div>
        <div className="flex items-center gap-1">
          {links?.map((l, idx) => (
            <button
              key={idx}
              disabled={!l.url}
              onClick={() => go(l.url)}
              className={`rounded-md px-2 py-1 ${l.active ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'} ${!l.url ? 'opacity-50 cursor-default' : ''}`}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          ))}
        </div>
      </div>
    );
  };

  const Table = ({ page, title, emptyText, showConfirm, showDelete, showReject }) => {
    const total = page?.meta?.total ?? (Array.isArray(page?.data) ? page.data.length : 0);
    return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <span className="text-xs text-gray-500">{total} resultados</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="px-3 py-2 font-medium">Alumno</th>
              <th className="px-3 py-2 font-medium">Periodo</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {page.data.map((o) => (
              <tr key={o.id} className="text-gray-800">
                <td className="px-3 py-2">{o.child?.name} {o.child?.lastname}</td>
                <td className="px-3 py-2">{String(o.month).padStart(2, '0')}/{o.year}</td>
                <td className="px-3 py-2 font-semibold">{money(o.total_cents)}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${o.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {o.status === 'paid' ? 'Pagado' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  {showConfirm && o.status !== 'paid' && (
                    <button
                      onClick={() => handleConfirm(o.id)}
                      className="rounded-md bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
                    >
                      Confirmar pago
                    </button>
                  )}
                  {showReject && o.status !== 'paid' && (
                    <button
                      onClick={() => handleReject(o.id)}
                      className="ml-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Rechazar
                    </button>
                  )}
                  {showDelete && o.status === 'paid' && (
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="ml-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {page.data.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-gray-600">{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Paginator meta={page.meta} links={page.links} />
    </div>
    );
  };

  const headerTitle = useMemo(() => {
    if (status === 'pending') return 'Órdenes mensuales (pendientes)';
    if (status === 'paid') return 'Órdenes mensuales (pagadas)';
    return 'Órdenes mensuales';
  }, [status]);

  useEffect(() => {
    // Mantener sincronizado si vienen cambios del servidor
    setQ(filters?.q ?? '');
    setStatus(filters?.status ?? 'all');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters?.q, filters?.status]);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">{headerTitle}</h2>}>
      <Head title="Órdenes mensuales" />
      <div className="mx-auto max-w-6xl p-6">
        {/* Filtros */}
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              className="w-full rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
              placeholder="Buscar por nombre o apellido"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setStatus('all'); applyFilters({ status: 'all' }); } }}
            />
          </div>
          <div>
            <select
              className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400"
              value={status}
              onChange={(e) => {
                const next = e.target.value;
                setStatus(next);
                applyFilters({ status: next });
              }}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagadas</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setStatus('all'); applyFilters({ status: 'all' }); }}
              className="rounded-md bg-orange-400 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500"
            >
              Buscar
            </button>
            <button
              onClick={clearFilters}
              className="rounded-md bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              Limpiar
            </button>
          </div>
        </div>

        {status === 'all' && (
          <>
            <Table
              page={ordersPending}
              title="Pendientes"
              emptyText="No hay órdenes pendientes."
              showConfirm
              showReject
            />
            <Table
              page={ordersPaid}
              title="Pagadas"
              emptyText="No hay órdenes pagadas."
              showConfirm={false}
              showDelete
            />
          </>
        )}

        {status === 'pending' && (
          <Table
            page={ordersPending}
            title="Pendientes"
            emptyText="No hay órdenes pendientes."
            showConfirm
            showReject
          />
        )}

        {status === 'paid' && (
          <Table
            page={ordersPaid}
            title="Pagadas"
            emptyText="No hay órdenes pagadas."
            showConfirm={false}
            showDelete
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
