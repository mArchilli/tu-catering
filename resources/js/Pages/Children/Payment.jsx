import ParentLayout from '@/Layouts/ParentLayout';
import { Head, router } from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

// Mapeo de datos según la escuela
const paymentDataBySchool = (school) => {
  switch (school) {
    case 'Colegio Buenos Aires':
      return {
        sections: [
          {
            title: 'Transferencia',
            entidad: 'Mercado Pago',
            titular: 'Aguilera Oscar Daniel',
            alias: 'tucateringod',
          },
        ],
      };
    case 'Santisimo Redentor':
      return {
        sections: [
          {
            title: 'Transferencia',
            entidad: 'Banco Galicia',
            titular: 'Aguilera Oscar Daniel',
            cbu: '0070042930004079878954',
            alias: 'TUCATERING.2024',
          },
          {
            title: 'Billetera Virtual',
            entidad: 'UALA',
            titular: 'Aguilera Oscar Daniel',
            cvu: '0000007900201132190502',
            alias: 'aguileraod.uala',
          },
        ],
      };
    case 'Juan XXIII':
      return {
        sections: [
          {
            title: 'Transferencia',
            entidad: 'Banco Santander',
            titular: 'Aguilera Oscar Daniel',
            cbu: '0720057188000037150336',
            alias: 'MARCA.PIANO.MARCHA',
          },
          {
            title: 'Billetera Virtual',
            entidad: 'Naranja X',
            titular: 'Aguilera Oscar Daniel',
            cvu: '4530000800013868658887',
            alias: 'OAGUILERA4764.NX.ARS',
          },
        ],
      };
    default:
      return null; // Se usará el objeto "payment" genérico provisto desde el backend
  }
};

export default function Payment({ child, childId, totalCents = 0, payment, month, year, totalsByService = [], daysCount = 0, surcharge = null, totalWithSurchargeCents = null, businessDayIndex = null }) {
  const specific = paymentDataBySchool(child?.school);
  const { bank, cbu, alias, holder, cuil } = payment || {};
  const handleBack = () => {
    if (window && window.history) window.history.back();
  };

  const subject = 'Comprobante de pago';
  const defaultBody = `Hola, adjunto comprobante de pago.\n\nPadre registrado: ______.\nEstudiante: ${child?.name || ''} ${child?.lastname || ''}.`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=info@tucatering.com.ar&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(defaultBody)}`;

  const handleConfirmSent = () => {
    try {
      localStorage.setItem('paymentConfirmed', '1');
    } catch (e) {
      // no-op
    }
    router.post(route('children.payment.confirm', childId), { month, year });
  };

  return (
    <ParentLayout
  header={<h2 className="text-xl font-semibold text-gray-800">Pago de pedido - {child?.name} {child?.lastname}</h2>}
    >
      <Head title="Pago" />

      <div className="mx-auto max-w-7xl p-6 space-y-8">
        <SecondaryButton className="hidden sm:block sm:w-auto justify-center text-center" onClick={handleBack}>Volver</SecondaryButton>
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Resumen</h3>
          <div className="mt-2 text-sm text-gray-700">Periodo: {String(month).padStart(2,'0')}/{year}</div>
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
                    <td className="px-3 py-2">{money((t.subtotal_cents || 0) / (t.days || 1))}</td>
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

          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            <div className="text-sm text-gray-600">Días totales: <span className="font-semibold text-gray-800">{daysCount}</span></div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-base font-semibold text-gray-900">{money(totalCents)}</div>
            </div>
            {surcharge?.percent > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-700">
                  {surcharge?.label || `Recargo por pago fuera de término (${surcharge?.percent}%)`}
                </div>
                <div className="font-medium text-gray-900">{money(surcharge?.cents || 0)}</div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Total a pagar</div>
              <div className="text-lg font-bold text-gray-900">{money(totalWithSurchargeCents ?? totalCents)}</div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Datos del alumno</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-800 sm:grid-cols-2">
              <div><span className="font-semibold text-gray-700">Nombre: </span>{child?.name}</div>
              <div><span className="font-semibold text-gray-700">Apellido: </span>{child?.lastname}</div>
              {child?.dni && (<div><span className="font-semibold text-gray-700">DNI: </span>{child.dni}</div>)}
              {child?.school && (<div><span className="font-semibold text-gray-700">Escuela: </span>{child.school}</div>)}
              {child?.grado && (<div><span className="font-semibold text-gray-700">Grado: </span>{child.grado}</div>)}
              {child?.condition && (<div className="sm:col-span-2"><span className="font-semibold text-gray-700">Observacion: </span>{child.condition}</div>)}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-base font-semibold text-gray-900">Datos para pago</h3>
          {specific ? (
            <div className="mt-3 space-y-6">
              {specific.sections.map((sec, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-3 bg-gray-50/40">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">{sec.title}: <span className="font-normal">{sec.entidad}</span></h4>
                  <div className="grid grid-cols-1 gap-1 text-xs sm:text-sm sm:grid-cols-2">
                    <div className="sm:col-span-2"><span className="font-semibold text-gray-700">Titular: </span>{sec.titular}</div>
                    {sec.cbu && (<div className="sm:col-span-2"><span className="font-semibold text-gray-700">CBU: </span>{sec.cbu}</div>)}
                    {sec.cvu && (<div className="sm:col-span-2"><span className="font-semibold text-gray-700">CVU: </span>{sec.cvu}</div>)}
                    {sec.alias && (<div className="sm:col-span-2"><span className="font-semibold text-gray-700">Alias: </span>{sec.alias}</div>)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-800">
              <div><span className="font-semibold text-gray-700">Banco: </span>{bank || 'N/A'}</div>
              {cbu && (<div><span className="font-semibold text-gray-700">CBU: </span>{cbu}</div>)}
              {alias && (<div><span className="font-semibold text-gray-700">Alias: </span>{alias}</div>)}
              {holder && (<div><span className="font-semibold text-gray-700">Titular: </span>{holder}</div>)}
              {cuil && (<div><span className="font-semibold text-gray-700">CUIL: </span>{cuil}</div>)}
            </div>
          )}
          <p className="mt-4 text-xs text-gray-500">Una vez realizado el pago, enviá el comprobante a <a href={gmailHref} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:underline">info@tucatering.com.ar</a> indicando nombre del padre registrado y del alumno para acreditar el pago.</p>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleConfirmSent}
            className="w-full rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
          >
            Ya envié el comprobante
          </button>
        </div>
        <SecondaryButton className="w-full sm:hidden sm:w-auto justify-center text-center" onClick={handleBack}>Volver</SecondaryButton>
      </div>
    </ParentLayout>
  );
}
