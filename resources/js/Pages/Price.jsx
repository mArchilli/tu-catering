import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Price(props) {
    const DOCS_BASE = (import.meta.env.VITE_PUBLIC_DOCS_PATH || 'docs').replace(/^\/?(?:public|public_html)\/?/i,'').replace(/\/+$/,'');
    const DOCS_URL = (import.meta.env.VITE_PUBLIC_DOCS_URL || '').replace(/\/$/, '');
    // El backend envía 'existing' y 'serviceTypePrices'.
    const { existing = {}, prices = {}, serviceTypePrices = {} } = props || {};
    const currentMap = (prices && Object.keys(prices).length > 0) ? prices : existing;
    const { data, setData, post, processing, errors, reset } = useForm({
        // Juan XXIII
        juan_xxiii_inicial: null,
        juan_xxiii_primario: null,
        juan_xxiii_secundario: null,
        // Colegio Buenos Aires
        cba_inicial: null,
        cba_primario: null,
        cba_secundario: null,
        // Santísimo Redentor
        sr_inicial: null,
        sr_primario: null,
        sr_secundario: null,
    });

    // Form precios service types
    const [pricesForm, setPricesForm] = useState({
        vianda_price: serviceTypePrices.vianda ? (serviceTypePrices.vianda / 100).toString() : '',
        economico_price: serviceTypePrices.economico ? (serviceTypePrices.economico / 100).toString() : '',
        premium_price: serviceTypePrices.premium ? (serviceTypePrices.premium / 100).toString() : '',
    });
    const [confirmModal, setConfirmModal] = useState(false);
    const [loadingPrices, setLoadingPrices] = useState(false);

    const submitServicePrices = () => {
        setLoadingPrices(true);
        router.post(route('prices.update.service-types'), pricesForm, {
            preserveScroll: true,
            onFinish: () => { setLoadingPrices(false); setConfirmModal(false); },
        });
    };

    function submit(e) {
        e.preventDefault();
        post(route('prices.update'), {
            forceFormData: true,
        });
    }

    const sanitizeHref = (href) => {
        if (!href) return href;
        // Normaliza relativas y elimina /public_html al inicio del path
        try {
            const u = new URL(href, window.location?.origin || 'http://localhost');
            const cleanedPath = u.pathname.replace(/^\/?public_html\/?/i, '');
            const normalized = '/' + cleanedPath.replace(/^\/+/, '');
            if (DOCS_URL && normalized.startsWith(`/${DOCS_BASE}/`)) {
                return `${DOCS_URL}${normalized.substring(DOCS_BASE.length + 1)}${u.search}${u.hash}`;
            }
            return `${u.origin}${normalized}${u.search}${u.hash}`;
        } catch {
            // Si no es URL válida, limpiamos string
            let s = href;
            if (!/^https?:\/\//i.test(s) && !s.startsWith('/')) s = `/${s}`;
            s = s.replace(/^\/?public_html\/?/i, '/');
            if (DOCS_URL && s.startsWith(`/${DOCS_BASE}/`)) {
                return `${DOCS_URL}${s.substring(DOCS_BASE.length + 1)}`;
            }
            return s;
        }
    };

    const getCurrentUrl = (key) => {
        const v = currentMap?.[key];
        if (!v) return null;
        if (typeof v === 'string') return sanitizeHref(v);
        if (typeof v === 'object' && v !== null) return sanitizeHref(v.url || v.href || null);
        return null;
    };

    const PdfField = ({ id, label, value, onChange, error, currentUrl }) => {
        const [previewUrl, setPreviewUrl] = useState(null);

        useEffect(() => {
            if (value instanceof File) {
                const url = URL.createObjectURL(value);
                setPreviewUrl(url);
                return () => URL.revokeObjectURL(url);
            }
            setPreviewUrl(null);
        }, [value]);

        return (
            <div className="mb-6">
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label} (PDF)
                </label>

                <div className="mt-2 flex items-center gap-3">
                    {/* input oculto activado por el label-actuador compacto */}
                    <input
                        id={id}
                        name={id}
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onClick={(e) => { e.target.value = null; }}
                        onChange={(e) => onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                        aria-hidden="true"
                    />
                    <label
                        htmlFor={id}
                        className="inline-flex items-center rounded-md bg-orange-400 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors duration-150 cursor-pointer"
                    >
                        {/* Ícono pequeño */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        </svg>
                        Subir
                    </label>

                    <div className="text-xs text-gray-500 truncate">
                        {value ? `${value.name}` : 'Ningún archivo seleccionado'}
                    </div>
                </div>

                {/* Enlace para ver el archivo seleccionado (sin iframe) */}
                {previewUrl && (
                    <div className="mt-2 text-sm">
                        <a href={previewUrl} target="_blank" rel="noreferrer" className="font-semibold text-orange-400 hover:text-orange-700">Ver PDF seleccionado →</a>
                    </div>
                )}

                {/* Enlace al archivo actual si no hay selección */}
                {!previewUrl && currentUrl && (
                    <p className="mt-2 text-sm">
                        Actual: <a href={currentUrl} target="_blank" className="text-orange-400 hover:text-orange-700" rel="noreferrer">Ver PDF</a>
                    </p>
                )}
                {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}
            </div>
        );
    };

    return (
        <AuthenticatedLayout >
            <Head title="Precios" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Contenedor de precios de Service Types */}
                    <div className="mb-10 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-900">Precios de Servicios</h3>
                        <p className="mt-1 text-sm text-gray-600">Modificá uno o varios precios. Los valores se guardan en centavos internamente.</p>
                        <div className="mt-5 grid gap-5 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vianda (ARS)</label>
                                <input type="number" min="0" step="0.01" value={pricesForm.vianda_price} onChange={e=>setPricesForm(p=>({...p, vianda_price: e.target.value}))} className="mt-1 w-full rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400" placeholder="Ej: 1500" />
                                <div className="mt-1 text-xs text-gray-500">Actual: {serviceTypePrices.vianda ? '$'+(serviceTypePrices.vianda/100).toLocaleString('es-AR') : '-'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Comedor Económico (ARS)</label>
                                <input type="number" min="0" step="0.01" value={pricesForm.economico_price} onChange={e=>setPricesForm(p=>({...p, economico_price: e.target.value}))} className="mt-1 w-full rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400" placeholder="Ej: 2000" />
                                <div className="mt-1 text-xs text-gray-500">Actual: {serviceTypePrices.economico ? '$'+(serviceTypePrices.economico/100).toLocaleString('es-AR') : '-'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Comedor Premium (ARS)</label>
                                <input type="number" min="0" step="0.01" value={pricesForm.premium_price} onChange={e=>setPricesForm(p=>({...p, premium_price: e.target.value}))} className="mt-1 w-full rounded-md border-gray-300 text-sm focus:border-orange-400 focus:ring-orange-400" placeholder="Ej: 2500" />
                                <div className="mt-1 text-xs text-gray-500">Actual: {serviceTypePrices.premium ? '$'+(serviceTypePrices.premium/100).toLocaleString('es-AR') : '-'}</div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={()=>setConfirmModal(true)} disabled={loadingPrices || (!pricesForm.vianda_price && !pricesForm.economico_price && !pricesForm.premium_price)} className="rounded-md bg-orange-400 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50">Guardar cambios</button>
                        </div>
                    </div>
                    <form onSubmit={submit} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">
                            Cargá los PDFs por nivel y escuela (no es obligatorio subir todos).
                        </p>

                        {/* Juan XXIII */}
                        <div className="mt-6">
                            <h3 className="text-base font-semibold text-gray-900">Juan XXIII</h3>
                            <div className="mt-4 grid gap-6 md:grid-cols-3">
                                <PdfField
                                    id="juan_xxiii_inicial"
                                    label="Inicial"
                                    value={data.juan_xxiii_inicial}
                                    onChange={(f) => setData('juan_xxiii_inicial', f)}
                                    error={errors.juan_xxiii_inicial}
                                    currentUrl={getCurrentUrl('juan_xxiii_inicial')}
                                />
                                <PdfField
                                    id="juan_xxiii_primario"
                                    label="Primario"
                                    value={data.juan_xxiii_primario}
                                    onChange={(f) => setData('juan_xxiii_primario', f)}
                                    error={errors.juan_xxiii_primario}
                                    currentUrl={getCurrentUrl('juan_xxiii_primario')}
                                />
                                <PdfField
                                    id="juan_xxiii_secundario"
                                    label="Secundario"
                                    value={data.juan_xxiii_secundario}
                                    onChange={(f) => setData('juan_xxiii_secundario', f)}
                                    error={errors.juan_xxiii_secundario}
                                    currentUrl={getCurrentUrl('juan_xxiii_secundario')}
                                />
                            </div>
                        </div>

                        {/* Colegio Buenos Aires */}
                        <div className="mt-8">
                            <h3 className="text-base font-semibold text-gray-900">Colegio Buenos Aires</h3>
                            <div className="mt-4 grid gap-6 md:grid-cols-3">
                                <PdfField
                                    id="cba_inicial"
                                    label="Inicial"
                                    value={data.cba_inicial}
                                    onChange={(f) => setData('cba_inicial', f)}
                                    error={errors.cba_inicial}
                                    currentUrl={getCurrentUrl('cba_inicial')}
                                />
                                <PdfField
                                    id="cba_primario"
                                    label="Primario"
                                    value={data.cba_primario}
                                    onChange={(f) => setData('cba_primario', f)}
                                    error={errors.cba_primario}
                                    currentUrl={getCurrentUrl('cba_primario')}
                                />
                                <PdfField
                                    id="cba_secundario"
                                    label="Secundario"
                                    value={data.cba_secundario}
                                    onChange={(f) => setData('cba_secundario', f)}
                                    error={errors.cba_secundario}
                                    currentUrl={getCurrentUrl('cba_secundario')}
                                />
                            </div>
                        </div>

                        {/* Santísimo Redentor */}
                        <div className="mt-8">
                            <h3 className="text-base font-semibold text-gray-900">Santísimo Redentor</h3>
                            <div className="mt-4 grid gap-6 md:grid-cols-3">
                                <PdfField
                                    id="sr_inicial"
                                    label="Inicial"
                                    value={data.sr_inicial}
                                    onChange={(f) => setData('sr_inicial', f)}
                                    error={errors.sr_inicial}
                                    currentUrl={getCurrentUrl('sr_inicial')}
                                />
                                <PdfField
                                    id="sr_primario"
                                    label="Primario"
                                    value={data.sr_primario}
                                    onChange={(f) => setData('sr_primario', f)}
                                    error={errors.sr_primario}
                                    currentUrl={getCurrentUrl('sr_primario')}
                                />
                                <PdfField
                                    id="sr_secundario"
                                    label="Secundario"
                                    value={data.sr_secundario}
                                    onChange={(f) => setData('sr_secundario', f)}
                                    error={errors.sr_secundario}
                                    currentUrl={getCurrentUrl('sr_secundario')}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-end gap-3">
                            <Link
                                href="dashboard"
                                className="inline-flex items-center rounded-md border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Volver
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                    {/* Modal confirmación precios */}
                    {confirmModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={()=>!loadingPrices && setConfirmModal(false)}></div>
                            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
                                <div className="border-b border-gray-100 px-5 py-4">
                                    <h3 className="text-sm font-semibold text-gray-800">Confirmar actualización de precios</h3>
                                </div>
                                <div className="px-5 py-4 text-sm text-gray-700 space-y-3">
                                    <p>Vas a actualizar los precios de los siguientes servicios (solo se aplican los que completaste):</p>
                                    <ul className="list-disc pl-5 text-xs space-y-1">
                                        {pricesForm.vianda_price && <li>Vianda: {pricesForm.vianda_price} ARS</li>}
                                        {pricesForm.economico_price && <li>Comedor Económico: {pricesForm.economico_price} ARS</li>}
                                        {pricesForm.premium_price && <li>Comedor Premium: {pricesForm.premium_price} ARS</li>}
                                    </ul>
                                    <div className="rounded-md bg-orange-50 px-3 py-2 text-xs text-orange-700 border border-orange-200">Esta acción reemplazará los precios actuales.</div>
                                </div>
                                <div className="flex items-center justify-end gap-2 bg-gray-50 px-5 py-3">
                                    <button disabled={loadingPrices} onClick={()=>setConfirmModal(false)} className="rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100">Cancelar</button>
                                    <button disabled={loadingPrices} onClick={submitServicePrices} className="rounded-md bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500 disabled:opacity-50">{loadingPrices ? 'Guardando...' : 'Confirmar'}</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
