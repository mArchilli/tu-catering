import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format((cents || 0) / 100);

export default function MonthlyOrderPaidDetail({ child, month, year, summary = [], baseTotalCents = 0, monthlyTotalCents = 0, surcharge = { applied: false, percent: 0, cents: 0 } }) {
  // Controles de período
  const [m, setM] = useState(month);
  const [y, setY] = useState(year);
  useEffect(() => { setM(month); }, [month]);
  useEffect(() => { setY(year); }, [year]);
  const applyPeriod = () => {
    if (!child?.id) return;
    router.get(route('admin.monthly-orders.paid.show', { child: child.id, month: m, year: y }), {}, { preserveScroll: true, replace: true });
  };
  // Filtrar para mostrar únicamente los días en estado "paid"
  const paidSummary = useMemo(() => (summary || []).filter(d => d?.status === 'paid'), [summary]);

  // Totales calculados solo sobre pagadas (historial mostrado)
  const paidBaseTotalCents = useMemo(() => paidSummary.reduce((acc, d) => acc + (d?.price_cents || 0), 0), [paidSummary]);
  const computedSurchargeCents = useMemo(() => {
    if (!surcharge?.applied) return 0;
    const percent = Number(surcharge?.percent) || 0;
    return Math.round(paidBaseTotalCents * percent / 100);
  }, [paidBaseTotalCents, surcharge?.applied, surcharge?.percent]);
  const paidMonthlyTotalCents = useMemo(() => paidBaseTotalCents + computedSurchargeCents, [paidBaseTotalCents, computedSurchargeCents]);

  // Helpers y exportación
  const pad2 = (n) => String(n).padStart(2,'0');
  const fileBase = `${(child?.lastname || '').toLowerCase().replace(/\s+/g,'-')}-${(child?.name || '').toLowerCase().replace(/\s+/g,'-')}-${pad2(m)}-${y}`;

  const downloadPdf = () => {
    if (!child?.id) return;
    const url = route('admin.reports.monthly-paid', { child: child.id, month: m, year: y });
    window.open(url, '_blank');
  };

  const exportExcel = () => {
    try {
      const alumno = {
        Nombre: `${child?.name || ''} ${child?.lastname || ''}`.trim(),
        DNI: child?.dni || '',
        Escuela: child?.school || '',
        Grado: child?.grado || '',
        Mes: pad2(m),
        Año: y,
      };
      const detalle = paidSummary.map(d => ({
        Fecha: d.date,
        Servicio: d.service,
        Precio: money(d.price_cents),
        Estado: 'Pagado',
      }));
      const wb = XLSX.utils.book_new();
      const wsAlumno = XLSX.utils.json_to_sheet([alumno]);
      XLSX.utils.book_append_sheet(wb, wsAlumno, 'Alumno');
      const wsDetalle = XLSX.utils.json_to_sheet(detalle);
      XLSX.utils.book_append_sheet(wb, wsDetalle, 'Pagos');
      const wsTotales = XLSX.utils.json_to_sheet([
        { Concepto: 'Subtotal', Monto: money(paidBaseTotalCents) },
        { Concepto: 'Recargo', Monto: surcharge?.applied ? `${surcharge?.percent || 0}% (${money(computedSurchargeCents)})` : '-' },
        { Concepto: 'Total', Monto: money(paidMonthlyTotalCents) },
      ]);
      XLSX.utils.book_append_sheet(wb, wsTotales, 'Totales');
      XLSX.writeFile(wb, `historial-pagos-${fileBase}.xlsx`);
    } catch (e) {
      console.error('Error exportando Excel', e);
      alert('No se pudo generar el Excel.');
    }
  };

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Historial de pagos</h2>}>
      <Head title="Historial de pagos" />
      
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => window.history.back()} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50">Volver</button>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-xs text-gray-600 sm:mr-2">Período</label>
            <select
              className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-full sm:w-20"
              value={m}
              onChange={(e) => setM(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i+1} value={i+1}>{String(i+1).padStart(2,'0')}</option>
              ))}
            </select>
            <select
              className="rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400 w-full sm:w-24"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
            >
              {Array.from({ length: 3 }).map((_, idx) => {
                const yr = new Date().getFullYear() - 1 + idx;
                return <option key={yr} value={yr}>{yr}</option>;
              })}
            </select>
            <button
              onClick={applyPeriod}
              className="rounded-md bg-orange-400 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-500"
            >Ver</button>
            <div className="flex gap-2 sm:ml-3">
              <button onClick={downloadPdf} className="rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600">+PDF</button>
              <button onClick={exportExcel} className="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700">Excel</button>
            </div>
          </div>
        </div>

        {/* Datos del alumno */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-800">Datos del alumno</h3>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-gray-500">Nombre</div>
              <div className="font-medium text-gray-900">{child?.name} {child?.lastname}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">DNI</div>
              <div className="font-medium text-gray-900">{child?.dni || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Escuela</div>
              <div className="font-medium text-gray-900">{child?.school || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Grado</div>
              <div className="font-medium text-gray-900">{child?.grado || '-'}</div>
            </div>
          </div>
        </div>

        {/* Resumen por servicio (pagadas) */}
        <ServiceCounts summary={paidSummary} />

        {/* Tabla de días pagados */}
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
              {paidSummary.map((d, idx) => (
                <tr key={idx}>
                  <td className="px-3 py-2">{d.date}</td>
                  <td className="px-3 py-2">{d.service}</td>
                  <td className="px-3 py-2">{money(d.price_cents)}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-800">Pagado</span>
                  </td>
                </tr>
              ))}
              {paidSummary.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-3 text-gray-600">Sin pagos registrados en el período.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        
          
            
        
            
          
        
      </div>
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
          <span key={service} className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-green-200">
            {service}: {count} {count === 1 ? 'día' : 'días'}
          </span>
        )) : (
          <span className="text-sm text-gray-500">Sin pagos en el período.</span>
        )}
      </div>
    </div>
  );
}
