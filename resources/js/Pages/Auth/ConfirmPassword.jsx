import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar contraseña" />

            <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-sm ring-1 ring-orange-100">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-900">
                        Confirmar contraseña
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
                    Esta es un área segura de la aplicación. Por favor, confirmá tu
                    contraseña para continuar.
                </div>

                <form onSubmit={submit}>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Contraseña" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-4 flex items-center justify-end">
                        <PrimaryButton
                            className="ms-4 bg-orange-600 hover:bg-orange-500 focus:ring-orange-500"
                            disabled={processing}
                        >
                            Confirmar
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
