import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de email" />

            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Verificación de email
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
                    Gracias por registrarte. Antes de comenzar, por favor verificá tu dirección de correo haciendo clic en el enlace que te enviamos por email. Si no recibiste el correo, con gusto te enviaremos otro.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        Enviamos un nuevo enlace de verificación al correo que indicaste durante el registro.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex items-center justify-between">
                        <PrimaryButton
                            disabled={processing}
                            className="bg-orange-600 hover:bg-orange-500 focus:ring-orange-500"
                        >
                            Reenviar correo de verificación
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-md text-sm text-orange-600 underline hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            Cerrar sesión
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
            