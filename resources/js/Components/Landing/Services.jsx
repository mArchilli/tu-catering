import { useState } from 'react';

const services = [
    {
        key: 'viandas',
        title: 'Servicio de viandas',
        intro: 'Viandas nutritivas y prácticas para el día a día, con opciones equilibradas y listas para servir.',
        extras: [
            'Entrega diaria o semanal según plan',
            'Aptas celíacos y vegetarianos',
            'Packaging eco y cadena de frío',
        ],
        points: [
            'Menús semanales con variedad de proteínas, cereales y vegetales.',
            'Opciones para necesidades especiales (celiaquía, intolerancias, preferencias).',
            'Cadena de frío y empaque seguro para garantizar inocuidad.',
        ],
        emoji: '🍱',
    gradient: 'from-orange-600 to-amber-500',
    },
    {
        key: 'sae',
        title: 'Servicio Alimentario Escolar (SAE)',
        intro: 'Planificación y ejecución de servicios alimentarios bajo normativas vigentes y con enfoque pedagógico.',
        extras: [
            'Planillas y trazabilidad',
            'Capacitación a personal',
            'Auditorías higiénicas',
        ],
        points: [
            'Diseño de menús conforme a guías y requerimientos nutricionales.',
            'Trazabilidad, higiene y controles periódicos.',
            'Acompañamiento a equipos directivos y familias con comunicación clara.',
        ],
        emoji: '🏫',
    gradient: 'from-orange-500 to-amber-400',
    },
    {
        key: 'colonias',
        title: 'Colonias de verano',
        intro: 'Propuestas frescas, hidratantes y energéticas para jornadas activas en colonias.',
        extras: [
            'Colaciones hidratantes',
            'Frutas de estación',
            'Logística en predios',
        ],
        points: [
            'Colaciones y almuerzos ligeros, adaptados al clima y a la actividad física.',
            'Hidratación asegurada y frutas de estación.',
            'Logística flexible en predios y espacios recreativos.',
        ],
        emoji: '🏖️',
    gradient: 'from-amber-500 to-orange-400',
    },
    {
        key: 'kiosco',
        title: 'Kiosco-Buffet',
        intro: 'Gestión integral de kioscos y buffets con propuesta saludable y atractiva.',
        extras: [
            'Stock saludable permanente',
            'Cartelería educativa',
            'Promos y combos',
        ],
        points: [
            'Ofertas con criterio nutricional: snacks saludables, bebidas y opciones integrales.',
            'Políticas de precios claras y abastecimiento sostenido.',
            'Promociones temáticas y educación alimentaria in situ.',
        ],
        emoji: '🥪',
    gradient: 'from-amber-600 to-orange-500',
    },
];

export default function Services() {
    const [selected, setSelected] = useState(services[0].key);
    const active = services.find((s) => s.key === selected) || services[0];
    return (
    <section id="services" className="relative isolate overflow-hidden bg-orange-100">
            {/* blobs decorativos */}
            <div className="pointer-events-none absolute -top-16 -left-10 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl z-0"></div>
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl z-0"></div>

            {/* overlays de degradado a blanco para suavizar el quiebre superior e inferior */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>

            <div className="relative z-20 mx-auto max-w-7xl px-6 py-20 ">
                <div className="max-w-7xl">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-center lg:text-left">Nuestros servicios</h2>
                </div>

                {/* Layout 2 columnas: izquierda panel, derecha selector disruptivo */}
                <div className="mt-6 grid gap-8 lg:grid-cols-12">
                    {/* Izquierda: panel destacado */}
                    <div className="order-2 lg:order-1 lg:col-span-8 lg:h-full">
                        <div className="h-full flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white/70 shadow-lg backdrop-blur">
                            {/* barra de acento */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${active.gradient}`}></div>
                            <div className="p-6 sm:p-8">
                                <div className="flex items-start gap-4">
                                    <div className={`inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br ${active.gradient} text-white shadow-md`}>
                                        <span className="text-lg">{active.emoji}</span>
                                    </div>
                                    <div className="grow">
                                        <h3 className="text-xl font-semibold text-gray-900">{active.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-gray-700">{active.intro}</p>
                                    </div>
                                </div>
                                <ul className="mt-6 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                                    {active.points.map((p) => (
                                        <li key={p} className="flex items-start gap-2">
                                            <span className={`mt-2 inline-block h-2 w-2 rounded-full bg-gradient-to-r ${active.gradient}`}></span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                                {active.extras?.length ? (
                                    <div className="mt-6 border-t border-orange-100 pt-6">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Incluye</p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {active.extras.map((e) => (
                                                <span key={e} className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-3 py-1 text-xs text-gray-700 shadow-sm">
                                                    <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${active.gradient}`}></span>
                                                    {e}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Derecha: selector tipo chips en lista sticky */}
                    <div className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-24 self-start">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-1">
                            {services.map((s) => {
                                const selected = s.key === active.key;
                                return (
                                    <button
                                        key={s.key}
                                        type="button"
                                        onClick={() => setSelected(s.key)}
                                        className={`group relative w-full rounded-2xl p-[2px] text-left transition-transform ${selected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                                        aria-pressed={selected}
                                    >
                                        <span className={`block rounded-2xl bg-gradient-to-r ${s.gradient} p-[1px] shadow-sm`}>
                                            <span className={`block rounded-2xl ${selected ? 'bg-white' : 'bg-white/80'} px-4 py-3` }>
                                                <span className="flex items-center gap-3">
                                                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow`}>
                                                        <span className="text-base">{s.emoji}</span>
                                                    </span>
                                                    <span className={`text-xs font-semibold ${selected ? 'text-gray-900' : 'text-gray-700'}`}>{s.title}</span>
                                                </span>
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
