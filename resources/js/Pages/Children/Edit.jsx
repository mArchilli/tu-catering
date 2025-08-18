import ParentLayout from '@/Layouts/ParentLayout';
import { useForm, Link } from '@inertiajs/react';

export default function Edit({ child, schools = [], grados = [], conditions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: child.name || '',
        lastname: child.lastname || '',
        dni: child.dni || '',
        school: child.school || '',
        grado: child.grado || '',
        condition: child.condition || '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('children.update', child.id));
    }

    return (
        <ParentLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Editar alumno</h2>
                    <Link
                        href={route('children.view', child.id)}
                        className="hidden"
                    >
                        {/* placeholder si necesitas un enlace extra */}
                    </Link>
                    <Link
                        href={route('children.index')}
                        className="inline-flex items-center rounded-md border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50"
                    >
                        Volver
                    </Link>
                </div>
            }
        >
            <div className="mx-auto w-full max-w-7xl p-6">
                <form
                    onSubmit={submit}
                    className="relative space-y-8 rounded-xl bg-white p-8 shadow-sm ring-1 ring-orange-100"
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
                        <div>
                            <h3 className="text-lg font-semibold text-orange-500">
                                Datos del alumno
                            </h3>
                            <p className="text-xs text-gray-500">
                                Actualiza los campos necesarios
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="hidden md:inline-flex items-center gap-2 rounded-md bg-orange-400 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-400 focus:ring-orange-500"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ingrese el nombre"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-400 focus:ring-orange-500"
                                    value={data.lastname}
                                    onChange={e => setData('lastname', e.target.value)}
                                    placeholder="Ingrese el apellido"
                                />
                                {errors.lastname && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.lastname}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    DNI *
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={8}
                                    placeholder="8 dígitos, sin puntos."
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm shadow-inner focus:border-orange-400 focus:ring-orange-500"
                                    value={data.dni}
                                    onChange={e => setData('dni', e.target.value.replace(/\D/g, ''))}
                                />
                                {errors.dni && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.dni}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Colegio
                                </label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-500"
                                    value={data.school}
                                    onChange={e => setData('school', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {schools.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {errors.school && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.school}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Grado
                                </label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-500"
                                    value={data.grado}
                                    onChange={e => setData('grado', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {grados.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                {errors.grado && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.grado}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Condición
                                </label>
                                <select
                                    className="mt-1 w-full rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-500"
                                    value={data.condition}
                                    onChange={e => setData('condition', e.target.value)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {conditions.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {errors.condition && (
                                    <p className="mt-1 text-xs text-orange-600">{errors.condition}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 sm:hidden">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-orange-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </ParentLayout>
    );
}
