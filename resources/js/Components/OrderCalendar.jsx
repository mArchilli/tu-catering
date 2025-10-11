import { useMemo, useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Spinner from '@/Components/Spinner';
import Toast from '@/Components/Toast';

// Utilidad para formatear ARS desde centavos
const money = (cents) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(cents / 100);

export default function OrderCalendar({ serviceTypes = [], initialSelections = {}, paidDates = [], year, month, onSubmit, onClearAll, childId }) {
  // selectedService: id del tipo actual a asignar
  const [selectedService, setSelectedService] = useState(null);
  // Precalcular claves para inicialización perezosa desde localStorage
  const ymConst = `${String(year)}-${String(month).padStart(2,'0')}`;
  const initialStorageKey = `orderSelections:${childId ?? 'unknown'}:${ymConst}`;
  const paidSetInit = new Set((paidDates || []).map(String));
  // selections: mapa 'yyyy-MM-dd' => service_type_id (inicializado con merge de servidor + localStorage filtrado)
  const [selections, setSelections] = useState(() => {
    const base = { ...initialSelections };
    try {
      const raw = localStorage.getItem(initialStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const ymPrefix = `${ymConst}-`;
          for (const [date, sid] of Object.entries(parsed)) {
            if (typeof date !== 'string') continue;
            if (!date.startsWith(ymPrefix)) continue; // solo mes actual
            if (paidSetInit.has(String(date))) continue; // excluir pagados
            base[date] = sid;
          }
        }
      }
    } catch (e) {
      // no-op
    }
    return base;
  });
  // Modal: confirmar vaciar todo
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [submittingConfirm, setSubmittingConfirm] = useState(false);
  const [submittingClear, setSubmittingClear] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const priceById = useMemo(() => Object.fromEntries(serviceTypes.map(s => [s.id, s.price_cents])), [serviceTypes]);
  const serviceById = useMemo(() => Object.fromEntries(serviceTypes.map(s => [s.id, s])), [serviceTypes]);

  // Clave de almacenamiento local por niño y período
  const storageKey = useMemo(() => {
    const ym = `${String(year)}-${String(month).padStart(2,'0')}`;
    return `orderSelections:${childId ?? 'unknown'}:${ym}`;
  }, [childId, year, month]);


  // Guardar automáticamente cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(selections));
    } catch (e) {
      // no-op
    }
  }, [storageKey, selections]);

  const totalCents = useMemo(() => Object.values(selections).reduce((acc, sid) => acc + (priceById[sid] || 0), 0), [selections, priceById]);
  const totalDays = useMemo(() => Object.keys(selections).length, [selections]);

  const paidSet = useMemo(() => new Set((paidDates || []).map(String)), [paidDates]);


  const handleDayClick = (day) => {
    const key = format(day, 'yyyy-MM-dd');
    // Bloquear selección si el día está pagado
    if (paidSet.has(key)) return;
    setSelections(prev => {
      const current = prev[key];
      if (!selectedService) {
        const { [key]: _, ...rest } = prev; // quitar si no hay servicio seleccionado
        return rest;
      }
      // toggle: si mismo servicio -> quitar, si distinto -> asignar
      if (current === selectedService) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: selectedService };
    });
  };

  // Colores por servicio (por nombre). Ajustá palabras clave/colores si cambian los nombres.
  const colorForService = (service) => {
    const name = (service?.name || '').toLowerCase();
    // Comedor premium: púrpura
    if (name.includes('premium')) return { base: 'purple', dayBg: 'bg-purple-100', dayHover: 'hover:bg-purple-200', pillBg: 'bg-purple-100', pillText: 'text-purple-700', border: 'border-purple-200' };
    // Vianda: verde
    if (name.includes('vianda')) return { base: 'green', dayBg: 'bg-green-100', dayHover: 'hover:bg-green-200', pillBg: 'bg-green-100', pillText: 'text-green-700', border: 'border-green-200' };
    // Comedor económico: azul (coincidimos por 'econ' para cubrir "económico/economico")
    if (name.includes('econ')) return { base: 'blue', dayBg: 'bg-blue-100', dayHover: 'hover:bg-blue-200', pillBg: 'bg-blue-100', pillText: 'text-blue-700', border: 'border-blue-200' };
    // "Comedor" genérico (si existiera): azul
    if (name.includes('comedor')) return { base: 'blue', dayBg: 'bg-blue-100', dayHover: 'hover:bg-blue-200', pillBg: 'bg-blue-100', pillText: 'text-blue-700', border: 'border-blue-200' };
    // Fallback: naranja
    return { base: 'orange', dayBg: 'bg-orange-100', dayHover: 'hover:bg-orange-200', pillBg: 'bg-orange-100', pillText: 'text-orange-700', border: 'border-orange-200' };
  };

  // Modificadores dinámicos para colorear días según el servicio asignado
  const dayModifiers = useMemo(() => {
    const mods = {};
    for (const s of serviceTypes) {
      const key = `svc_${s.id}`;
      mods[key] = (date) => {
        const k = format(date, 'yyyy-MM-dd');
        return selections[k] === s.id;
      };
    }
    return mods;
  }, [serviceTypes, selections]);

  const dayModifiersClassNames = useMemo(() => {
    const map = {};
    for (const s of serviceTypes) {
      const key = `svc_${s.id}`;
      const col = colorForService(s);
      map[key] = `${col.dayBg} ${col.dayHover} ${col.border}`;
    }
    return map;
  }, [serviceTypes]);

  const askClearAll = () => {
    if (Object.keys(selections).length === 0) return;
    setConfirmingClear(true);
  };

  const doClearAll = async () => {
    if (submittingClear) return;
    setSubmittingClear(true);
    // Limpiar estado local
    setSelections({});
    setConfirmingClear(false);
    try {
      try { localStorage.removeItem(storageKey); } catch (e) {}
      if (typeof onClearAll === 'function') {
        await Promise.resolve(onClearAll({ year, month }));
      }
      setToast({ show: true, message: 'Se vació el pedido del mes.', type: 'success' });
    } catch (e) {
      setToast({ show: true, message: 'No pudimos vaciar el pedido. Intentá nuevamente.', type: 'error' });
    } finally {
      setSubmittingClear(false);
    }
  };

  const closeClearModal = () => setConfirmingClear(false);

  const footer = (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center w-full md:w-auto">
        <button onClick={askClearAll} type="button" className=" rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 text-center">Vaciar todo</button>
      </div>
    </div>
  );

  const monthDate = new Date(year, month - 1, 1);

  const handleConfirmClick = async () => {
    if (submittingConfirm) return;
    setSubmittingConfirm(true);
    try {
      if (typeof onSubmit === 'function') {
        await Promise.resolve(onSubmit(selections));
      }
    } catch (e) {
      setToast({ show: true, message: 'No se pudo guardar la selección.', type: 'error' });
    } finally {
      setSubmittingConfirm(false);
    }
  };

  // Custom DayContent para pintar el servicio elegido
  const DayContent = (props) => {
    const key = format(props.date, 'yyyy-MM-dd');
    const sid = selections[key];
    const service = sid ? serviceById[sid] : null;
    const colors = service ? colorForService(service) : null;
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <span>{props.date.getDate()}</span>
        {service && (
          <span className={[
            'pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 text-[10px] font-medium',
            colors?.pillBg,
            colors?.pillText,
          ].filter(Boolean).join(' ')}>
            {service.name.split(' ')[0]}
          </span>
        )}
      </div>
    );
  };

  // Cabecera personalizada: solo 5 columnas (Lun–Vie)
  const WeekdaysHeadRow = () => {
    const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    return (
      <tr className="rdp-head_row">
        {labels.map((label, idx) => (
          <th key={idx} scope="col" className="rdp-head_cell">
            <span className="rdp-head_cell_content">{label}</span>
          </th>
        ))}
      </tr>
    );
  };

  // Ocultar navegación (flechas prev/next)
  const EmptyIcon = () => null;
  const EmptyNav = () => null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px]">
      <section className="rounded-xl border border-orange-100 bg-white p-4">
        <DayPicker
          mode="single"
          month={monthDate}
          onDayClick={handleDayClick}
          captionLayout="buttons"
          fromMonth={new Date(year, month - 1, 1)}
          toMonth={new Date(year, month - 1, 1)}
          modifiers={dayModifiers}
          modifiersClassNames={dayModifiersClassNames}
          showOutsideDays={false}
          disabled={[
            // Solo fines de semana
            { dayOfWeek: [0, 6] },
            // Días ya pagados (predicado por fecha, evita issues de tz)
            (date) => paidSet.has(format(date, 'yyyy-MM-dd')),
          ]}
          components={{ DayContent, HeadRow: WeekdaysHeadRow, IconLeft: EmptyIcon, IconRight: EmptyIcon, Nav: EmptyNav }}
          locale={es}
          className="w-full only-weekdays"
          classNames={{
            months: 'w-full',
            month: 'w-full',
            table: 'w-full table-fixed',
            month_grid: 'w-full',
            caption: 'w-full flex justify-center',
            month_caption: 'flex justify-center',
            caption_label: 'text-center capitalize font-semibold',
            day_button: 'w-full h-full flex items-center justify-center p-0',
          }}
          styles={{
            root: { width: '100%' },
            months: { width: '100%', maxWidth: 'none' },
            month: { width: '100%' },
            table: { width: '100%', tableLayout: 'fixed' },
            month_grid: { width: '100%' },
            month_caption: { display: 'flex', justifyContent: 'center' },
          }}
        />

        {/* Referencia de colores por servicio */}
        <div className="mt-4">
          <div className="mb-2 text-xs font-medium text-gray-600">Referencia de colores</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {serviceTypes.map((s) => {
              const col = colorForService(s);
              return (
                <div key={s.id} className="flex items-center gap-2 text-xs text-gray-700">
                  <span aria-hidden="true" className={[
                    'inline-block h-3 w-3 rounded-full border',
                    col?.border,
                    col?.pillBg,
                  ].filter(Boolean).join(' ')} />
                  <span className="font-medium">{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {footer}
      </section>

      <aside className="rounded-xl border border-orange-100 bg-white p-4 flex flex-col justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Elegí el servicio</h4>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {serviceTypes.map((s) => {
            const active = selectedService === s.id;
            const col = colorForService(s);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedService(s.id)}
                className={[
                  'w-full rounded-lg border px-3 py-2 text-left text-sm transition',
                  active
                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                    : 'border-orange-200 bg-white hover:bg-orange-50',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className={['inline-block h-3 w-3 rounded-full border', col?.border, col?.pillBg].filter(Boolean).join(' ')} />
                    <div className="font-medium text-gray-900">{s.name}</div>
                  </div>
                  <div className="text-orange-700 font-semibold">{money(s.price_cents)}</div>
                </div>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedService(null)}
            className={[
              'w-full rounded-lg border px-3 py-2 text-left text-sm transition',
              selectedService === null
                ? 'border-gray-400 bg-gray-50 ring-1 ring-gray-400'
                : 'border-gray-200 bg-white hover:bg-gray-50',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800">Sin selección</div>
              <div className="text-gray-600">Click: quitar del día</div>
            </div>
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
          <div className="text-gray-600">Total del mes</div>
          <div className="text-lg font-bold text-gray-900">{money(totalCents)}</div>
          <div className="text-xs text-gray-600">{totalDays} día(s) seleccionado(s)</div>
        </div>

          <div className="mt-4">
            <button
              onClick={handleConfirmClick}
              disabled={submittingConfirm}
              className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white text-center ${submittingConfirm ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500'}`}
            >
              <span className="inline-flex items-center gap-2 justify-center">
                {submittingConfirm && <Spinner />}
                <span>Confirmar</span>
              </span>
            </button>
          </div>
      </aside>

      {/* Modal confirmar vaciado */}
      <Modal show={confirmingClear} onClose={closeClearModal} maxWidth="sm">
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900">¿Vaciar todo el pedido del mes?</h3>
          <p className="mt-2 text-sm text-gray-600">Se quitarán todas las selecciones de días y servicios asignados para este mes.</p>
          <div className="mt-6 flex justify-end gap-2">
            <SecondaryButton onClick={closeClearModal}>Cancelar</SecondaryButton>
            <DangerButton onClick={doClearAll} disabled={submittingClear}>
              <span className="inline-flex items-center gap-2 justify-center">
                {submittingClear && <Spinner />}
                <span>Vaciar todo</span>
              </span>
            </DangerButton>
          </div>
        </div>
      </Modal>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
