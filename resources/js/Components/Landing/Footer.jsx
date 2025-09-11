export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-orange-100 bg-orange-50/50" data-aos="fade-up" data-aos-delay="400">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8" >
                {/* Top: grid content */}
                <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div className="border-2 border-orange-300 rounded-xl p-6">
                        <a href="#inicio" className="inline-flex items-center gap-2">
                            <img src="/logo-hero.png" alt="Tu Catering" className="h-10 w-auto" />
                            <span className="sr-only">Ir al inicio</span>
                        </a>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
                            Soluciones de catering a medida para eventos sociales y corporativos. Ingredientes
                            frescos, servicio atento y experiencias memorables.
                        </p>

                        
                    </div>

                    {/* Navegación */}
                    <div className="border-2 border-orange-300 rounded-xl p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Navegación</h3>
                        <ul className="mt-4 space-y-3 text-sm text-gray-600">
                            <li><a href="#inicio" className="hover:text-gray-900">Inicio</a></li>
                            <li><a href="#about" className="hover:text-gray-900">Nuestra esencia</a></li>
                            <li><a href="#services" className="hover:text-gray-900">Servicios</a></li>
                            <li><a href="#instituciones" className="hover:text-gray-900">Instituciones</a></li>
                            <li><a href="#contacto" className="hover:text-gray-900">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="border-2 border-orange-300 rounded-xl p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Contacto</h3>
                        <ul className="mt-4 space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 text-orange-600">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <a href="tel:+541112345678" className="hover:text-gray-900">+54 11 7006-2628</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 text-orange-600">
                                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                    <path d="m22 6-10 7L2 6" />
                                </svg>
                                <a href="mailto:info@tucatering.com" className="hover:text-gray-900">info@tucatering.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 text-orange-600">
                                    <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>Buenos Aires, Argentina</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t border-orange-100 pt-6">
                    <div className="mx-auto flex flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">
                        <p>© {year} Tu Catering. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-4">
                            <p>Desarrollado por <a href="https://archillimatias.dev" className="hover:text-orange-300 text-orange-500" target="_blank">Archilli Matias</a> y Leon Comolli.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
