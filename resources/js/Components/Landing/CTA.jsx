export default function CTA() {
    return (
        <section id="contacto" className="bg-orange-50">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="rounded-2xl bg-gradient-to-tr from-orange-600 to-orange-500 px-6 py-12 text-center text-white shadow-sm sm:px-16">
                    <h3 className="text-2xl font-semibold">Hablemos de tu institución</h3>
                    <p className="mx-auto mt-2 max-w-2xl text-sm text-orange-50">
                        Cotizá con nosotros y descubrí cómo podemos acompañarte con un servicio seguro y de calidad.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <a
                            href="https://wa.me/549000000000"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-orange-50"
                        >
                            Escribinos por WhatsApp
                        </a>
                        <a
                            href="mailto:contacto@tucatering.com"
                            className="inline-flex items-center rounded-md border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            Enviar email
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
