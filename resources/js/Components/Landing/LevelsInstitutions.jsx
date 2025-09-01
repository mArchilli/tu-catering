import { Link, usePage } from '@inertiajs/react';
import { useRef, useEffect } from 'react';

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
    const institutions = [
        { name: 'Juan XXIII', img: '/images/logos/juan-xxiii.png' },
        { name: 'Colegio Buenos Aires', img: '/images/logos/colegio-buenos-aires.png' },
        { name: 'Santísimo Redentor', img: '/images/logos/santisimo-redentor.png' },
    ];

    const eventImages = [
        '/images/events/event1.jpg',
        '/images/events/event2.jpg',
        '/images/events/event3.jpg',
        '/images/events/event4.jpg',
        '/images/events/event5.jpg',
    ];

    // Refs para scroll controlado
    const instRef = useRef(null);
    const eventsRef = useRef(null);

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

    return (
        <section id="alcance" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">Niveles e instituciones</h2>
                    <p className="mt-3 text-base text-gray-600">
                        Trabajamos junto a instituciones educativas ofreciendo menús adaptados a cada nivel.
                    </p>
                </div>

                {/* CSS para ocultar scrollbar en desktop pero mantener swipe */}
                <style>
                    {`
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
                        <h3 className="text-center text-2xl font-semibold text-orange-800">
                            Instituciones que confían en nosotros
                        </h3>
                        <p className="mt-2 text-center text-sm text-gray
                        -600 max-w-2xl mx-auto">
                            Trabajamos con colegios reconocidos brindando alimentación escolar con calidad, higiene y puntualidad.
                        </p>

                        {/* Carrusel horizontal mobile-first (swipeable). Snap + versión desktop: fila única */}
                        <div className="mt-6">
                            {/* Mobile: carrusel swipeable */}
                            <div
                                ref={instRef}
                                className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                                role="list"
                            >
                                {institutions.map((inst) => (
                                    <div
                                        key={inst.name}
                                        className="snap-center flex-none w-72 rounded-xl border border-orange-200 bg-white shadow-sm p-4 flex items-center gap-4"
                                    >
                                        {inst.img ? (
                                            <img
                                                src={inst.img}
                                                alt={inst.name}
                                                className="h-14 w-14 object-contain rounded-md bg-white p-1"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 flex items-center justify-center rounded-md bg-orange-100 text-orange-800 font-semibold">
                                                {inst.name.split(' ').map(s => s[0]).join('').slice(0,3)}
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <div className="text-sm font-semibold text-orange-800">{inst.name}</div>
                                            <div className="text-xs text-gray-500">Cliente institucional</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop: una sola fila, cada card ocupa el mismo ancho y llenan todo el espacio */}
                            <div className="hidden md:flex md:gap-6">
                                {institutions.map((inst) => (
                                    <article
                                        key={inst.name}
                                        className="flex-1 min-w-0 rounded-xl border border-orange-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center text-center"
                                    >
                                        <img
                                            src={inst.img}
                                            alt={inst.name}
                                            className="h-28 w-auto object-contain mb-4"
                                            loading="lazy"
                                        />
                                        <h4 className="text-lg font-semibold text-orange-800">{inst.name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Cliente institucional</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Nueva Sección: Eventos sociales y particulares --- */}
                <div className="mt-12">
                    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-b from-orange-50 to-white p-6 sm:p-8 shadow-md">
                        <div className="md:flex md:items-center md:justify-between md:gap-6">
                            <div className="max-w-xl">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    Ahora también llevamos nuestra experiencia a tus eventos
                                </h3>
                                <p className="mt-3 text-sm text-gray-600">
                                    Ofrecemos soluciones gastronómicas para bodas, cumpleaños, XV, reuniones familiares y empresariales, con la misma calidad y cuidado que en nuestros servicios institucionales.
                                </p>

                                <div className="mt-6 flex gap-3">
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
                                        className="events-scrollbar flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory"
                                    >
                                        {eventImages.map((src, i) => (
                                            <div
                                                key={i}
                                                className="snap-center flex-none w-full rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`evento-${i}`}
                                                    className="h-44 w-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Flechas de navegación: siempre visibles, superpuestas */}
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-2 z-10">
                                        <button
                                            onClick={() => scrollContainerBy(eventsRef, -1)}
                                            aria-label="Anterior evento"
                                            className="h-10 w-10 rounded-full bg-white/95 border border-orange-200 text-orange-700 shadow-sm hover:bg-white focus:outline-none"
                                        >
                                            ‹
                                        </button>
                                    </div>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 z-10">
                                        <button
                                            onClick={() => scrollContainerBy(eventsRef, 1)}
                                            aria-label="Siguiente evento"
                                            className="h-10 w-10 rounded-full bg-white/95 border border-orange-200 text-orange-700 shadow-sm hover:bg-white focus:outline-none"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
