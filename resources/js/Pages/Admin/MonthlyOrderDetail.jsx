import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function MonthlyOrderDetail({ child, month, year, summary = [], baseTotalCents = 0, monthlyTotalCents = 0, surcharge = { applied: false, percent: 0, cents: 0 }, status = 'pending' }) {
  const [confirmModal, setConfirmModal] = useState({ open: false, loading: false });
  const [rejectModal, setRejectModal] = useState({ open: false, loading: false });
  const [confirmError, setConfirmError] = useState('');
  const [rejectError, setRejectError] = useState('');

  const handleConfirm = () => {
    setConfirmError('');
    setConfirmModal(m => ({ ...m, loading: true }));
    router.post(route('admin.daily-orders.confirm'), { child_id: child.id, month, year }, {
      preserveScroll: true,
      onSuccess: () => {
        setConfirmModal({ open: false, loading: false });
        // Volver al listado con el mismo período
        router.get(route('admin.monthly-orders.index'), { month, year }, { replace: true });
      },
      onError: () => {
        setConfirmError('Ocurrió un error al confirmar el pago. Intentalo nuevamente.');
      },
      onFinish: () => setConfirmModal(m => ({ ...m, loading: false })),
    });
  };

  const handleReject = () => {
    setRejectError('');
    setRejectModal(m => ({ ...m, loading: true }));
    router.post(route('admin.monthly-orders.reject'), { child_id: child.id, month, year }, {
      preserveScroll: true,
      onSuccess: () => {
        setRejectModal({ open: false, loading: false });
        // Volver al listado con el mismo período
        router.get(route('admin.monthly-orders.index'), { month, year }, { replace: true });
      },
      onError: () => {
        setRejectError('Ocurrió un error al rechazar el pago. Intentalo nuevamente.');
      },
      onFinish: () => setRejectModal(m => ({ ...m, loading: false })),
    });
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Detalle de orden mensual</h2>}>
      <Head title="Detalle de orden mensual" />
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Datos del alumno - ordenados en grid */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-800">Datos del alumno</h3>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-gray-500">Nombre</div>
              <div className="font-medium text-gray-900">{child.name} {child.lastname}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">DNI</div>
              <div className="font-medium text-gray-900">{child.dni || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Escuela</div>
              <div className="font-medium text-gray-900">{child.school || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Grado</div>
              <div className="font-medium text-gray-900">{child.grado || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Período</div>
              <div className="font-medium text-gray-900">{String(month).padStart(2,'0')}/{year}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Estado</div>
              <div className="mt-0.5">
                {status === 'paid' && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Pagado</span>
                )}
                {status === 'pending' && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-800">Pendiente</span>
                )}
                {status === 'rejected' && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800">Rechazado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resumen por servicio (conteo de días) */}
        <ServiceCounts summary={summary} />

        <div className="rounded-xl border border-gray-200 bg-white p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2 font-medium">Fecha</th>
                <th className="px-3 py-2 font-medium">Servicio</th>
                <th className="px-3 py-2 font-medium">Precio</th>
                <th className="px-3 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {summary.map((d, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2">{d.date}</td>
                  <td className="px-3 py-2">{d.service}</td>
                  <td className="px-3 py-2">{money(d.price_cents)}</td>
                  <td className="px-3 py-2">
                    {d.status === 'paid' && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Pagado</span>
                    )}
                    {d.status === 'pending' && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[11px] font-medium text-yellow-800">Pendiente</span>
                    )}
                    {d.status === 'rejected' && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800">Rechazado</span>
                    )}
                  </td>
                </tr>
              ))}
              {summary.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-3 text-gray-600">Sin días en el período.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Total base:</span> {money(baseTotalCents)}</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Recargo:</span>
                {surcharge.applied ? (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-800" title={`Recargo aplicado (${surcharge.percent}%)`}>{surcharge.percent}%</span>
                ) : (
                  <span className="text-xs text-gray-500">No</span>
                )}
              </div>
              <div><span className="font-medium">Total final:</span> {money(monthlyTotalCents)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => window.history.back()} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50">Volver</button>
              <button onClick={() => setRejectModal({ open: true, loading: false })} className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500">Rechazar</button>
              <button onClick={() => setConfirmModal({ open: true, loading: false })} className="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-500">Confirmar pago</button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal: Confirmar pago */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (!confirmModal.loading) setConfirmModal({ open: false, loading: false }); }}></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">Confirmar pago del período</h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
              <p>Se confirmará el pago de <span className="font-medium">todos los días</span> del período {String(month).padStart(2,'0')}/{year} para:</p>
              <ul className="list-disc pl-5 text-gray-800">
                <li><span className="font-medium">Alumno:</span> {child.name} {child.lastname}</li>
                <li><span className="font-medium">Total a confirmar:</span> {money(monthlyTotalCents || baseTotalCents)}</li>
              </ul>
              <div className="rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-700 border border-orange-200">Esta acción marcará TODOS los días del período como pagados.</div>
              {confirmError && <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">{confirmError}</div>}
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button disabled={confirmModal.loading} onClick={() => setConfirmModal({ open: false, loading: false })} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
              <button
                disabled={confirmModal.loading}
                onClick={handleConfirm}
                className="rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50"
              >{confirmModal.loading ? 'Guardando...' : 'Confirmar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rechazar pago */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (!rejectModal.loading) setRejectModal({ open: false, loading: false }); }}></div>
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-gray-800">Rechazar pago</h3>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
              <p>Esto marcará los días del período {String(month).padStart(2,'0')}/{year} como <span className="font-medium">pendientes</span> para:</p>
              <ul className="list-disc pl-5 text-gray-800">
                <li><span className="font-medium">Alumno:</span> {child.name} {child.lastname}</li>
              </ul>
              <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">Podés volver a confirmar el pago más adelante desde esta misma vista.</div>
              {rejectError && <div className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 border border-red-200">{rejectError}</div>}
            </div>
            <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
              <button disabled={rejectModal.loading} onClick={() => setRejectModal({ open: false, loading: false })} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
              <button
                disabled={rejectModal.loading}
                onClick={handleReject}
                className="rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >{rejectModal.loading ? 'Rechazando...' : 'Rechazar'}</button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

function ServiceCounts({ summary = [] }) {
  const counts = useMemo(() => {
    const acc = new Map();
    for (const d of summary) {
      const key = d?.service || 'Servicio';
      acc.set(key, (acc.get(key) || 0) + 1);
    }
    return Array.from(acc.entries()).map(([service, count]) => ({ service, count }));
  }, [summary]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-base font-semibold text-gray-800">Resumen por servicio</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {counts.length > 0 ? counts.map(({ service, count }) => (
          <span key={service} className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800 ring-1 ring-orange-200">
            {service}: {count} {count === 1 ? 'día' : 'días'}
          </span>
        )) : (
          <span className="text-sm text-gray-500">Sin días en el período.</span>
        )}
      </div>
    </div>
  );
}
