import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar sesión" />

            {status && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <div className="mx-auto w-full max-w-md">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Iniciar sesión</h1>
                    <p className="mt-1 text-sm text-gray-600">Accedé a tu cuenta para gestionar tus pedidos.</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Correo electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full border-orange-200 transition focus:border-orange-500 focus:ring-orange-500 hover:border-orange-300"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full border-orange-200 transition focus:border-orange-500 focus:ring-orange-500 hover:border-orange-300"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                Recordarme
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-orange-600 underline hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <PrimaryButton className="w-full justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0" disabled={processing}>Ingresar</PrimaryButton>
                    <Link
                        href="/"
                        className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-orange-600 bg-white px-4 py-2.5 text-sm font-semibold text-orange-600 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Volver
                    </Link>
                </form>

        <p className="mt-6 text-center text-sm text-gray-600">
                    ¿No tenés cuenta?{' '}
                    <Link
                        href={route('register')}
            className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                        Registrate
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
