import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status, auth }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout auth={auth}>
            <Head title="Vérification de l'email" />

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                    <div className="mb-6 text-center text-gray-600 dark:text-gray-400">
                        <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
                            Vérification de l'email
                        </h2>
                        <p className="text-sm">
                            Merci de vous être inscrit ! Avant de commencer,
                            pourriez-vous vérifier votre adresse e-mail en
                            cliquant sur le lien que nous venons de vous envoyer
                            ? Si vous n'avez pas reçu l'e-mail, nous serons
                            heureux de vous en envoyer un autre.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                            Un nouveau lien de vérification a été envoyé à
                            l'adresse e-mail que vous avez fournie lors de
                            l'inscription.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <PrimaryButton
                            disabled={processing}
                            type="submit"
                            className="w-full"
                        >
                            Renvoyer l'e-mail de vérification
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="mt-4 w-full text-center text-sm font-medium text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Se déconnecter
                        </Link>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
