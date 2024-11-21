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
            <Head title="Confirmer le Mot de Passe" />

            <div className="w-full h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                        C'est une zone sécurisée de l'application. Veuillez confirmer
                        votre mot de passe avant de continuer.
                    </div>

                    <form onSubmit={submit}>
                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Mot de Passe" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password', e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center justify-center">
                            <PrimaryButton
                                className="px-6 py-2"
                                disabled={processing}
                                type="submit"
                            >
                                Confirmer
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
