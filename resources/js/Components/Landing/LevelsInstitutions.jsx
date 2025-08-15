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

    const institutions = ['Juan XXIII', 'Colegio Buenos Aires', 'Santísimo Redentor'];

    return (
        <section id="alcance" className="bg-white">
            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                {user && dashboardHref && (
                    <div className="mb-6 flex justify-end">
                        <Link
                            href={dashboardHref}
                            className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            Ir al panel
                        </Link>
                    </div>
                )}
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Niveles e instituciones</h2>
                    <p className="mt-3 text-base text-gray-600">
                        Trabajamos junto a instituciones educativas ofreciendo menús adaptados a cada nivel.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {levels.map((l) => (
                        <div key={l.title} className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm">
                            <div className="mb-3 inline-flex rounded-full bg-orange-100 p-2 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 7l8-4 8 4-8 4-8-4z" />
                                    <path d="M12 11l8-4v6c0 3.866-3.582 7-8 7s-8-3.134-8-7V7l8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">{l.title}</h3>
                            <p className="mt-2 text-sm text-gray-600">{l.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <h3 className="text-center text-base font-semibold text-gray-900">Instituciones con las que trabajamos</h3>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {institutions.map((name) => (
                            <div
                                key={name}
                                className="flex items-center justify-center rounded-lg border border-orange-100 bg-orange-50 px-4 py-6 text-sm font-medium text-orange-700"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
