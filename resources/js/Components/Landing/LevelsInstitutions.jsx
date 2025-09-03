import { Link, usePage } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';

export default function LevelsInstitutions() {
    const user = usePage().props.auth?.user;

    const dashboardHref = (() => {
        if (!user) return null;
        const role = (user.role || '').toLowerCase();
        if (typeof route === 'function') {
            if (route().has('dashboard.padre') && ['padre', 'parent', 'tutor'].includes(role)) {
                return route('dashboard.padre');
            }
            if (route().has('dashboard')) {
                return route('dashboard');
            }
        }
        return '/dashboard';
    })();

    // Nuevos activos: logos de instituciones y fotos de eventos
    // Archivos ubicados en public/images -> rutas públicas: /images/<archivo>
    const institutions = [
        { name: 'Juan XXIII', img: '/images/juan-xxiii.png' },
        { name: 'Colegio Buenos Aires', img: '/images/colegio-buenos-aires.png' },
        { name: 'Santísimo Redentor', img: '/images/santisimo-redentor.png' },
    ];

    // Usamos sólo nombres de archivo; construimos rutas y probamos fallbacks si no aparecen
    const eventImages = [
        'event1.jpg',
        'event2.jpg',
        'event3.jpg',
        'event4.jpg',
        'event5.jpg',
    ];

    // placeholder simple para eventos
    const eventPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#FFF7ED"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FB923C" font-family="Arial,Helvetica,sans-serif" font-size="20">Imagen no disponible</text></svg>`
    )}`;

    // Handler para errores de imagen de eventos: prueba rutas alternativas y finalmente placeholder
    const handleEventImgError = (e, filename) => {
        const img = e.currentTarget;
        img.onerror = null;
        const attempt = Number(img.dataset.attempt || 0);
        const fallbacks = [
            `/images/events/${filename}`, // preferido (public/images/events/)
            `/images/${filename}`,        // si las pusiste en public/images
            `/events/${filename}`,        // opción alternativa
        ];
        if (attempt < fallbacks.length) {
            const next = fallbacks[attempt];
            img.dataset.attempt = attempt + 1;
            console.warn(`Evento: intento ${attempt + 1} para ${filename} -> ${next}`);
            img.src = next;
            img.onerror = (ev) => handleEventImgError(ev, filename);
        } else {
            console.error(`No se encontró la imagen de evento: ${filename}`);
            img.src = eventPlaceholder;
            img.alt = 'Imagen no disponible';
        }
    };

    // (Opcional) fetch HEAD para diagnosticar rutas iniciales
    useEffect(() => {
        eventImages.forEach((fn) => {
            const url = `/images/events/${fn}`;
            fetch(url, { method: 'HEAD' })
                .then((res) => console.log(`HEAD ${url} → ${res.status}`))
                .catch(() => console.warn(`HEAD fallo ${url}`));
        });
    }, []);

    // Refs para scroll controlado
    const instRef = useRef(null);
    const instMarqueeRef = useRef(null);
    const eventsRef = useRef(null);
    
    // Pausar/reanudar marquee en touch (mobile)
    const pauseMarquee = () => {
        const track = instMarqueeRef.current?.querySelector('.marquee-track');
        if (track) track.style.animationPlayState = 'paused';
    };
    const resumeMarquee = () => {
        const track = instMarqueeRef.current?.querySelector('.marquee-track');
        if (track) track.style.animationPlayState = 'running';
    };

    const scrollContainerBy = (ref, direction = 1) => {
        const el = ref.current;
        if (!el) return;
        const amount = el.clientWidth || el.scrollWidth / 3;
        el.scrollBy({ left: direction * amount, behavior: 'smooth' });
    };

    useEffect(() => {
        // Opcional: ocultar scrollbars en WebKit pero mantener funcionalidad de swipe
    }, []);

    // Agregar función para scrollear a contacto
    const scrollToContact = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const el = document.getElementById('contacto') || document.querySelector('section#contacto, #contacto');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (typeof el.focus === 'function') el.focus();
        } else {
            // Fallback: navegar a la página de contacto si no hay ancla en la página actual
            if (typeof route === 'function' && route().has && route().has('contacto')) {
                window.location.href = route('contacto');
            } else {
                window.location.href = '/contacto';
            }
        }
    };

    // --- NUEVO: estado y refs para carrusel de eventos ---
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const lastUserInteractionRef = useRef(Date.now());

    // Actualiza índice cuando el usuario hace scroll manual
    const handleEventsScroll = () => {
        const el = eventsRef.current;
        if (!el) return;
        const width = el.clientWidth;
        if (width <= 0) return;
        const idx = Math.round(el.scrollLeft / width);
        setCurrentEventIndex(idx);
        lastUserInteractionRef.current = Date.now();
    };

    // Salto directo a un slide concreto
    const jumpTo = (idx) => {
        const el = eventsRef.current;
        if (!el) return;
        const width = el.clientWidth;
        el.scrollTo({ left: idx * width, behavior: 'smooth' });
        setCurrentEventIndex(idx);
        lastUserInteractionRef.current = Date.now();
    };

    // Autoplay (pausa 3s tras interacción del usuario)
    useEffect(() => {
        const el = eventsRef.current;
        if (!el) return;
        const interval = setInterval(() => {
            if (Date.now() - lastUserInteractionRef.current < 3000) return; // pausa por interacción reciente
            const total = eventImages.length;
            const next = (currentEventIndex + 1) % total;
            const width = el.clientWidth;
            el.scrollTo({ left: next * width, behavior: 'smooth' });
            setCurrentEventIndex(next);
        }, 4500);
        return () => clearInterval(interval);
    }, [currentEventIndex, eventImages.length]);

    // Ajustar índice si cambia el tamaño (responsive)
    useEffect(() => {
        const onResize = () => {
            const el = eventsRef.current;
            if (!el) return;
            const width = el.clientWidth;
            el.scrollTo({ left: currentEventIndex * width });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [currentEventIndex]);

    return (
        <section id="alcance" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                        Instituciones que confían en nosotros
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Trabajamos con colegios reconocidos brindando alimentación escolar con calidad, higiene y puntualidad.
                    </p>
                </div>

                {/* CSS para ocultar scrollbar en desktop pero mantener swipe */}
                <style>
                    {`
                    /* Marquee móvil: scroll suave de derecha a izquierda */
                    .marquee-wrap { overflow: hidden; }
                    .marquee-track { display: flex; gap: 1rem; align-items: center; }
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    /* velocidad moderada: 20s. Ajustar si querés más lento/rápido */
                    .marquee-track { animation: marqueeScroll 5s linear infinite; }
                    .marquee-wrap:hover .marquee-track,
                    .marquee-wrap:active .marquee-track { animation-play-state: paused; }


                    @media (min-width: 768px) {
                        .events-scrollbar {
                            -ms-overflow-style: none;  /* IE 10+ */
                            scrollbar-width: none;     /* Firefox */
                        }
                        .events-scrollbar::-webkit-scrollbar {
                            display: none;             /* WebKit */
                        }
                    }
                    `}
                </style>

                {/* --- Sección REEMPLAZADA: Instituciones que confían en nosotros --- */}
                <div className="mt-10">
                    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-6 sm:p-8 shadow-md">
                        {/* Título y párrafo internos removidos (ya están arriba) */}
                        {/* <h3 className="text-center text-2xl font-semibold text-orange-800">...</h3>
                            <p className="mt-2 text-center text-sm text-gray-600 max-w-2xl mx-auto">...</p> */}
                        <div className="mt-0">
                            {/* Carrusel horizontal mobile-first (swipeable). Snap + versión desktop: fila única */}
                            <div className="mt-6">
                                {/* Mobile: marquee infinito (duplicamos items para efecto continuo).
                                    Pausa al hover o touch. */}
                                <div
                                    ref={instMarqueeRef}
                                    className="marquee-wrap md:hidden"
                                    onTouchStart={pauseMarquee}
                                    onTouchEnd={resumeMarquee}
                                    onMouseEnter={pauseMarquee}
                                    onMouseLeave={resumeMarquee}
                                    role="list"
                                >
                                    <div className="marquee-track">
                                        {[...institutions, ...institutions].map((inst, idx) => (
                                            <div
                                                key={`${inst.name}-${idx}`}
                                                className="flex-none w-72 rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 shadow-[0_3px_10px_-2px_rgba(249,115,22,0.25)] ring-1 ring-orange-100 flex items-center gap-4 hover:shadow-[0_6px_16px_-3px_rgba(249,115,22,0.35)] transition"
                                            >
                                                {inst.img ? (
                                                    <img
                                                        src={inst.img}
                                                        alt={inst.name}
                                                        className="h-14 w-14 object-contain rounded-xl bg-white/90 p-1 ring-1 ring-orange-100 shadow-sm"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-semibold ring-1 ring-orange-200">
                                                        {inst.name.split(' ').map(s => s[0]).join('').slice(0,3)}
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <div className="text-sm font-semibold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                                        {inst.name}
                                                    </div>
                                                    <div className="mt-1 h-1 w-8 rounded-full bg-gradient-to-r from-orange-400 to-amber-300"></div>
                                                    <div className="text-[11px] text-gray-500 mt-2 tracking-wide uppercase">Cliente institucional</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Desktop: una sola fila, cada card ocupa el mismo ancho y llenan todo el espacio */}
                                <div className="hidden md:flex md:gap-6">
                                    {institutions.map((inst) => (
                                        <article
                                            key={inst.name}
                                            className="group flex-1 min-w-0 rounded-2xl bg-white/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center shadow-[0_6px_18px_-5px_rgba(249,115,22,0.30)] ring-1 ring-orange-100 hover:shadow-[0_10px_28px_-6px_rgba(249,115,22,0.45)] hover:ring-orange-200 transition"
                                        >
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-200 via-transparent to-transparent blur-md opacity-60 group-hover:opacity-90 transition"></div>
                                                <img
                                                    src={inst.img}
                                                    alt={inst.name}
                                                    className="relative h-24 w-auto object-contain mb-2 drop-shadow-sm"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <h4 className="text-lg font-semibold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                                                {inst.name}
                                            </h4>
                                            <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-300"></div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Nueva Sección: Eventos sociales y particulares --- */}
                <div className="mt-12">
                    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-b from-orange-50 to-white p-6 sm:p-8 shadow-md">
                        <div className="md:flex md:items-center md:justify-between md:gap-6">
                            <div className="max-w-xl">
                                <h3 className="text-2xl text-center md:text-left font-semibold text-gray-900">
                                    Ahora también llevamos nuestra experiencia a tus eventos
                                </h3>
                                <p className="mt-3 text-sm text-gray-600">
                                    Ofrecemos soluciones gastronómicas para bodas, cumpleaños, XV, reuniones familiares y empresariales, con la misma calidad y cuidado que en nuestros servicios institucionales.
                                </p>

                                <div className="hidden md:flex mt-6 gap-3">
                                    {/* botón que scrollea a la sección de contacto */}
                                    <a
                                        href="#contacto"
                                        onClick={scrollToContact}
                                        className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
                                    >
                                        Solicitar presupuesto
                                    </a>
                                    {/* "Ver servicios" eliminado */}
                                </div>
                            </div>

                            {/* Carrusel de eventos */}
                            <div className="mt-6 md:mt-0 md:flex-1">
                                <div className="relative">
                                    {/* contenedor swipeable: cada slide ocupa todo el ancho visible (1 por vista).
                                        Se añade la clase events-scrollbar para ocultar la barra en desktop */}
                                    <div
                                        ref={eventsRef}
                                        className="events-scrollbar flex gap-4 overflow-x-hidden pb-3 snap-x snap-mandatory h-64 md:h-80"
                                        onScroll={handleEventsScroll} // <-- NUEVO
                                    >
                                        {eventImages.map((filename, i) => (
                                            <div
                                                key={i}
                                                className="snap-center flex-none w-full h-full rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={`/images/events/${filename}`}
                                                    alt={`evento-${i}`}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                    data-attempt="0"
                                                    onError={(e) => handleEventImgError(e, filename)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Flechas de navegación: siempre visibles, superpuestas */}
                                    <div className="hidden absolute left-2 top-1/2 -translate-y-1/2  gap-2 z-10">
                                        <button
                                            onClick={() => scrollContainerBy(eventsRef, -1)}
                                            aria-label="Anterior evento"
                                            className="h-10 w-10 rounded-full bg-white/95 border border-orange-200 text-orange-700 shadow-sm hover:bg-white focus:outline-none"
                                        >
                                            ‹
                                        </button>
                                    </div>
                                    <div className="hidden absolute right-2 top-1/2 -translate-y-1/2 gap-2 z-10">
                                        <button
                                            onClick={() => scrollContainerBy(eventsRef, 1)}
                                            aria-label="Siguiente evento"
                                            className="h-10 w-10 rounded-full bg-white/95 border border-orange-200 text-orange-700 shadow-sm hover:bg-white focus:outline-none"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>

                                {/* --- NUEVO: Barra de progreso segmentada debajo del carrusel --- */}
                                <div className="mt-4 flex justify-center">
                                    <div className="flex w-full max-w-xs gap-1 px-4">
                                        {eventImages.map((_, i) => {
                                            const active = i === currentEventIndex;
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    aria-label={`Ir a imagen ${i + 1}`}
                                                    onClick={() => jumpTo(i)}
                                                    className={
                                                        `flex-1 h-1.5 rounded-full transition-all ` +
                                                        (active
                                                            ? 'bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.25)]'
                                                            : 'bg-orange-200 hover:bg-orange-300')
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex md:hidden mt-6 gap-3">
                                    {/* botón que scrollea a la sección de contacto */}
                                    <a
                                        href="#contacto"
                                        onClick={scrollToContact}
                                        className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700 transition w-full"
                                    >
                                        Solicitar presupuesto
                                    </a>
                                    {/* "Ver servicios" eliminado */}
                                </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

