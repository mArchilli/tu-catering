import { Link, usePage } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

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

    // NUEVO: textos rotativos para overlay del carrusel
    const eventCaptions = [
        'Sabores que elevan tus momentos especiales',
        'Catering profesional para eventos corporativos y sociales',
        'Presentaciones cuidadas, calidad e higiene garantizadas',
        'Experiencias gastronómicas que crean recuerdos',
        'Variedad, puntualidad y servicio integral para tu evento',
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
            // console.warn(`Evento: intento ${attempt + 1} para ${filename} -> ${next}`);
            img.src = next;
            img.onerror = (ev) => handleEventImgError(ev, filename);
        } else {
            // console.error(`No se encontró la imagen de evento: ${filename}`);
            img.src = eventPlaceholder;
            img.alt = 'Imagen no disponible';
        }
    };

    // (Opcional) fetch HEAD para diagnosticar rutas iniciales
    useEffect(() => {
        // eventImages.forEach((fn) => {
        //     const url = `/images/events/${fn}`;
        //     fetch(url, { method: 'HEAD' })
        //         .then((res) => console.log(`HEAD ${url} → ${res.status}`))
        //         .catch(() => console.warn(`HEAD fallo ${url}`));
        // });
    }, []);

    // Refs para scroll controlado
    const instRef = useRef(null);
    const instMarqueeRef = useRef(null);
    const instMarqueeTrackRef = useRef(null);
    
    // Pausar/reanudar marquee en touch (mobile)
    const pauseMarquee = () => { pausedRef.current = true; };
    const resumeMarquee = () => { pausedRef.current = false; };

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
    const imagesForCarousel = eventImages.map((filename, i) => ({
        src: `/images/events/${filename}`,
        alt: `Evento ${i + 1}`,
        caption: eventCaptions[i % eventCaptions.length],
        original: filename,
    }));

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    // Autoplay + barra progreso
    useEffect(() => {
        if (!isPlaying || isHovered || imagesForCarousel.length <= 1) {
            setProgress(0);
            return;
        }
        const intervalMs = 50;
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setCurrentIndex(prevIdx => (prevIdx + 1) % imagesForCarousel.length);
                    return 0;
                }
                return prev + 100 / (4000 / intervalMs); // 4000ms default (igual que interval de v0)
            });
        }, intervalMs);
        return () => clearInterval(progressInterval);
    }, [isPlaying, isHovered, imagesForCarousel.length, currentIndex]);

    const goToPrevious = () => {
        setCurrentIndex(prev => (prev - 1 + imagesForCarousel.length) % imagesForCarousel.length);
        setProgress(0);
    };
    const goToNext = () => {
        setCurrentIndex(prev => (prev + 1) % imagesForCarousel.length);
        setProgress(0);
    };
    const goToSlide = (idx) => {
        setCurrentIndex(idx);
        setProgress(0);
    };
    const togglePlayPause = () => {
        setIsPlaying(p => !p);
        setProgress(0);
    };

    // Soporte swipe táctil
    const touchStartXRef = useRef(null);
    const touchDeltaXRef = useRef(0);
    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
        touchDeltaXRef.current = 0;
        setIsHovered(true); // pausa progreso mientras se toca
    };
    const handleTouchMove = (e) => {
        if (touchStartXRef.current == null) return;
        touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current;
    };
    const handleTouchEnd = () => {
        const delta = touchDeltaXRef.current;
        const threshold = 40;
        if (delta > threshold) {
            goToPrevious();
        } else if (delta < -threshold) {
            goToNext();
        }
        touchStartXRef.current = null;
        touchDeltaXRef.current = 0;
        setIsHovered(false);
    };

    // Loop infinito JS para marquee instituciones (mobile)
    const offsetRef = useRef(0);
    const pausedRef = useRef(false);
    useEffect(() => {
        const track = instMarqueeTrackRef.current;
        if (!track) return;
        let frameId;
        let lastTime;
        const baseWidth = () => track.scrollWidth / 2; // mitad (lista original)
        const speed = 40; // px/seg (ajustable)

        const step = (ts) => {
            if (!lastTime) lastTime = ts;
            const dt = (ts - lastTime) / 1000;
            lastTime = ts;
            if (!pausedRef.current) {
                offsetRef.current -= speed * dt;
                const limit = -baseWidth();
                if (offsetRef.current <= limit) {
                    offsetRef.current -= limit; // reposicionar sin salto visible
                }
                track.style.transform = `translateX(${offsetRef.current}px)`;
            }
            frameId = requestAnimationFrame(step);
        };
        frameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameId);
    }, [institutions.length]);

    return (
        <section id='instituciones' ref={instRef} className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center" data-aos="fade-up" data-aos-delay="400">
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
                    /* Se elimina animación CSS previa; ahora controlado por JS */
                    .marquee-wrap { overflow: hidden; }
                    .marquee-track {
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                        will-change: transform;
                    }
                    @media (min-width: 768px) {
                        .events-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                        .events-scrollbar::-webkit-scrollbar { display: none; }
                    }
                    `}
                </style>

                {/* --- Sección REEMPLAZADA: Instituciones que confían en nosotros --- */}
                <div className="mt-10" data-aos="fade-up" data-aos-delay="400" >
                    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-6 sm:p-8 shadow-md">
                        
                        <h3 className="hidden text-center text-2xl font-semibold text-orange-800">Instituciones</h3>
                            
                        <div className="mt-0">
                            
                            <div className="mt-6">
                    
                                <div
                                    ref={instMarqueeRef}
                                    className="marquee-wrap md:hidden"
                                    onTouchStart={pauseMarquee}
                                    onTouchEnd={resumeMarquee}
                                    onMouseEnter={pauseMarquee}
                                    onMouseLeave={resumeMarquee}
                                    role="list"
                                >
                                    <div
                                        ref={instMarqueeTrackRef}
                                        className="marquee-track"
                                        style={{ transform: 'translateX(0)' }} // será actualizado por JS
                                    >
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

                <div className="mx-auto max-w-3xl text-center" data-aos="fade-up" data-aos-delay="400">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                        También llevamos nuestra experiencia a tus eventos
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Ofrecemos soluciones gastronómicas para bodas, cumpleaños, XV, reuniones familiares y empresariales, con la misma calidad y cuidado que en nuestros servicios institucionales.
                    </p>
                </div>
                    
                        <div className="md:flex md:items-center md:justify-between md:gap-6 mt-10" data-aos="fade-up" data-aos-delay="400">

                            {/* Carrusel nuevo */}
                            <div className="mt-6 md:mt-0 md:flex-1 ">
                                <div
                                    className="relative w-full group"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    {/* Full width dentro del contenedor principal (si quieres full-bleed usar: -mx-6 lg:-mx-8) */}
                                    <div className="relative h-72 sm:h-80 md:h-[28rem] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600">
                                        <div className="relative h-full">
                                            {imagesForCarousel.map((img, index) => (
                                                <div
                                                    key={img.src + index}
                                                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                                                        index === currentIndex
                                                            ? 'opacity-100 scale-100 z-10'
                                                            : index === (currentIndex - 1 + imagesForCarousel.length) % imagesForCarousel.length
                                                                ? 'opacity-0 scale-110 -translate-x-full z-0'
                                                                : index === (currentIndex + 1) % imagesForCarousel.length
                                                                    ? 'opacity-0 scale-110 translate-x-full z-0'
                                                                    : 'opacity-0 scale-95 z-0'
                                                    }`}
                                                >
                                                    <img
                                                        src={img.src}
                                                        alt={img.alt}
                                                        className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                                        loading="lazy"
                                                        data-attempt="0"
                                                        onError={(e) => handleEventImgError(e, img.original)}
                                                    />
                                                    {/* Overlays */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-transparent" />
                                                    {img.caption && (
                                                        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8">
                                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 shadow-2xl">
                                                                <p className="text-white font-medium text-sm sm:text-sm md:text-lg leading-relaxed">
                                                                    {img.caption}
                                                                </p>
                                                                {/* <div className="mt-4">
                                                                    <a
                                                                        href="#contacto"
                                                                        onClick={scrollToContact}
                                                                        className="inline-flex items-center rounded-full bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 shadow transition"
                                                                    >
                                                                        Solicitar presupuesto
                                                                    </a>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {imagesForCarousel.length > 1 && (
                                            <>
                                                <button
                                                    onClick={goToPrevious}
                                                    aria-label="Imagen anterior"
                                                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/30"
                                                >
                                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                                <button
                                                    onClick={goToNext}
                                                    aria-label="Imagen siguiente"
                                                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-white/30"
                                                >
                                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                                </button>
                                            </>
                                        )}

                                        <div className="absolute top-3 right-3 flex items-center space-x-2">
                                            <button
                                                onClick={togglePlayPause}
                                                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                                                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-white/30"
                                            >
                                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </button>
                                            <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 shadow-lg border border-white/30">
                                                <span className="text-white text-xs font-bold">
                                                    {currentIndex + 1} / {imagesForCarousel.length}
                                                </span>
                                            </div>
                                        </div>

                                        {isPlaying && !isHovered && imagesForCarousel.length > 1 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-75 ease-linear shadow-lg shadow-orange-500/50"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {imagesForCarousel.length > 1 && (
                                        <div className="flex justify-center mt-6 space-x-3">
                                            {imagesForCarousel.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => goToSlide(idx)}
                                                    aria-label={`Ir a imagen ${idx + 1}`}
                                                    className={`relative transition-all duration-300 hover:scale-125 ${
                                                        idx === currentIndex
                                                            ? 'w-8 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-500/40'
                                                            : 'w-3 h-3 bg-gray-300 hover:bg-orange-300 rounded-full'
                                                    }`}
                                                >
                                                    {idx === currentIndex && (
                                                        <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    
                </div>

            </div>
        </section>
    );
}

