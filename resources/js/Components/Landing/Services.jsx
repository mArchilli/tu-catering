export default function Services() {
    const items = [
        { title: 'Servicio Alimentario Escolar (SAE)', desc: 'Planificación y ejecución de menús nutritivos y adaptados a normativas vigentes.' },
        { title: 'Menús equilibrados', desc: 'Opciones balanceadas con foco en calidad, inocuidad y variedad.' },
        { title: 'Adaptaciones y condiciones', desc: 'Alternativas para celiaquía y otras necesidades específicas.' },
    ];
    return (
        <section id="services" className="bg-orange-50">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Servicios</h2>
                    <p className="mt-3 text-base text-gray-600">
                        Acompañamos a escuelas con propuestas flexibles, seguras y de alto estándar.
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((it) => (
                        <div key={it.title} className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 6v12M6 12h12" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">{it.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{it.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
