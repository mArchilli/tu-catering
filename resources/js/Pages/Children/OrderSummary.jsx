import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function OrderSummary({ child, summary = [], totalsByService = [], totalCents = 0 }) {
  const handleConfirm = () => {
    // Confirmación final: reusar payload a store
    const items = summary.map(({ date, service_type_id }) => ({ date, service_type_id }));
    router.post(route('children.orders.store', child.id), { items }, { preserveScroll: true });
  };

  const handleBack = () => {
    router.visit(route('children.orders.create', child.id));
  };

  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Resumen del pedido - {child.name} {child.lastname}</h2>}
    >
      <Head title="Resumen del pedido" />
      <div className="mx-auto max-w-4xl p-6 space-y-8">
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Por servicio</h3>
          <div className="mt-3 divide-y divide-gray-100">
            {totalsByService.map((t) => (
              <div key={t.service_type_id} className="flex items-center justify-between py-2 text-sm">
                <div className="font-medium text-gray-800">{t.service}</div>
                <div className="text-gray-600">{t.days} día(s)</div>
                <div className="font-semibold text-gray-900">{money(t.subtotal_cents)}</div>
              </div>
            ))}
            {totalsByService.length === 0 && (
              <div className="py-4 text-sm text-gray-600">No hay selecciones.</div>
            )}
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
            
            <button onClick={handleConfirm} className="w-full sm:w-auto rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 text-center">Confirmar pedido</button>
              <SecondaryButton className="w-full sm:w-auto justify-center text-center" onClick={handleBack}>Volver</SecondaryButton>
          </div>
        </section>
      </div>
    </ParentLayout>
  );
}
