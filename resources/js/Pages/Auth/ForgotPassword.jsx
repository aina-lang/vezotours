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
            <Head title="Mot de Passe Oublié" />

            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                        Mot de Passe Oublié
                    </h2>

                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Vous avez oublié votre mot de passe ? Pas de problème. Indiquez-nous simplement votre adresse email et nous vous enverrons un lien de réinitialisation de mot de passe qui vous permettra de choisir un nouveau mot de passe.
                    </p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                placeholder="Votre adresse email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <PrimaryButton className="w-full" disabled={processing} type="submit">
                                Envoyer le Lien de Réinitialisation du Mot de Passe
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
