import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Olvidé mi contraseña" />

            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Recuperar contraseña
                    </h1>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-orange-600 shadow-sm ring-1 ring-orange-200 transition hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Volver
                    </button>
                </div>

                <div className="mb-4 text-sm text-gray-600">
                    ¿Olvidaste tu contraseña? No hay problema. Indicanos tu correo
                    electrónico y te enviaremos un enlace para restablecerla.
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />

                    <div className="mt-4 flex items-center justify-end">
                        <PrimaryButton
                            className="ms-4 bg-orange-600 hover:bg-orange-500 focus:ring-orange-500"
                            disabled={processing}
                        >
                            Enviar enlace de restablecimiento
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

