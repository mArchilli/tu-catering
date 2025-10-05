import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import OrderCalendar from '@/Components/OrderCalendar';

export default function OrderCalendarPage({ child, serviceTypes, existing, year, month, businessDayIndex = null }) {
  const initialSelections = Object.fromEntries((existing || []).map(e => [e.date, e.service_type_id]));

  const handleSubmit = (selections) => {
    const items = Object.entries(selections).map(([date, service_type_id]) => ({ date, service_type_id }));
    router.post(route('children.orders.summary', child.id), { items }, { preserveScroll: true });
  };

  const handleClearAll = ({ year: y, month: m }) => {
    // Invocar endpoint para eliminar órdenes pendientes del mes
    router.post(route('children.orders.clear', child.id), { year: y, month: m }, {
      preserveScroll: true,
      onSuccess: () => {},
    });
  };

  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Calendario de servicios - {child.name} {child.lastname}</h2>}
    >
      <Head title="Calendario" />
      
      <div className="mx-auto max-w-7xl p-6 space-y-4">
        {typeof businessDayIndex === 'number' && (
          <div className="mt-1 text-xs text-gray-600">Hoy es el día hábil N° {businessDayIndex} del mes.</div>
        )}
        <div>
          <SecondaryButton className="hidden sm:block sm:w-auto justify-center text-center" onClick={() => router.visit(route('children.view', child.id))}>
            Volver
          </SecondaryButton>
      </div>
        <OrderCalendar
          serviceTypes={serviceTypes}
          initialSelections={initialSelections}
          year={year}
          month={month}
          onSubmit={handleSubmit}
          onClearAll={handleClearAll}
          childId={child.id}
        />
        <div>
          <SecondaryButton className="w-full md:hidden sm:w-auto justify-center text-center" onClick={() => router.visit(route('children.view', child.id))}>
            Volver
          </SecondaryButton>
        </div>
      </div>
    </ParentLayout>
  );
}
