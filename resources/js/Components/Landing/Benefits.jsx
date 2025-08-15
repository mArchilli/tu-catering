export default function Benefits() {
    const benefits = [
        { title: 'Experiencia', desc: 'Personal con muchos años de trayectoria y excelencia operativa.', icon: (
            <path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4.5L5.5 20 8 13 2.5 9H9l3-7z" />
        )},
        { title: '5 años brindando servicio', desc: 'Crecimiento sostenido y confianza de instituciones.', icon: (
            <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        )},
        { title: 'Calidad y seguridad', desc: 'Procesos estandarizados, higiene y control en cada etapa.', icon: (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        )},
    ];
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">¿Por qué elegirnos?</h2>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {benefits.map((b) => (
                        <div key={b.title} className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    {b.icon}
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
