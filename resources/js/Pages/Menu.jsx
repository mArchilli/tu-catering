import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Menu({ economicoUrl = null, generalUrl = null }) {
    const DOCS_BASE = (import.meta.env.VITE_PUBLIC_DOCS_PATH || 'docs').replace(/^\/?(?:public|public_html)\/?/i,'').replace(/\/+$/,'');
    const DOCS_URL = (import.meta.env.VITE_PUBLIC_DOCS_URL || '').replace(/\/$/, '');
    const baseHref = DOCS_URL || `/${DOCS_BASE}`;
    const sanitizeHref = (href) => {
        if (!href) return href;
        try {
            const u = new URL(href, window.location?.origin || 'http://localhost');
            const cleanedPath = u.pathname.replace(/^\/?public_html\/?/i, '');
            const normalized = '/' + cleanedPath.replace(/^\/+/, '');
            return `${u.origin}${normalized}${u.search}${u.hash}`;
        } catch {
            return href.replace(/^\/?public_html\/?/i, '/');
        }
    };
    const effectiveEconomicoUrl = sanitizeHref(economicoUrl || `${baseHref}/menus/menu_economico.pdf`);
    const effectiveGeneralUrl = sanitizeHref(generalUrl || `${baseHref}/menus/menu_general.pdf`);
    const { data, setData, post, processing, errors, reset } = useForm({
        menu_economico: null,
        menu_general: null,
    });

    const [previewEconomico, setPreviewEconomico] = useState(null);
    const [previewGeneral, setPreviewGeneral] = useState(null);

    useEffect(() => {
        if (data.menu_economico instanceof File) {
            const url = URL.createObjectURL(data.menu_economico);
            setPreviewEconomico(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewEconomico(null);
    }, [data.menu_economico]);

    useEffect(() => {
        if (data.menu_general instanceof File) {
            const url = URL.createObjectURL(data.menu_general);
            setPreviewGeneral(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewGeneral(null);
    }, [data.menu_general]);

    function submit(e) {
        e.preventDefault();
        post(route('menu.update'), {
            forceFormData: true,
            onSuccess: () => reset('menu_economico', 'menu_general'),
        });
    }

    return (
        <AuthenticatedLayout
        >
            <Head title="Menú" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-900">Cargar PDFs</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Subí los archivos en formato PDF para el menú económico y el menú general.
                        </p>

                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Menú económico (PDF)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-orange-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-500"
                                    onChange={(e) => setData('menu_economico', e.target.files[0] ?? null)}
                                />
                                {errors.menu_economico && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.menu_economico}</p>
                                )}
                                {/* Enlace: ver PDF seleccionado o actual */}
                                {previewEconomico && (
                                    <div className="mt-2 text-sm">
                                        <a href={previewEconomico} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:text-orange-700">Ver PDF seleccionado →</a>
                                    </div>
                                )}
                {!previewEconomico && effectiveEconomicoUrl && (
                                    <p className="mt-2 text-sm">
                                        Actual: <a href={effectiveEconomicoUrl} target="_blank" className="text-orange-400 hover:text-orange-700" rel="noopener noreferrer">Ver PDF</a>
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Menú general (PDF)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-orange-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-500"
                                    onChange={(e) => setData('menu_general', e.target.files[0] ?? null)}
                                />
                                {errors.menu_general && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.menu_general}</p>
                                )}
                                {/* Enlace: ver PDF seleccionado o actual */}
                                {previewGeneral && (
                                    <div className="mt-2 text-sm">
                                        <a href={previewGeneral} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-400 hover:text-orange-700">Ver PDF seleccionado →</a>
                                    </div>
                                )}
                {!previewGeneral && effectiveGeneralUrl && (
                                    <p className="mt-2 text-sm">
                                        Actual: <a href={effectiveGeneralUrl} target="_blank" className="text-orange-400 hover:text-orange-700" rel="noopener noreferrer">Ver PDF</a>
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <Link
                                    href="dashboard"
                                    className="inline-flex items-center rounded-md border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
