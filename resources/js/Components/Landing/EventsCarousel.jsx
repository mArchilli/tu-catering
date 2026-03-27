import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const eventImages = ['event1.jpg', 'event2.jpg', 'event3.jpg', 'event4.jpg', 'event5.jpg'];

const eventCaptions = [
    'Sabores que elevan tus momentos especiales',
    'Catering profesional para eventos corporativos y sociales',
    'Presentaciones cuidadas, calidad e higiene garantizadas',
    'Experiencias gastronómicas que crean recuerdos',
    'Variedad, puntualidad y servicio integral para tu evento',
];

const eventPlaceholder = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#FFF7ED"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FB923C" font-family="Arial,Helvetica,sans-serif" font-size="20">Imagen no disponible</text></svg>`
)}`;

const imagesForCarousel = eventImages.map((filename, i) => ({
    src: `/images/events/${filename}`,
    alt: `Evento ${i + 1}`,
    caption: eventCaptions[i % eventCaptions.length],
    original: filename,
}));

export default function EventsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const handleEventImgError = (e, filename) => {
        const img = e.currentTarget;
        img.onerror = null;
        const attempt = Number(img.dataset.attempt || 0);
        const fallbacks = [
            `/images/events/${filename}`,
            `/images/${filename}`,
            `/events/${filename}`,
        ];
        if (attempt < fallbacks.length) {
            img.dataset.attempt = attempt + 1;
            img.src = fallbacks[attempt];
            img.onerror = (ev) => handleEventImgError(ev, filename);
        } else {
            img.src = eventPlaceholder;
            img.alt = 'Imagen no disponible';
        }
    };

    // Autoplay + barra de progreso
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
                return prev + 100 / (4000 / intervalMs);
            });
        }, intervalMs);
        return () => clearInterval(progressInterval);
    }, [isPlaying, isHovered, currentIndex]);

    const goToPrevious = () => { setCurrentIndex(prev => (prev - 1 + imagesForCarousel.length) % imagesForCarousel.length); setProgress(0); };
    const goToNext    = () => { setCurrentIndex(prev => (prev + 1) % imagesForCarousel.length); setProgress(0); };
    const goToSlide   = (idx) => { setCurrentIndex(idx); setProgress(0); };
    const togglePlayPause = () => { setIsPlaying(p => !p); setProgress(0); };

    // Soporte swipe táctil
    const touchStartXRef = useRef(null);
    const touchDeltaXRef = useRef(0);
    const handleTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; touchDeltaXRef.current = 0; setIsHovered(true); };
    const handleTouchMove  = (e) => { if (touchStartXRef.current == null) return; touchDeltaXRef.current = e.touches[0].clientX - touchStartXRef.current; };
    const handleTouchEnd   = () => {
        const delta = touchDeltaXRef.current;
        if (delta > 40) goToPrevious();
        else if (delta < -40) goToNext();
        touchStartXRef.current = null;
        touchDeltaXRef.current = 0;
        setIsHovered(false);
    };

    return (
        <section id="eventos" className="bg-white h-screen flex flex-col justify-center">
            <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 w-full">
                <div className="mx-auto max-w-3xl text-center" data-aos="fade-up" data-aos-delay="400">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
                        También llevamos nuestra experiencia a tus eventos
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                        Ofrecemos soluciones gastronómicas para bodas, cumpleaños, XV, reuniones familiares y empresariales,
                        con la misma calidad y cuidado que en nuestros servicios institucionales.
                    </p>
                </div>

                <div className="mt-10" data-aos="fade-up" data-aos-delay="400">
                    <div
                        className="relative w-full group"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="relative h-72 sm:h-80 md:h-[32rem] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600">
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-transparent" />
                                        {img.caption && (
                                            <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8">
                                                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 shadow-2xl">
                                                    <p className="text-white font-medium text-sm sm:text-sm md:text-lg leading-relaxed">
                                                        {img.caption}
                                                    </p>
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
        </section>
    );
}
