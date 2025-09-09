import ParentLayout from '@/Layouts/ParentLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const SCHOOLS = [
    {
        id: 'cba',
        name: 'Colegio Buenos Aires',
        files: [
            { key: 'inicial', file: 'cba_inicial', title: 'Inicial' },
            { key: 'primario', file: 'cba_primario', title: 'Primaria' },
            { key: 'secundario', file: 'cba_secundario', title: 'Secundaria' },
        ],
    },
    {
        id: 'juan_xiii',
        name: 'Juan XIII',
        files: [
            { key: 'inicial', file: 'juan_xxiii_inicial', title: 'Inicial' },
            { key: 'primario', file: 'juan_xxiii_primario', title: 'Primaria' },
            // No hay PDF de Secundaria para Juan XIII
        ],
    },
    {
        id: 'sr',
        name: 'Santisimo Redentor',
        files: [
            { key: 'inicial', file: 'sr_inicial', title: 'Inicial' },
            { key: 'primario', file: 'sr_primario', title: 'Primaria' },
            // No hay PDF de Secundaria para Santísimo Redentor
        ],
    },
];

export default function PreciosPadre() {
    const escuelas = useMemo(() => SCHOOLS, []);
    const DOCS_BASE = (import.meta.env.VITE_PUBLIC_DOCS_PATH || 'docs').replace(/\/+$/,'');
    const BASE = `/${DOCS_BASE}`;
    const [seleccion, setSeleccion] = useState(escuelas[0].id);
    const [docs, setDocs] = useState([]); // [{ key, title, url }]

    // NUEVO: clases del grid dinámicas según cantidad de PDFs
    const gridCols = useMemo(() => {
        if (docs.length === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (docs.length >= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        return 'grid-cols-1';
    }, [docs.length]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            const school = escuelas.find((e) => e.id === seleccion);
            if (!school) {
                setDocs([]);
                return;
            }

            const candidates = school.files.map((f) => {
                const url = `${BASE}/precios/${f.file}.pdf`;
                return { ...f, url };
            });

            const exists = async (url) => {
                try {
                    const res = await fetch(url, { method: 'HEAD' });
                    return res.ok;
                } catch {
                    return false;
                }
            };

            const results = await Promise.all(
                candidates.map(async (c) => ({ ...c, ok: await exists(c.url) }))
            );

            if (!active) return;
            setDocs(results.filter((r) => r.ok).map(({ key, title, url }) => ({ key, title, url })));
        };

        load();
        return () => {
            active = false;
        };
    }, [escuelas, seleccion]);

    return (
        <ParentLayout>
            <Head title="Precios" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-400 shadow-sm">
                        <div className="p-6 text-white sm:p-8">
                            <h3 className="text-lg font-semibold">Precios</h3>
                            <p className="mt-1 text-sm text-orange-50">
                                Seleccioná la escuela para ver los listados de precios.
                            </p>
                        </div>
                    </div>

                    {/* Selector de escuela */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        {escuelas.map((e) => {
                            const active = e.id === seleccion;
                            return (
                                <button
                                    key={e.id}
                                    type="button"
                                    onClick={() => setSeleccion(e.id)}
                                    className={[
                                        'px-4 py-2 rounded-lg text-sm font-semibold border transition',
                                        active
                                            ? 'bg-orange-400 text-white border-orange-400'
                                            : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50',
                                    ].join(' ')}
                                >
                                    {e.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Visores de PDF */}
                    <div className={`mt-8 grid gap-6 ${gridCols}`}>
                        {docs.length === 0 && (
                            <div className="col-span-full text-sm text-gray-600">
                                No hay PDFs disponibles para la escuela seleccionada.
                            </div>
                        )}

                        {docs.map((d) => (
                            <section key={d.key} className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                                <h4 className="text-base font-semibold text-gray-900">Precios - {d.title}</h4>
                                <p className="mt-1 text-sm text-gray-600">Lista de precios {d.title.toLowerCase()}.</p>
                                <div className="mt-4 rounded-lg border overflow-hidden bg-gray-50">
                                    <iframe
                                        src={`${d.url}#view=FitH`}
                                        title={`Precios ${d.title}`}
                                        className="w-full h-[600px]"
                                    />
                                </div>
                                <div className="mt-3 flex gap-3">
                                    <a
                                        href={d.url}
                                        target="_blank"
                                        rel="noopener"
                                        className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                    >
                                        Abrir en nueva pestaña →
                                    </a>
                                    <a
                                        href={d.url}
                                        download
                                        className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                    >
                                        Descargar PDF
                                    </a>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
