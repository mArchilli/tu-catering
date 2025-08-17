import { useEffect, useMemo, useRef, useState } from 'react';

export default function Benefits() {
    const benefits = useMemo(() => ([
        {
            title: 'Nutrición responsable',
            desc: 'Menús equilibrados, pensados por profesionales y adaptados a cada contexto.',
            icon: (
                // leaf
                <path d="M4 13c3-8 13-9 16-9 0 3-1 13-9 16-5 2-7-2-7-7z" />
            ),
        },
        {
            title: 'Higiene y seguridad',
            desc: 'Trazabilidad, controles y buenas prácticas en toda la cadena.',
            icon: (
                // shield
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            ),
        },
        {
            title: 'Calidad comprobada',
            desc: 'Procesos estandarizados y auditorías internas para mejoras continuas.',
            icon: (
                // badge/star
                <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2z" />
            ),
        },
        {
            title: 'Cercanía y soporte',
            desc: 'Acompañamiento diario a instituciones y familias con comunicación clara.',
            icon: (
                // chat bubble
                <path d="M21 12a8 8 0 1 1-3.1-6.3L21 6v6zM7 17l-4 3 1.5-5.5" />
            ),
        },
    ]), []);

    // Rotor horizontal en mobile (izquierda a derecha)
    const [index, setIndex] = useState(0);
    const prefersReduced = useRef(false);
    const viewportRef = useRef(null);
    const startXRef = useRef(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [animating, setAnimating] = useState(false);
    const goPrev = () => {
        setAnimating(true);
        setIndex((i) => (i - 1 + benefits.length) % benefits.length);
        setTimeout(() => setAnimating(false), 350);
    };
    const goNext = () => {
        setAnimating(true);
        setIndex((i) => (i + 1) % benefits.length);
        setTimeout(() => setAnimating(false), 350);
    };
    useEffect(() => {
        try {
            prefersReduced.current = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        } catch {}
        if (prefersReduced.current) return;
        const id = setInterval(() => {
            if (!isDragging) {
                goNext();
            }
        }, 4000);
        return () => clearInterval(id);
    }, [benefits.length, isDragging]);

    const onTouchStart = (e) => {
        if (prefersReduced.current) return;
        if (!e.touches || e.touches.length === 0) return;
        startXRef.current = e.touches[0].clientX;
        setIsDragging(true);
    };
    const onTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches && e.touches[0] ? e.touches[0].clientX : 0;
        setDragX(x - startXRef.current);
    };
    const onTouchEnd = () => {
        if (!isDragging) return;
        const width = viewportRef.current?.offsetWidth || 1;
        const threshold = width * 0.2;
        const dx = dragX;
        setIsDragging(false);
        setDragX(0);
        if (dx <= -threshold) {
            goNext();
        } else if (dx >= threshold) {
            goPrev();
        }
    };

    // Parámetros para el layout 3D en mobile
    const total = benefits.length;
    const vpWidth = viewportRef.current?.offsetWidth || 320;
    const offset = Math.min(160, Math.max(90, vpWidth * 0.32));
    const dragShift = dragX * 0.3; // leve seguimiento al arrastre
    const shortestDelta = (i, j, n) => {
        let d = i - j;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        return d;
    };

    return (
        <section className="relative isolate overflow-hidden bg-orange-100">
            {/* blobs decorativos y overlays como en Services */}
            <div className="pointer-events-none absolute -top-16 -left-10 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl z-0"></div>
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl z-0"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>

            <div className="relative z-20 mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl text-center lg:text-left">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">¿Por qué elegirnos?</h2>
                </div>

                {/* Rotor horizontal en mobile */}
                <div className="mt-8 lg:hidden -mx-6 overflow-x-hidden">
                    <div
                        className="relative mx-auto max-w-none overflow-hidden select-none touch-pan-y min-h-[210px] py-1"
                        ref={viewportRef}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {benefits.map((b, i) => {
                            const d = shortestDelta(i, index, total); // -2..2
                            const clamped = Math.max(-2, Math.min(2, d));
                            const isActive = d === 0;
                            const x = (clamped * offset) + dragShift;
                            const scale = isActive ? (animating && !isDragging ? 1.03 : 1) : (Math.abs(clamped) === 1 ? 0.94 : 0.9);
                            const opacity = isActive ? 1 : (Math.abs(clamped) === 1 ? 0.7 : 0);
                            const blur = isActive ? 'blur(0px)' : (Math.abs(clamped) === 1 ? 'blur(2px)' : 'blur(4px)');
                            const y = Math.abs(clamped) * 6;
                            const z = isActive ? 30 : (Math.abs(clamped) === 1 ? 20 : 5);
                            return (
                                <div
                                    key={b.title}
                                    className={`${isDragging ? '' : 'transition-[transform,opacity,filter] duration-500 ease-out'} pointer-events-none absolute left-1/2 top-0 w-full px-4`}
                                    style={{
                                        transform: `translateX(calc(-50% + ${x}px)) translateY(${y}px) scale(${scale})`,
                                        opacity,
                                        filter: blur,
                                        zIndex: z,
                                    }}
                                >
                                    <div className={`pointer-events-auto rounded-2xl p-[1.5px] bg-gradient-to-r from-orange-500 to-amber-400 ${isActive ? 'shadow-xl' : 'shadow-lg'} transition-shadow`}
                                    >
                                        <div className="rounded-2xl bg-white/90 p-6 backdrop-blur">
                                            <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-2 text-white shadow">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                    {b.icon}
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
                                            <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Indicadores */}
                    <div className="mt-4 flex justify-center gap-2">
                        {benefits.map((b, i) => (
                            <span key={b.title} className={`h-1.5 w-6 rounded-full transition-colors ${i === index ? 'bg-orange-500' : 'bg-orange-200'}`}></span>
                        ))}
                    </div>
                </div>

                {/* Vista desktop: 2 columnas */}
                <div className="mt-12 hidden lg:grid lg:grid-cols-2 gap-6">
                    {benefits.map((b) => (
                        <div key={b.title} className="rounded-2xl p-[1.5px] bg-gradient-to-r from-orange-500 to-amber-400 shadow-sm transition-transform hover:scale-[1.02]">
                            <div className="rounded-2xl bg-white p-6">
                                <div className="mb-3 inline-flex rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-2 text-white shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        {b.icon}
                                    </svg>
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">{b.title}</h3>
                                <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
