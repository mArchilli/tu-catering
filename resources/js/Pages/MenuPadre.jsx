import ParentLayout from '@/Layouts/ParentLayout';
import { Head, usePage } from '@inertiajs/react';

export default function MenuPadre() {
    const { props } = usePage();
    const generalUrl =
        props?.menus?.generalUrl ||
        props?.menus?.general ||
        '/storage/menus/menu_general.pdf';
    const economicoUrl =
        props?.menus?.economicoUrl ||
        props?.menus?.economico ||
        '/storage/menus/menu_economico.pdf';

    return (
        <ParentLayout>
            <Head title="Menú" />
            <div className="bg-orange-50 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-400 shadow-sm">
                        <div className="p-6 text-white sm:p-8">
                            <h3 className="text-lg font-semibold">Menús disponibles</h3>
                            <p className="mt-1 text-sm text-orange-50">
                                Consultá el Menú General y el Menú Económico vigentes.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <h4 className="text-base font-semibold text-gray-900">Menú General</h4>
                            <p className="mt-1 text-sm text-gray-600">Propuesta completa y variada.</p>

                            <div className="mt-4 rounded-lg border overflow-hidden bg-gray-50">
                                <iframe
                                    src={`${generalUrl}#view=FitH`}
                                    title="Menú General"
                                    className="w-full h-[600px]"
                                />
                            </div>
                            <div className="mt-3 flex gap-3">
                                <a
                                    href={generalUrl}
                                    target="_blank"
                                    rel="noopener"
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Abrir en nueva pestaña →
                                </a>
                                <a
                                    href={generalUrl}
                                    download
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Descargar PDF
                                </a>
                            </div>
                        </section>

                        <section className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <h4 className="text-base font-semibold text-gray-900">Menú Económico</h4>
                            <p className="mt-1 text-sm text-gray-600">Alternativa accesible manteniendo calidad.</p>

                            <div className="mt-4 rounded-lg border overflow-hidden bg-gray-50">
                                <iframe
                                    src={`${economicoUrl}#view=FitH`}
                                    title="Menú Económico"
                                    className="w-full h-[600px]"
                                />
                            </div>
                            <div className="mt-3 flex gap-3">
                                <a
                                    href={economicoUrl}
                                    target="_blank"
                                    rel="noopener"
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Abrir en nueva pestaña →
                                </a>
                                <a
                                    href={economicoUrl}
                                    download
                                    className="text-sm font-semibold text-orange-400 hover:text-orange-700"
                                >
                                    Descargar PDF
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
