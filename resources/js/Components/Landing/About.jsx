export default function About() {
    return (
        <section id="about" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-5 sm:py-12">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Izquierda: Imagen dentro de círculo blanco */}
                    <div className="hidden lg:flex justify-center order-first lg:order-none">
                        <div className="relative h-64 w-64 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-white shadow-xl border-4 border-orange-500 p-1 overflow-hidden">
                            <img
                                src="/images/about-chef.png"
                                alt="Equipo de cocina de Tu Catering"
                                className="h-full w-full rounded-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Derecha: Diseño alternativo con bloque destacado, badges y cita */}
                    <div className="mx-auto w-full max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-center lg:text-left">Nuestra esencia</h2>

                        <div className="flex lg:hidden justify-center order-first lg:order-none pt-5">
                            <div className="relative h-64 w-64 sm:h-72 sm:w-72 lg:h-96 lg:w-96 rounded-full bg-white shadow-xl border-4 border-orange-500 p-1 overflow-hidden">
                                <img
                                    src="/images/about-chef.png"
                                    alt="Equipo de cocina de Tu Catering"
                                    className="h-full w-full rounded-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Bloque destacado */}
                        <div className="mt-6 rounded-2xl bg-orange-50/70 p-6 ring-1 ring-orange-100">
                            <p className="text-base leading-7 text-gray-700">
                                Nuestra esencia es acompañar a cada institución con una alimentación cuidada y cercana.
                                Combinamos nutrición, higiene y calidad para crear menús equilibrados, procesos claros
                                y una atención que escucha las necesidades de cada comunidad educativa.
                            </p>
                        </div>

                        {/* Badges de valores (chips con borde degradado e icono) */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            {/* Nutrición */}
                            <div className="group">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">🥗</span>
                                        Nutrición
                                    </span>
                                </span>
                            </div>
                            {/* Higiene */}
                            <div className="group">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">✨</span>
                                        Higiene
                                    </span>
                                </span>
                            </div>
                            {/* Calidad */}
                            <div className="group">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">⭐</span>
                                        Calidad
                                    </span>
                                </span>
                            </div>
                            {/* Cercanía */}
                            <div className="group">
                                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-700 transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">🤝</span>
                                        Cercanía
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* Cita / Testimonio corto */}
                        <figure className="mt-6">
                            <blockquote className="rounded-2xl border border-orange-100 bg-white p-5 text-gray-700 shadow-sm">
                                <p className="text-sm italic">
                                    "Nuestro compromiso diario es ofrecer preparaciones ricas y balanceadas, con procesos
                                    cuidados y atención cercana a cada comunidad educativa."
                                </p>
                            </blockquote>
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    );
}
