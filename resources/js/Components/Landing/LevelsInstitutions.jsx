export default function LevelsInstitutions() {
    const institution = { name: 'Juan XXIII', img: '/images/juan-xxiii.png' };

    return (
        <section id="instituciones" className="bg-white h-screen flex flex-col justify-center">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 w-full">
                <div className="mx-auto max-w-3xl text-center" data-aos="fade-up" data-aos-delay="400">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
                        Instituciones que confían en nosotros
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Trabajamos con colegios reconocidos brindando alimentación escolar con calidad, higiene y puntualidad.
                    </p>
                </div>

                <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
                    <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 shadow-md overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-10">
                            <div className="flex-shrink-0 flex items-center justify-center w-36 h-36 rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(249,115,22,0.30)] ring-1 ring-orange-100 p-3">
                                <img
                                    src={institution.img}
                                    alt={institution.name}
                                    className="w-full h-full object-contain drop-shadow-sm"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3">
                                    Institución educativa
                                </span>
                                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                    {institution.name}
                                </h3>
                                <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 to-amber-300 mx-auto sm:mx-0"></div>
                                <p className="mt-4 text-gray-600 text-base leading-relaxed max-w-xl">
                                    Trabajamos junto al Colegio Juan XXIII brindando alimentación escolar diaria con estándares
                                    de calidad, higiene y puntualidad. Una alianza construida sobre confianza y compromiso con
                                    la comunidad educativa.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 ring-1 ring-green-200">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Servicio activo
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-orange-200">
                                        Alimentación escolar diaria
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
