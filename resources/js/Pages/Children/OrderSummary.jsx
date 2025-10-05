import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function OrderSummary({ child, summary = [], totalsByService = [], totalCents = 0, month, year, businessDayIndex = null }) {
  const handleConfirm = () => {
    // Ir a pago SIN crear órdenes aún: mandamos items a un preview
    const items = summary.map(({ date, service_type_id }) => ({ date, service_type_id }));
    router.post(route('children.payment.preview', child.id), { items }, { preserveScroll: true });
  };

  const handleBack = () => {
    router.visit(route('children.orders.create', child.id));
  };

  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Resumen del pedido - {child.name} {child.lastname}</h2>}
    >
      <Head title="Resumen del pedido" />
      <div className="mx-auto max-w-7xl p-6 space-y-8">
        <SecondaryButton className="hidden md:block w-full sm:w-auto justify-center text-center" onClick={handleBack}>Volver</SecondaryButton>
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Resumen por servicio</h3>
          {(month && year) && (
            <div className="mt-1 text-xs text-gray-600">Periodo: {String(month).padStart(2,'0')}/{year}</div>
          )}
          {typeof businessDayIndex === 'number' && (
            <div className="mt-1 text-xs text-gray-600">Hoy es el día hábil N° {businessDayIndex} del mes.</div>
          )}
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2 font-medium">Servicio</th>
                  <th className="px-3 py-2 font-medium">Días</th>
                  <th className="px-3 py-2 font-medium">Precio unitario</th>
                  <th className="px-3 py-2 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {totalsByService.map((t) => (
                  <tr key={t.service_type_id} className="text-gray-800">
                    <td className="px-3 py-2 font-medium">{t.service}</td>
                    <td className="px-3 py-2">{t.days}</td>
                    <td className="px-3 py-2">{/* precio unitario = subtotal / días */}{money((t.subtotal_cents || 0) / (t.days || 1))}</td>
                    <td className="px-3 py-2 font-semibold text-gray-900">{money(t.subtotal_cents)}</td>
                  </tr>
                ))}
                {totalsByService.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-4 text-gray-600">No hay selecciones.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-end gap-4 border-t pt-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-lg font-bold text-gray-900">{money(totalCents)}</div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Detalle por día</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {summary.map((row, idx) => (
              <div key={`${row.date}-${row.service_type_id}-${idx}`} className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <div className="text-gray-700">{row.date}</div>
                <div className="font-medium text-gray-900">{row.service}</div>
                <div className="font-semibold text-gray-900">{money(row.price_cents)}</div>
              </div>
            ))}
            {summary.length === 0 && (
              <div className="text-sm text-gray-600">No hay días seleccionados.</div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={handleConfirm} className="w-full sm:w-auto rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 text-center">Ir a pago</button>
            <SecondaryButton className="w-full sm:w-auto sm:hidden justify-center text-center" onClick={handleBack}>Volver</SecondaryButton>
          </div>
        </section>
      </div>
    </ParentLayout>
  );
}
