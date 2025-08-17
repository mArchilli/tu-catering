export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-orange-100 bg-orange-50/50">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Top: grid content */}
                <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <a href="#inicio" className="inline-flex items-center gap-2">
                            <img src="/logo-hero.png" alt="Tu Catering" className="h-10 w-auto" />
                            <span className="sr-only">Ir al inicio</span>
                        </a>
                        <p className="mt-4 max-w-xs text-sm leading-6 text-gray-600">
                            Soluciones de catering a medida para eventos sociales y corporativos. Ingredientes
                            frescos, servicio atento y experiencias memorables.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            {/* Instagram icon simple */}
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 text-orange-600 transition-colors hover:bg-orange-100/60 hover:text-orange-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                                    <rect x="3" y="3" width="18" height="18" rx="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17" cy="7" r="1.2" />
                                </svg>
                            </a>
                            {/* WhatsApp icon simple */}
                            <a
                                href="https://wa.me/541112345678"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="WhatsApp"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 text-orange-600 transition-colors hover:bg-orange-100/60 hover:text-orange-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M12 22a9.9 9.9 0 0 1-4.24-.95L3 21l.98-4.67A9.95 9.95 0 1 1 12 22Z" />
                                    <path d="M8.5 10.5c.3 1.8 2.2 3.6 4 4 .3.1.6 0 .8-.2l1.1-1.1c.2-.2.2-.5 0-.7l-1.1-1.1c-.2-.2-.5-.2-.7 0l-.5.5c-.3.3-.7.3-1 .1-.7-.4-1.3-1-1.7-1.7-.2-.3-.2-.7.1-1l.5-.5c.2-.2.2-.5 0-.7L9.7 6.9c-.2-.2-.5-.2-.7 0l-1.1 1.1c-.2.2-.3.5-.2.8Z" />
                                </svg>
                            </a>
                            {/* Facebook as generic link icon */}
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 text-orange-600 transition-colors hover:bg-orange-100/60 hover:text-orange-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <path d="M15 3H9a6 6 0 0 0-6 6v6a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6V9a6 6 0 0 0-6-6Z" />
                                    <path d="M12 17v-6a2 2 0 0 1 2-2h2" />
                                    <path d="M12 11h4" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navegación */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Navegación</h3>
                        <ul className="mt-4 space-y-3 text-sm text-gray-600">
                            <li><a href="#inicio" className="hover:text-gray-900">Inicio</a></li>
                            <li><a href="#servicios" className="hover:text-gray-900">Servicios</a></li>
                            <li><a href="#menu" className="hover:text-gray-900">Menú</a></li>
                            <li><a href="#about" className="hover:text-gray-900">Sobre nosotros</a></li>
                            <li><a href="#contacto" className="hover:text-gray-900">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">Contacto</h3>
                        <ul className="mt-4 space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 text-orange-600">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <a href="tel:+541112345678" className="hover:text-gray-900">+54 11 1234-5678</a>
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
                            <li className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 text-orange-600">
                                    <path d="M3 12h18" />
                                    <path d="M12 3v18" />
                                </svg>
                                <span>Lun a Vie: 9:00 - 18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 border-t border-orange-100 pt-6">
                    <div className="mx-auto flex flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">
                        <p>© {year} Tu Catering. Todos los derechos reservados.</p>
                        <div className="flex items-center gap-4">
                            <a href="#privacidad" className="hover:text-gray-900">Privacidad</a>
                            <span className="text-gray-300">|</span>
                            <a href="#terminos" className="hover:text-gray-900">Términos</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
