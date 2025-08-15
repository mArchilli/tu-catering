import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Price({ prices = {} }) {
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

    function submit(e) {
        e.preventDefault();
        post(route('prices.update'), {
            forceFormData: true,
        });
    }

    const PdfField = ({ id, label, value, onChange, error }) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label} (PDF)
            </label>
            <input
                id={id}
                name={id}
                type="file"
                accept="application/pdf"
                className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-500 focus:outline-none"
                onClick={(e) => { e.target.value = null; }}
                onChange={(e) => onChange(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
            />
            <div className="mt-1 text-xs text-gray-500">
                {value ? `Seleccionado: ${value.name}` : 'Ningún archivo seleccionado'}
            </div>
            {error && <p className="mt-1 text-xs text-orange-600">{error}</p>}
        </div>
    );

    return (
        <AuthenticatedLayout >
            <Head title="Precios" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-600">
                            Cargá los PDFs por nivel y escuela (no es obligatorio subir todos).
                        </p>

                        {/* Juan XXIII */}
                        <div className="mt-6">
                            <h3 className="text-base font-semibold text-gray-900">Juan XXIII</h3>
                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <PdfField
                                    id="juan_xxiii_inicial"
                                    label="Inicial"
                                    value={data.juan_xxiii_inicial}
                                    onChange={(f) => setData('juan_xxiii_inicial', f)}
                                    error={errors.juan_xxiii_inicial}
                                />
                                <PdfField
                                    id="juan_xxiii_primario"
                                    label="Primario"
                                    value={data.juan_xxiii_primario}
                                    onChange={(f) => setData('juan_xxiii_primario', f)}
                                    error={errors.juan_xxiii_primario}
                                />
                                <PdfField
                                    id="juan_xxiii_secundario"
                                    label="Secundario"
                                    value={data.juan_xxiii_secundario}
                                    onChange={(f) => setData('juan_xxiii_secundario', f)}
                                    error={errors.juan_xxiii_secundario}
                                />
                            </div>
                        </div>

                        {/* Colegio Buenos Aires */}
                        <div className="mt-8">
                            <h3 className="text-base font-semibold text-gray-900">Colegio Buenos Aires</h3>
                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <PdfField
                                    id="cba_inicial"
                                    label="Inicial"
                                    value={data.cba_inicial}
                                    onChange={(f) => setData('cba_inicial', f)}
                                    error={errors.cba_inicial}
                                />
                                <PdfField
                                    id="cba_primario"
                                    label="Primario"
                                    value={data.cba_primario}
                                    onChange={(f) => setData('cba_primario', f)}
                                    error={errors.cba_primario}
                                />
                                <PdfField
                                    id="cba_secundario"
                                    label="Secundario"
                                    value={data.cba_secundario}
                                    onChange={(f) => setData('cba_secundario', f)}
                                    error={errors.cba_secundario}
                                />
                            </div>
                        </div>

                        {/* Santísimo Redentor */}
                        <div className="mt-8">
                            <h3 className="text-base font-semibold text-gray-900">Santísimo Redentor</h3>
                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <PdfField
                                    id="sr_inicial"
                                    label="Inicial"
                                    value={data.sr_inicial}
                                    onChange={(f) => setData('sr_inicial', f)}
                                    error={errors.sr_inicial}
                                />
                                <PdfField
                                    id="sr_primario"
                                    label="Primario"
                                    value={data.sr_primario}
                                    onChange={(f) => setData('sr_primario', f)}
                                    error={errors.sr_primario}
                                />
                                <PdfField
                                    id="sr_secundario"
                                    label="Secundario"
                                    value={data.sr_secundario}
                                    onChange={(f) => setData('sr_secundario', f)}
                                    error={errors.sr_secundario}
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
                                className="inline-flex items-center rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
