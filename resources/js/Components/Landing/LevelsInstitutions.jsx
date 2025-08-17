import { Link, usePage } from '@inertiajs/react';

export default function LevelsInstitutions() {
    const user = usePage().props.auth?.user;

    const dashboardHref = (() => {
        if (!user) return null;
        const role = (user.role || '').toLowerCase();
        // Si existe la ruta del panel de padre y el rol coincide, usarla; si no, usar dashboard general
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

    const levels = [
        { title: 'Educación Inicial', desc: 'Acompañamos a los más chicos con menús adecuados y balanceados.' },
        { title: 'Educación Primaria', desc: 'Propuestas nutritivas para etapas de crecimiento y aprendizaje.' },
        { title: 'Educación Secundaria', desc: 'Energía y variedad para jornadas escolares demandantes.' },
    ];

    // Imágenes por nivel: inicial, primario, secundario
    const levelImages = [
        '/images/nivel-inicial.png',
        '/images/nivel-primario.png', // Nueva imagen de Primario
        '/images/nivel-secundario.png', // Nueva imagen de Secundario (colocar la adjunta en public/images/nivel-secundario.jpg)
    ];

    const institutions = ['Juan XXIII', 'Colegio Buenos Aires', 'Santísimo Redentor'];

    return (
        <section id="alcance" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">Niveles e instituciones</h2>
                    <p className="mt-3 text-base text-gray-600">
                        Trabajamos junto a instituciones educativas ofreciendo menús adaptados a cada nivel.
                    </p>
                </div>

                {/* Cards con imagen arriba y descripción abajo.
                    Mobile: una debajo de la otra (inicial, primario, secundario).
                    Desktop: lado a lado de izquierda a derecha (inicial, primario, secundario). */}
                <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:gap-8">
                    {levels.map((l, idx) => (
                        <article
                            key={l.title}
                            className="flex-1 overflow-hidden rounded-xl border-2 border-orange-300 bg-gradient-to-b from-orange-50 to-white shadow-md transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:border-orange-400"
                        >
                            <img
                                src={levelImages[idx]}
                                alt={`${l.title} - ilustración`}
                                className="h-56 w-full object-cover sm:h-64 lg:h-72"
                                loading="lazy"
                            />
                            <div className="p-5">
                                <h3 className="text-base font-semibold text-orange-800">{l.title}</h3>
                                <p className="mt-2 text-sm text-gray-700">{l.desc}</p>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12">
                    {/* Animación para marquee y pausa al hover */}
                    <style>
                        {`
                        @keyframes scrollX {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .marquee-wrap:hover .marquee-track {
                            animation-play-state: paused;
                        }
                        `}
                    </style>

                    <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-6 sm:p-8 shadow-md">
                        <h3 className="text-center text-base font-semibold text-orange-800">
                            Instituciones con las que trabajamos
                        </h3>

                        {/* Mobile: marquee infinito con pausa al hover */}
                        <div className="mt-5 md:hidden marquee-wrap overflow-hidden">
                            <div className="marquee-track flex items-center gap-3 whitespace-nowrap animate-[scrollX_20s_linear_infinite]">
                                {[...institutions, ...institutions].map((name, i) => (
                                    <div
                                        key={`${name}-${i}`}
                                        className="flex-shrink-0 inline-flex items-center rounded-full border-2 border-orange-300 bg-gradient-to-b from-orange-50 to-white px-4 py-2 text-sm font-semibold text-orange-800 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.04] hover:shadow-md hover:border-orange-400"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M3 10l9-5 9 5-9 5-9-5z" />
                                            <path d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                                        </svg>
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop: grilla con hover tipo botón */}
                        <div className="mt-6 hidden md:grid grid-cols-3 gap-4">
                            {institutions.map((name) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-center rounded-full border-2 border-orange-300 bg-gradient-to-b from-orange-50 to-white px-5 py-3 text-sm font-semibold text-orange-800 shadow-sm transition-transform duration-300 ease-out hover:scale-[1.04] hover:shadow-md hover:border-orange-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M3 10l9-5 9 5-9 5-9-5z" />
                                        <path d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                                    </svg>
                                    {name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
