import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { AddCircle } from '@mui/icons-material';
import { Chip, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, processing, errors, recentlySuccessful } =
        useForm({
            nom: user.nom || '',
            prenoms: user.prenoms || '',
            email: user.email,
            phones:
                user.type != 'admin'
                    ? JSON.parse(JSON.parse(user.phones)) || []
                    : null,
            phones_remove: [], // To track numbers to remove
        });

    const [newPhone, setNewPhone] = useState('');

    const submit = (e) => {
        e.preventDefault();
        // Send the numbers to remove with the form data
        patch(route('profile.update'), {
            onSuccess: () => {},
        });
    };

    const addPhone = () => {
        if (newPhone) {
            setData('phones', [...data.phones, newPhone]);
            setNewPhone('');
        }
    };

    const removePhone = (phoneToRemove) => {
        setData((prevData) => {
            const updatedPhones = prevData.phones.filter(
                (phone) => phone !== phoneToRemove,
            );

            return {
                ...prevData,
                phones: updatedPhones,
                phones_remove: [...prevData.phones_remove, phoneToRemove], // Track the phone number to be removed
            };
        });

        console.log(data, phoneToRemove);
    };

    return (
        <section className={className}>
            <header>
                <Typography variant="h6" gutterBottom>
                    Informations du Profil
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Mettez à jour les informations de votre compte et votre
                    adresse e-mail.
                </Typography>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <TextField
                        id="nom"
                        label="Nom"
                        variant="outlined"
                        fullWidth
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        required
                        error={!!errors.nom}
                        helperText={errors.nom}
                    />
                </div>

                {/* <div>
                    <TextField
                        id="prenoms"
                        label="Prénoms"
                        variant="outlined"
                        fullWidth
                        value={data.prenoms}
                        onChange={(e) => setData('prenoms', e.target.value)}
                        required
                        error={!!errors.prenoms}
                        helperText={errors.prenoms}
                    />
                </div> */}

                <div>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </div>

                {user.type != 'admin' && (
                    <div>
                        <div className="flex items-center gap-2">
                            <TextField
                                label={'Numéros de téléphone'}
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="Ajouter un numéro de téléphone"
                                className="flex-grow"
                            />
                            <IconButton
                                onClick={addPhone}
                                color="primary"
                                aria-label="Ajouter un numéro de téléphone"
                            >
                                <AddCircle />
                            </IconButton>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {data.phones.map((phone, index) => (
                                <Chip
                                    key={index}
                                    label={phone}
                                    onDelete={() => removePhone(phone)}
                                    className="bg-blue-100 text-blue-800"
                                />
                            ))}
                        </div>
                        {errors.phones && (
                            <InputError
                                message={errors.phones.join(', ')}
                                className="mt-2"
                            />
                        )}
                    </div>
                )}

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Votre adresse e-mail n'est pas vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Cliquez ici pour renvoyer l'e-mail de
                                vérification.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Un nouveau lien de vérification a été envoyé à
                                votre adresse e-mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} type="submit">
                        Sauvegarder
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Sauvegardé.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
