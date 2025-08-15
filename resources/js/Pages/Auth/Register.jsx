import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrarse" />

            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-center">
                    <h1 className="text-lg font-semibold text-orange-500">
                        Crear cuenta
                    </h1>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Nombre" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Correo electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirmar contraseña"
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <PrimaryButton
                        className="w-full justify-center bg-orange-600 hover:bg-orange-500 focus:ring-orange-500"
                        disabled={processing}
                    >
                        Crear cuenta
                    </PrimaryButton>
                    <Link
                        href="/"
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-orange-600 bg-white px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Volver
                    </Link>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        href={route('login')}
                        className="font-semibold text-orange-600 hover:text-orange-700"
                    >
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}

