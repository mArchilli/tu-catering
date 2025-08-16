import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';
import OrderCalendar from '@/Components/OrderCalendar';

export default function OrderCalendarPage({ child, serviceTypes, existing, year, month }) {
  const initialSelections = Object.fromEntries((existing || []).map(e => [e.date, e.service_type_id]));

  const handleSubmit = (selections) => {
    const items = Object.entries(selections).map(([date, service_type_id]) => ({ date, service_type_id }));
    router.post(route('children.orders.summary', child.id), { items }, { preserveScroll: true });
  };

  return (
    <ParentLayout
      header={<h2 className="text-xl font-semibold text-gray-800">Calendario de servicios - {child.name} {child.lastname}</h2>}
    >
      <Head title="Calendario" />
      
      <div className="mx-auto max-w-7xl p-6 space-y-4">
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
