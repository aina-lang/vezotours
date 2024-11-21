import ApplicationLogo from '@/Components/ApplicationLogo';
import PrimaryButton from '@/Components/PrimaryButton';
import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { AddCircle } from '@mui/icons-material';
import { TextField, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { motion } from 'framer-motion';
import { useState } from 'react';
import banner from '../../../assets/images/test.png';
import banner2 from '../../../assets/images/test2.png';
export default function Register() {
    const { paletteName } = useThemeContext();
    const currentPalette = palette[paletteName];
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenoms: '',
        email: '',
        password: '',
        password_confirmation: '',
        phones: [], // Initialize an array for phone numbers
    });

    // Animation Variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
    };

    const slideInFromLeft = {
        hidden: { x: '-100%', opacity: 0 }, // Hors de l'écran, côté gauche
        visible: {
            x: '0%', // Position finale
            opacity: 1,
            transition: {
                type: 'spring', // Animation avec effet de rebond
                stiffness: 60, // Réglage du rebond
                damping: 15, // Réglage pour lisser l'animation
                duration: 0.8, // Durée de l'animation
            },
        },
        exit: { x: '-100%', opacity: 0, transition: { duration: 0.5 } }, // Animation de sortie
    };

    const bounce = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 120 },
        },
    };

    const slideInFromRight = {
        hidden: { x: '100%', opacity: 0 }, // Hors de l'écran, côté droit
        visible: {
            x: '0%', // Position finale
            opacity: 1,
            transition: {
                type: 'spring', // Animation avec effet de rebond
                stiffness: 60, // Réglage du rebond
                damping: 15, // Réglage pour lisser l'animation
                duration: 0.8, // Durée de l'animation
            },
        },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.5 } }, // Animation de sortie
    };
    const [phoneInput, setPhoneInput] = useState(''); // State to manage the current phone input

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const addPhoneNumber = () => {
        if (phoneInput && data.phones.length < 3) {
            setData('phones', [...data.phones, phoneInput]); // Add new phone number to the array
            setPhoneInput(''); // Clear the input field
        }
    };

    const removePhoneNumber = (phoneToRemove) => {
        const newPhones = data.phones.filter(
            (phone) => phone !== phoneToRemove,
        );
        setData('phones', newPhones); // Update the phones array
    };

    return (
        <AuthLayout>
            <Head title="Register" />
            <div className="relative flex min-h-screen">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="absolute left-10 top-10 z-50"
                >
                    <ApplicationLogo isSticky />
                </motion.div>
                {/* Left Section: Form */}
                <div
                    className="relative flex flex-1 items-center justify-center p-8"
                    initial="hidden"
                    animate="visible"
                    variants={slideInFromLeft}
                >
                    <div className="w-full">
                        <form
                            onSubmit={submit}
                            className="space-y-4 rounded-md bg-white p-6 dark:bg-gray-800 md:mt-16"
                        >
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                            >
                                <Typography
                                    variant="h6"
                                    className="mb-4 text-gray-700 dark:text-gray-300"
                                >
                                    Connectez-vous.
                                </Typography>
                            </motion.div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <TextField
                                    label={'Nom Complet'}
                                    id="nom"
                                    name="nom"
                                    value={data.nom}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('nom', e.target.value)
                                    }
                                    required
                                    error={!!errors.nom} // Set error state
                                    helperText={errors.nom} // Show error message
                                />
                                <TextField
                                    label={'Prénoms'}
                                    id="prenoms"
                                    name="prenoms"
                                    value={data.prenoms}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    // isFocused={true}
                                    onChange={(e) =>
                                        setData('prenoms', e.target.value)
                                    }
                                    // required
                                    error={!!errors.prenoms} // Set error state
                                    helperText={errors.prenoms} // Show error message
                                />
                            </div>

                            <div>
                                <TextField
                                    id="email"
                                    type="email"
                                    name="email"
                                    label={'Email'}
                                    value={data.email}
                                    className="col-span-1 mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    error={!!errors.email} // Set error state
                                    helperText={errors.email} // Show error message
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <TextField
                                    id="password"
                                    type="password"
                                    name="password"
                                    label={'Mot de passe'}
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                    error={!!errors.password} // Set error state
                                    helperText={errors.password} // Show error message
                                />
                                <TextField
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    label={'Confirmer mot de passe'}
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    error={!!errors.password_confirmation} // Set error state
                                    helperText={errors.password_confirmation} // Show error message
                                />
                            </div>

                            {/* Phone Numbers Section */}
                            <div className="col-span-2">
                                <div className="relative mt-2 flex items-center">
                                    <TextField
                                        value={phoneInput}
                                        onChange={(e) =>
                                            setPhoneInput(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        label="Ajouter un numéro de téléphone"
                                        disabled={data.phones.length >= 3} // Disable input if 3 numbers are added
                                    />
                                    <button
                                        className="absolute right-3 ml-2"
                                        onClick={addPhoneNumber}
                                        type="button"
                                        disabled={data.phones.length >= 3} // Disable button if 3 numbers are added
                                    >
                                        <AddCircle />
                                    </button>
                                </div>
                                <div className="mt-2 space-x-1">
                                    {data.phones.map((phone, index) => (
                                        <Chip
                                            key={index}
                                            label={phone}
                                            onDelete={() =>
                                                removePhoneNumber(phone)
                                            }
                                            className="mr-2 mt-2"
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

                            <div className="col-span-2 mt-4 flex items-center justify-end">
                                <Link
                                    href={route('login')}
                                    className="mr-3 rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                >
                                    Déjà inscrit ?
                                </Link>
                                <PrimaryButton
                                    className="ms-4"
                                    disabled={processing}
                                    type="submit"
                                >
                                    S'inscrire
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="relative hidden h-screen flex-1 items-center justify-center overflow-hidden lg:flex">
                    <div
                        className="absolute -top-36 h-full w-full bg-opacity-5 bg-cover object-cover"
                        style={{
                            backgroundImage: `url(${banner})`,
                            // transform: 'scale(0.85)', // Agrandit légèrement l'image de fond
                            transformOrigin: 'center',
                            // filter: 'brightness(0.7)',
                            filter: 'brightness(6) grayscale(100%)',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover', // Assombrit légèrement pour plus de profondeur
                        }}
                    />
                    <motion.img
                        initial="hidden"
                        animate="visible"
                        variants={slideInFromRight}
                        exit="exit"
                        src={banner2}
                        alt="Login Illustration"
                        className="absolute h-auto w-full object-cover -bottom-1"
                    />
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{
                            y: 20,
                            transition: {
                                type: 'spring', // Animation avec effet de rebond
                                stiffness: 60, // Réglage du rebond
                                damping: 15, // Réglage pour lisser l'animation
                                duration: 0.8, // Durée de l'animation
                            },
                        }}
                        className="absolute top-10 z-10 flex flex-col items-start justify-center rounded-md p-10 text-left text-gray-500"
                    >
                        <Typography
                            variant="h4"
                            gutterBottom
                            className="text-left"
                            style={{ color: currentPalette[500] }}
                        >
                            Bienvenue sur Vezo Tours ! 👋🏻
                        </Typography>
                        <Typography
                            variant="body1"
                            className="text-left text-gray-500"
                        >
                            Connectez-vous pour découvrir toutes nos
                            fonctionnalités exclusives et planifier votre
                            prochain voyage.
                        </Typography>
                    </motion.div>
                </div>
            </div>
        </AuthLayout>
    );
}
