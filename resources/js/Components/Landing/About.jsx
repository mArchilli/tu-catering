export default function About() {
    return (
        <section id="about" className="bg-white h-screen flex flex-col justify-center">
            <div className="mx-auto max-w-7xl px-6 py-5 sm:py-12 w-full" data-aos="fade-up" data-aos-delay="400">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Izquierda: Imagen dentro de círculo blanco */}
                    <div className="hidden lg:flex justify-center order-first lg:order-none">
                        <div className="relative h-64 w-64 sm:h-72 sm:w-72 lg:h-[28rem] lg:w-[28rem] rounded-full bg-white shadow-xl border-4 border-orange-500 p-1 overflow-hidden">
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
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 text-center lg:text-left">Nuestra esencia</h2>

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
                        <div className="mt-6 bg-orange-50/70 p-6 ring-1 ring-orange-100 rounded-md">
                            <p className="text-base lg:text-lg leading-7 lg:leading-8 text-gray-700 lg:pl-0">
                                Creemos en acompañar a cada institución con una alimentación cuidada y cercana.
                                Combinamos nutrición, higiene y calidad para crear menús equilibrados, procesos claros
                                y una atención que escucha las necesidades del espacio.
                            </p>
                        </div>

                        {/* Badges de valores (chips con borde degradado e icono) */}
                        <div className="mt-4 grid grid-cols-2 gap-2 justify-items-center sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:grid-cols-4 lg:flex-nowrap lg:justify-start lg:pl-0">
                            {/* Nutrición */}
                            <div className="group w-full lg:w-auto">
                                <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm sm:px-3 sm:py-1 sm:text-xs font-semibold text-orange-700 text-center min-h-[44px] transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">🥗</span>
                                        Nutrición
                                    </span>
                                </span>
                            </div>
                            {/* Higiene */}
                            <div className="group w-full lg:w-auto">
                                <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm sm:px-3 sm:py-1 sm:text-xs font-semibold text-orange-700 text-center min-h-[44px] transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">✨</span>
                                        Higiene
                                    </span>
                                </span>
                            </div>
                            {/* Calidad */}
                            <div className="group w-full lg:w-auto">
                                <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm sm:px-3 sm:py-1 sm:text-xs font-semibold text-orange-700 text-center min-h-[44px] transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">⭐</span>
                                        Calidad
                                    </span>
                                </span>
                            </div>
                            {/* Cercanía */}
                            <div className="group w-full lg:w-auto">
                                <span className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-[1px] shadow-sm">
                                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm sm:px-3 sm:py-1 sm:text-xs font-semibold text-orange-700 text-center min-h-[44px] transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <span className="inline-flex h-7 w-7 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-100 text-orange-600">🤝</span>
                                        Cercanía
                                    </span>
                                </span>
                            </div>
                        </div>

                        {/* Cita / Testimonio corto */}
                        <figure className="mt-6 lg:pl-0">
                            <blockquote className="bg-white p-5 text-gray-700 shadow-sm lg:p-0">
                                <p className="text-sm italic lg:pl-0">
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
