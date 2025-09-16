import { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export default function CTA() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [touched, setTouched] = useState({ name: false, email: false, message: false });
    const [submitted, setSubmitted] = useState(false);

    // Nuevos estados
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const nameValid = name.trim().length >= 2;
    const messageValid = message.trim().length >= 5;
    const formValid = emailValid && nameValid && messageValid;

    const onSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, message: true });
        if (!formValid) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ name, email, message })
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Error al enviar. Intentalo nuevamente.');
            }
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setName('');
            setEmail('');
            setMessage('');
            setTouched({ name: false, email: false, message: false });
        } catch (err) {
            setError(err.message || 'Ocurrió un error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contacto" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {/* Layout unificado: una sola grilla responsive; mismo formulario para ambas vistas */}
                <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
                    {/* Izquierda: info de contacto (en mobile aparece debajo, en 2 columnas) */}
                    <div className="order-2 lg:order-1 rounded-2xl h-full">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 h-full lg:grid-rows-3">
                            {/* Teléfono */}
                            <div
                                className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm lg:h-full transition-colors duration-200 hover:border-orange-200 hover:shadow-md" data-aos="fade-right" data-aos-delay="400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-600">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <p className="mt-2 text-lg font-semibold text-gray-900">Teléfono</p>
                                <p className="mt-1 text-xs sm:text-lg text-gray-700">+54 11 7006-2628</p>
                            </div>
                            {/* Email */}
                            <div
                                className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm lg:h-full transition-colors duration-200 hover:border-orange-200 hover:shadow-md" data-aos="fade-right" data-aos-delay="400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-600">
                                    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                    <path d="m22 6-10 7L2 6" />
                                </svg>
                                <p className="mt-2 text-lg font-semibold text-gray-900">Email</p>
                                <p className="mt-1 text-xs sm:text-lg text-gray-700">info@tucatering.com.ar</p>
                            </div>
                            {/* Ubicación */}
                            <div
                                className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 shadow-sm col-span-2 lg:col-span-1 lg:h-full transition-colors duration-200 hover:border-orange-200 hover:shadow-md" data-aos="fade-right" data-aos-delay="400"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-orange-600">
                                    <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <p className="mt-2 text-lg font-semibold text-gray-900">Ubicación</p>
                                <p className="mt-1 text-xs sm:text-lg text-gray-700">Buenos Aires, Argentina</p>
                            </div>
                        </div>
                    </div>
                    {/* Derecha (desktop) / Arriba (mobile): mismo formulario */}
                    <div
                        className="group relative overflow-hidden order-1 lg:order-2 rounded-2xl h-full border border-orange-100 bg-white p-8 shadow-sm transition-colors duration-200 hover:border-orange-200 hover:shadow-md focus-within:border-orange-200 focus-within:shadow-md" data-aos="fade-left" data-aos-delay="400"
                    >
                        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center lg:text-left">Contactanos</h3>
                        <p className="mt-1 text-sm text-gray-600">Dejanos tu consulta y te respondemos a la brevedad.</p>
                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${touched.name && !nameValid ? 'border-red-300' : 'border-orange-200'}`}
                                    placeholder="Tu nombre"
                                    aria-invalid={touched.name && !nameValid}
                                />
                                {touched.name && !nameValid && (
                                    <p className="mt-1 text-xs text-red-600">Ingresá al menos 2 caracteres.</p>
                                )}
                            </div>
                            {/* Correo */}
                            <div>
                                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">Correo</label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                    className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${touched.email && !emailValid ? 'border-red-300' : 'border-orange-200'}`}
                                    placeholder="tu@email.com"
                                    aria-invalid={touched.email && !emailValid}
                                />
                                {touched.email && !emailValid && (
                                    <p className="mt-1 text-xs text-red-600">Ingresá un correo válido.</p>
                                )}
                            </div>
                            {/* Mensaje */}
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                                <textarea
                                    id="contact-message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                                    className={`mt-1 block w-full resize-y rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${touched.message && !messageValid ? 'border-red-300' : 'border-orange-200'}`}
                                    placeholder="Contanos qué necesitás"
                                    aria-invalid={touched.message && !messageValid}
                                />
                                {touched.message && !messageValid && (
                                    <p className="mt-1 text-xs text-red-600">Ingresá al menos 5 caracteres.</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!formValid || loading}
                                className={`inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition ${formValid && !loading ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                            >
                                {loading ? 'Enviando...' : 'Enviar'}
                            </button>
                            {error && (
                                <p className="text-center text-sm text-red-600">{error}</p>
                            )}
                            {submitted && (
                                <p className="text-center text-sm text-green-600">¡Gracias! Recibimos tu mensaje.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
