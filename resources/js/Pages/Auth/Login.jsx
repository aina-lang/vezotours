import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { IconButton, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOff } from 'lucide-react';
import { useState } from 'react';
import banner from '../../../assets/images/test.png';
import banner2 from '../../../assets/images/test2.png';
export default function Login({ status, canResetPassword }) {
    const { paletteName } = useThemeContext();
    const [isPassword, setIsPassword] = useState(true);
    const currentPalette = palette[paletteName];
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

    return (
        <AuthLayout>
            <Head title="Log in" />
            <div className="relative flex min-h-screen">
                {/* Logo animé */}
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
                    <div className="w-full max-w-md">
                        {status && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={bounce}
                                className="mb-4 text-sm font-medium text-green-600"
                            >
                                {status}
                            </motion.div>
                        )}
                        <form
                            onSubmit={submit}
                            className="rounded-md bg-white p-6 dark:bg-gray-800 md:mt-16"
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

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                            >
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    required
                                />
                            </motion.div>

                            <motion.div
                                className="relative"
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                            >
                                <TextField
                                    label="Mot de passe"
                                    type={isPassword ? 'password' : 'text'}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    required
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 25,
                                    }}
                                    onClick={() => setIsPassword(!isPassword)}
                                >
                                    {!isPassword ? <EyeOff /> : <EyeIcon />}
                                </IconButton>
                            </motion.div>

                            <motion.div
                                className="mt-4 flex items-center justify-between"
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                            >
                                <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Checkbox
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                'remember',
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <span className="ml-2">
                                        Se souvenir de moi
                                    </span>
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                )}
                            </motion.div>

                            <motion.div
                                className="mt-6 w-full"
                                initial="hidden"
                                animate="visible"
                                variants={bounce}
                            >
                                <PrimaryButton
                                    disabled={processing}
                                    type="submit"
                                    fullWidth
                                >
                                    Connexion
                                </PrimaryButton>
                                <span className="block w-full p-2 text-center text-gray-500">
                                    Ou
                                </span>
                                <SecondaryButton
                                    className="ms-4"
                                    disabled={processing}
                                    onClick={() =>
                                        router.visit(route('register'))
                                    }
                                    fullWidth
                                    isSticky
                                >
                                    S'inscrire
                                </SecondaryButton>
                            </motion.div>
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
