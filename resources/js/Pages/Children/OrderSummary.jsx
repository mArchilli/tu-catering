import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

// Colores consistentes con OrderCalendar
const colorForService = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('premium')) return { dot: 'bg-purple-500', chipBg: 'bg-purple-100', chipText: 'text-purple-700', border: 'border-purple-200' };
  if (n.includes('vianda')) return { dot: 'bg-green-500', chipBg: 'bg-green-100', chipText: 'text-green-700', border: 'border-green-200' };
  if (n.includes('econ') || n.includes('comedor')) return { dot: 'bg-blue-500', chipBg: 'bg-blue-100', chipText: 'text-blue-700', border: 'border-blue-200' };
  return { dot: 'bg-orange-500', chipBg: 'bg-orange-100', chipText: 'text-orange-700', border: 'border-orange-200' };
};

export default function OrderSummary({ child, summary = [], totalsByService = [], totalCents = 0, month, year, businessDayIndex = null }) {
  const hasItems = Array.isArray(summary) && summary.length > 0;

  const handleConfirm = () => {
    const items = summary.map(({ date, service_type_id }) => ({ date, service_type_id }));
    router.post(route('children.payment.preview', child.id), { items }, { preserveScroll: true });
  };

  const handleBack = () => {
    router.visit(route('children.orders.create', child.id));
  };

  // Ordenar por fecha ascendente
  const ordered = [...(summary || [])].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Resumen del pedido - {child.name} {child.lastname}</h2>}
    >
      <Head title="Resumen del pedido" />
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-4 flex items-start justify-between">
          <SecondaryButton className="hidden md:inline-flex w-auto justify-center text-center" onClick={handleBack}>Editar selección</SecondaryButton>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          {/* Columna izquierda: detalle por día */}
          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Detalle de días</h3>
              {(month && year) && (
                <div className="text-xs text-gray-600">Periodo: {String(month).padStart(2,'0')}/{year}</div>
              )}
            </div>
            {typeof businessDayIndex === 'number' && (
              <div className="mt-1 text-xs text-gray-600">Hoy es el día hábil N° {businessDayIndex} del mes.</div>
            )}

            <div className="mt-3 space-y-2">
              {ordered.map((row, idx) => {
                const d = parseISO(row.date);
                const fecha = format(d, 'EEEE d/LL', { locale: es });
                const col = colorForService(row.service);
                return (
                  <div key={`${row.date}-${row.service_type_id}-${idx}`} className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2 text-sm gap-3">
                    <div className="flex items-center gap-2 text-gray-800">
                      <span aria-hidden className={["inline-block h-2.5 w-2.5 rounded-full", col.dot].join(' ')} />
                      <div className="font-medium capitalize">{fecha}</div>
                    </div>
                    <div className={["inline-flex items-center gap-2 rounded px-2 py-0.5 text-xs font-medium", col.chipBg, col.chipText].join(' ')}>
                      <span>{row.service}</span>
                    </div>
                    <div className="font-semibold text-gray-900">{money(row.price_cents)}</div>
                  </div>
                );
              })}
              {!hasItems && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">No hay días seleccionados.</div>
              )}
            </div>
          </section>

          {/* Columna derecha: resumen por servicio + total sticky */}
          <aside className="lg:sticky lg:top-4 h-max rounded-xl border border-orange-200 bg-white p-4">
            <h3 className="text-base font-semibold text-gray-900">Resumen por servicio</h3>
            <div className="mt-3 space-y-2">
              {totalsByService.map((t) => {
                const col = colorForService(t.service);
                const unit = money((t.subtotal_cents || 0) / (t.days || 1));
                return (
                  <div key={t.service_type_id} className={["rounded-lg border px-3 py-2 text-sm", col.border].join(' ')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span aria-hidden className={["inline-block h-2.5 w-2.5 rounded-full", col.dot].join(' ')} />
                        <div className="font-medium text-gray-900">{t.service}</div>
                      </div>
                      <div className="text-gray-700">{t.days} día(s)</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                      <div>Precio unitario</div>
                      <div className="font-semibold text-gray-800">{unit}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-sm text-gray-600">Subtotal</div>
                      <div className="text-sm font-semibold text-gray-900">{money(t.subtotal_cents)}</div>
                    </div>
                  </div>
                );
              })}
              {totalsByService.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-sm text-gray-600">No hay selecciones.</div>
              )}
            </div>

            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div className="text-sm text-orange-700">Total del pedido</div>
              <div className="text-2xl font-bold text-orange-900">{money(totalCents)}</div>
              {month && year && (
                <div className="text-xs text-orange-800">Periodo: {String(month).padStart(2,'0')}/{year}</div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                disabled={!hasItems}
                className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white ${!hasItems ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500'}`}
              >
                Ir a pago
              </button>
              <SecondaryButton className="w-full justify-center text-center md:hidden" onClick={handleBack}>Editar selección</SecondaryButton>
            </div>
          </aside>
        </div>
      </div>
    </ParentLayout>
  );
}
