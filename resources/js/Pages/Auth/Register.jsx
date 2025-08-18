import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff, Users, Award } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex" style={{ fontFamily: '"Montserrat", sans-serif' }}>
            <Head title="Registrarse" />
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            {/* Columna izquierda (form) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo en móvil */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl font-sans">TC</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 font-sans">Tu Catering</h1>
                        <p className="text-gray-600 font-serif mt-2">Crear una nueva cuenta</p>
                    </div>

                    {/* Título desktop */}
                    <div className="hidden lg:block text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 font-sans mb-2">Crear cuenta</h2>
                        <p className="text-gray-600 font-serif">Completá tus datos para empezar a usar el servicio.</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl transform hover:shadow-3xl transition-all duration-500 hover:-translate-y-1">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Nombre */}
                                <div className="group">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nombre"
                                        className="block text-sm font-medium text-gray-700 mb-2 font-serif group-focus-within:text-orange-500 transition-colors duration-300"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            required
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-orange-500 focus:bg-white font-serif transition-all duration-300 transform focus:scale-[1.02] hover:border-gray-300"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Juan Pérez"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-focus-within:from-orange-500/5 group-focus-within:to-orange-600/5 pointer-events-none transition-all duration-300"></div>
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email */}
                                <div className="group">
                                    <InputLabel
                                        htmlFor="email"
                                        value="Correo Electrónico"
                                        className="block text-sm font-medium text-gray-700 mb-2 font-serif group-focus-within:text-orange-500 transition-colors duration-300"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            required
                                            className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-orange-500 focus:bg-white font-serif transition-all duration-300 transform focus:scale-[1.02] hover:border-gray-300"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="usuario@correo.com"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-focus-within:from-orange-500/5 group-focus-within:to-orange-600/5 pointer-events-none transition-all duration-300"></div>
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password */}
                                <div className="group">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Contraseña"
                                        className="block text-sm font-medium text-gray-700 mb-2 font-serif group-focus-within:text-orange-500 transition-colors duration-300"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            required
                                            className="w-full px-4 py-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-orange-500 focus:bg-white font-serif transition-all duration-300 transform focus:scale-[1.02] hover:border-gray-300"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-110"
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-focus-within:from-orange-500/5 group-focus-within:to-orange-600/5 pointer-events-none transition-all duration-300"></div>
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Confirm Password */}
                                <div className="group">
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirmar contraseña"
                                        className="block text-sm font-medium text-gray-700 mb-2 font-serif group-focus-within:text-orange-500 transition-colors duration-300"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="password_confirmation"
                                            type={showPasswordConfirm ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            required
                                            className="w-full px-4 py-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:border-orange-500 focus:bg-white font-serif transition-all duration-300 transform focus:scale-[1.02] hover:border-gray-300"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordConfirm((v) => !v)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-all duration-300 hover:scale-110"
                                            aria-label={showPasswordConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                                        >
                                            {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-focus-within:from-orange-500/5 group-focus-within:to-orange-600/5 pointer-events-none transition-all duration-300"></div>
                                    </div>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-serif py-4 text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 border-0"
                                >
                                    Crear cuenta
                                </PrimaryButton>

                                <Link
                                    href="/"
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-orange-600 bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    Volver al sitio
                                </Link>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-center text-sm text-gray-600">
                                    ¿Ya tenés cuenta?{' '}
                                    <Link href={route('login')} className="font-semibold text-orange-600 hover:text-orange-700">
                                        Iniciá sesión
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-500 font-serif">© Tu Catering. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>

            {/* Columna derecha (hero) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-orange-500">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center mx-auto">
                    <div className="mb-8">
                        <img
                            src="/logo-hero.png"
                            alt="Tu Catering"
                            className="h-20 w-auto filter brightness-0 invert drop-shadow mx-auto mb-6"
                        />
                        <h1 className="text-5xl lg:text-6xl font-bold mb-4 font-sans">Tu Catering</h1>
                        <p className="text-xl text-orange-100 font-serif">Servicio Alimentario Escolar de Excelencia</p>
                    </div>

                    <div className="space-y-6 max-w-md mx-auto">
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:bg-white/20 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold font-sans">3 Instituciones</h3>
                                <p className="text-sm text-orange-100 font-serif">
                                    Juan XXIII, Colegio Buenos Aires, Santísimo Redentor
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:bg-white/20 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold font-sans">Experiencia Comprobada</h3>
                                <p className="text-sm text-orange-100 font-serif">Personal con años de experiencia en el rubro</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

