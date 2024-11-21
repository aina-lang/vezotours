// Other imports remain the same
import PrimaryButton from '@/Components/PrimaryButton';
import ReservationModal from '@/Components/ReservationModal';
import SecondaryButton from '@/Components/SecondaryButton';
import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    BookOnlineTwoTone,
    CarRentalOutlined,
    CarRentalRounded,
    EventRounded,
    Search,
    TravelExplore,
} from '@mui/icons-material';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReloadIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { CarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ReactTyped } from 'react-typed';
import banner from '../../assets/images/bgbanner.jpg';
export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    latestVehicles,
    categories,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const { paletteName } = useThemeContext();
    const [isSticky, setSticky] = useState(false);
    const currentPalette = palette[paletteName];
    const { data, setData, post, processing, errors } = useForm({
        nom: auth?.user ? auth?.user?.nom : '',
        email: auth?.user ? auth?.user?.email : '',
        message: '',
    });

    const [query, setQuery] = useState({
        marque: '',
        date_depart: null,
        date_retour: null,
        categorie: categories[0]?.id || '',
    });

    const handleChange = (field, value) => {
        setQuery((prev) => ({ ...prev, [field]: value }));
        setData(field, value); // Also update form data for other purposes
    };
    // Handle vehicle search form submission
    const handleVehicleSearchSubmit = (e) => {
        router.get(
            route('cars.all'),
            { search: query },
            { preserveState: true },
        );
    };

    // Handle contact form submission
    const handleContactSubmit = (e) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => console.log('Contact form submitted!'),
        });
    };

    const { scrollTo } = usePage().props; // Access the passed data

    useEffect(() => {
        if (scrollTo) {
            const element = document.getElementById(scrollTo); // Get the element by ID
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the element
            }
        }
    }, [scrollTo]);

    const handleOpenModal = (car) => {
        setSelectedCar(car);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCar(null);
    };

    const handleCancelReservation = async (car) => {};

    const [isMobile, setIsMobile] = useState(false);

    // Check if the screen size is mobile (for example, smaller than 768px)
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setSticky(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <GuestLayout auth={auth} footerShown={true}>
            <Head title="Vezo Tours - Unlock Your Travel Experience" />
            <div className="overflow-x-hidden bg-gray-100 text-gray-800">
                {/* Hero Section with ReactTyped */}
                <main
                    id="home"
                    className="relative flex min-h-screen items-center bg-cover bg-fixed bg-center backdrop-blur-lg md:p-10"
                    style={{ backgroundImage: `url(${banner})` }}
                >
                    <div
                        className={`${isSticky ? 'backdrop-blur-sm' : 'backdrop-blur-none'} absolute inset-0 bg-black bg-opacity-50 transition-all duration-300 ease-in-out`}
                    />

                    <div className="z-10 text-center">
                        <h1 className="mb-4 text-xl font-bold text-white md:text-5xl">
                            <ReactTyped
                                strings={[
                                    'TROUVEZ FACILEMENT UNE VOITURE',
                                    'VOYAGEZ PARTOUT A MADAGASCAR',
                                ]}
                                typeSpeed={100}
                                loop
                                backSpeed={50}
                                cursorChar="|"
                                showCursor={true}
                            />
                        </h1>
                        <p className="mx-auto mb-6 p-5 text-gray-200 md:w-1/2 md:p-0">
                            Notre plateforme vous permet de réserver rapidement
                            et simplement une voiture pour vos déplacements à
                            travers tout Madagascar. Que ce soit pour un voyage
                            d'affaires, des vacances ou une simple escapade,
                            nous avons la solution idéale pour répondre à vos
                            besoins. Avec un large choix de véhicules et des
                            options flexibles
                        </p>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.5,
                            }}
                        >
                            <PrimaryButton
                                onClick={() => {
                                    router.visit('allcars');
                                }}
                            >
                                <CarRentalOutlined className="mr-2" />
                                réserver maintenant
                            </PrimaryButton>
                        </motion.div>
                    </div>
                    <section className="absolute -bottom-12 left-0 right-0 mx-auto hidden w-full justify-center px-64 md:flex">
                        <div className="flex items-center justify-center rounded-md bg-white px-5 py-5 shadow-xl dark:bg-gray-800">
                            <form>
                                <div className="grid grid-cols-4 justify-center">
                                    <div className="flex">
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                label="Date de départ"
                                                value={query.date_depart}
                                                shouldDisableDate={(date) =>
                                                    date.isBefore(
                                                        dayjs().startOf('day'),
                                                    )
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            style: {
                                                                outline: 'none',
                                                            },
                                                        }}

                                                        // sx={{ mt: 2 }}
                                                    />
                                                )}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'date_depart',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </LocalizationProvider>
                                        <div className="mx-5 hidden border-l border-gray-400 md:block" />
                                    </div>
                                    <div className="flex">
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                        >
                                            <DatePicker
                                                label="Date de retour"
                                                value={query.date_retour}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'date_retour',
                                                        e.target.value,
                                                    )
                                                }
                                                shouldDisableDate={(date) =>
                                                    date.isBefore(
                                                        query.date_depart,
                                                    )
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        variant="standard"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            style: {
                                                                outline: 'none',
                                                            },
                                                        }}
                                                        {...params}

                                                        // sx={{ mt: 2 }}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                        <div className="mx-5 hidden border-l border-gray-400 md:block" />
                                    </div>
                                    <div>
                                        <TextField
                                            fullWidth
                                            label="Catégorie de voiture"
                                            select
                                            variant="standard"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                disableUnderline: true,
                                                style: {
                                                    outline: 'none',
                                                },
                                            }}
                                            className="text-white"
                                            value={query.categorie}
                                            onChange={(e) =>
                                                handleChange(
                                                    'categorie',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {categories.map((option, index) => (
                                                <MenuItem
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.nom}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <PrimaryButton
                                            onClick={handleVehicleSearchSubmit}
                                            className="mt-4 h-full md:mt-0"
                                        >
                                            <Search />
                                            Rechercher
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>
                </main>
                <section
                    id="service"
                    className="flex min-h-screen items-center px-6 py-10 dark:bg-gray-900"
                >
                    <div className="h-full p-6">
                        <div className="mb-8 text-center">
                            <h2 className="mb-2 mt-24 text-3xl font-bold text-gray-700 dark:text-white">
                                NOS MEILLEURS SERVICES
                            </h2>
                            <span className="text-gray-600">
                                Des solutions sur mesure pour vos besoins de
                                location
                            </span>
                        </div>

                        <div className="grid h-full items-center justify-center gap-6 rounded-3xl p-8 py-10 md:grid-cols-3">
                            {[
                                {
                                    name: 'RÉSERVATION EN LIGNE',
                                    icon: (
                                        <BookOnlineTwoTone
                                            fontSize="large"
                                            className="text-yellow-400"
                                        />
                                    ),
                                    description:
                                        'Notre service de location de voitures en ligne offre une expérience de réservation fluide',
                                },
                                {
                                    name: 'TRANSPORT EN VILLE',
                                    icon: (
                                        <TravelExplore
                                            fontSize="large"
                                            className="text-green-400"
                                        />
                                    ),
                                    description:
                                        'Des services de transport fiables à travers la ville pour votre confort.',
                                },
                                {
                                    name: 'ÉVÉNEMENTS SPÉCIAUX',
                                    icon: (
                                        <EventRounded
                                            fontSize="large"
                                            className="text-purple-400"
                                        />
                                    ),
                                    description:
                                        'Des services de transport personnalisés pour des occasions spéciales.',
                                },
                            ].map((service, index) => (
                                <motion.div
                                    key={index}
                                    className="[border border-gray-400] h-full rounded-lg bg-white p-6 text-center shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.5 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.2,
                                    }}
                                >
                                    <div className="mx-auto mb-4 flex w-full items-center justify-center text-center text-5xl">
                                        {service.icon}
                                    </div>
                                    <h3 className="mb-2 text-2xl font-semibold text-gray-700 dark:text-white">
                                        {service.name}
                                    </h3>
                                    <p className="mb-4 text-gray-400">
                                        {service.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section
                    id="about"
                    className="min-h-screen bg-gray-50 p-5 dark:bg-gray-800"
                >
                    <div className="mb-8 text-center">
                        <h2 className="mb-2 mt-12 text-3xl font-bold uppercase text-gray-700">
                            À propos de Vezo Tours
                        </h2>
                        <span className="text-gray-600">
                            Votre partenaire de confiance pour la location de
                            voitures
                        </span>
                    </div>

                    <div className="flex w-full flex-col-reverse p-10 md:flex-row">
                        {/* Left Section */}
                        <div className="p-5 py-10 text-center md:w-1/2 md:text-left">
                            <p className="mb-4 text-gray-700">
                                Fondée en 2020,{' '}
                                <span className="p-2 highlight highlight-amber-500">
                                    Vezo Tours
                                </span>{' '}
                                a été créée par des passionnés de voyages qui
                                souhaitaient offrir une expérience de location
                                de voitures de premier ordre. Depuis nos débuts,
                                nous nous sommes engagés à fournir un service
                                exceptionnel à nos clients.
                            </p>

                            <p className="mb-4 text-gray-700">
                                Notre mission est de rendre vos déplacements
                                aussi agréables que possible. Nous croyons que
                                la qualité de service et la sécurité doivent
                                toujours être nos priorités.
                            </p>

                            <p className="mb-4 text-gray-700">
                                Nous nous engageons à sélectionner uniquement
                                des véhicules de haute qualité, répondant à nos
                                normes strictes de sécurité et de confort.
                            </p>

                            <h3 className="mb-2 mt-3 text-xl font-semibold">
                                Nos Avantages
                            </h3>
                            <ul className="ml-4 space-y-4">
                                <li className="flex items-center">
                                    <CarIcon className="mr-2 text-blue-500" />{' '}
                                    <span>
                                        Véhicules fiables et bien entretenus
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <CarIcon className="mr-2 text-blue-500" />{' '}
                                    <span>
                                        Assurance complète pour votre
                                        tranquillité d'esprit
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <CarIcon className="mr-2 text-blue-500" />{' '}
                                    <span>
                                        Service client exceptionnel 24/7
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <CarIcon className="mr-2 text-blue-500" />{' '}
                                    <span>
                                        Réservation facile et rapide en ligne
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Right Section (Image) */}
                        <div className="hidden h-full w-1/2 p-5 md:flex">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 120, y: 50 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="h-80 w-80 overflow-hidden rounded-full"
                            >
                                <img
                                    src={banner} // Replace with your image URL
                                    alt="À propos de nous"
                                    className="r h-full w-full"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 20 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="h-80 w-80 overflow-hidden rounded-full"
                            >
                                <img
                                    src={banner} // Replace with your image URL
                                    alt="À propos de nous"
                                    className="h-full w-full"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Available Cars Section */}
                <section
                    className="min-h-screen bg-gray-50 px-12 py-10 dark:bg-gray-900"
                    id="cars"
                >
                    <div>
                        <div className="mb-20 text-center">
                            <h2 className="mb-2 mt-24 text-center text-3xl font-bold text-gray-700 dark:text-gray-200">
                                NOS VOITURES RÉCENTES
                            </h2>
                            <span className="text-gray-600 dark:text-gray-300">
                                Découvrez notre flotte moderne et bien
                                entretenue
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {latestVehicles.map((car, index) => (
                                <Grid xs={12} sm={6} md={3} key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{
                                            once: false,
                                            amount: 0.5,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            delay: 0.1 * index,
                                        }}
                                        className="group flex h-full flex-col rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-gray-800"
                                    >
                                        {/* Image with overlay */}
                                        <div className="relative mb-2 overflow-hidden rounded-t-lg">
                                            <img
                                                src={
                                                    '/storage/' + car.images[0]
                                                }
                                                alt={car.modele}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            {/* <div className="absolute -bottom-10 inset-0 flex h-full items-center justify-center rounded-lg p-3 text-lg font-semibold text-gray-500 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <button className="rounded-full p-2 border border-white text-white font-thin">
                                                   
                                                </button>
                                            </div> */}
                                            <span className="absolute left-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-white">
                                                {car.kilometrage} km/h
                                            </span>
                                        </div>

                                        <div className="flex flex-grow flex-col p-4">
                                            {/* Model */}
                                            <Typography
                                                variant="h6"
                                                className="mb-2 font-bold text-gray-800 dark:text-gray-200"
                                            >
                                                {car.marque}/ {car.modele}
                                            </Typography>

                                            {/* Description */}
                                            <Typography
                                                variant="body2"
                                                className="mb-2 text-gray-600 dark:text-gray-400"
                                            >
                                                {car.description.length > 80
                                                    ? `${car.description.slice(0, 80)}...`
                                                    : car.description}
                                            </Typography>

                                            {/* Ratings */}
                                            <div className="mb-2 flex items-center text-yellow-500">
                                                {car.avis.length > 0 &&
                                                    (() => {
                                                        const totalRating =
                                                            car.avis.reduce(
                                                                (
                                                                    acc,
                                                                    avisItem,
                                                                ) =>
                                                                    acc +
                                                                    avisItem.note,
                                                                0,
                                                            );
                                                        const averageRating =
                                                            totalRating /
                                                            car.avis.length;
                                                        const roundedRating =
                                                            averageRating.toFixed(
                                                                1,
                                                            );
                                                        const fullStars =
                                                            Math.floor(
                                                                roundedRating,
                                                            );
                                                        const emptyStars =
                                                            5 - fullStars;
                                                        return (
                                                            <span className="flex items-center">
                                                                {'★'.repeat(
                                                                    fullStars,
                                                                )}
                                                                {'☆'.repeat(
                                                                    emptyStars,
                                                                )}
                                                                <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                                    (
                                                                    {
                                                                        roundedRating
                                                                    }
                                                                    )
                                                                </span>
                                                            </span>
                                                        );
                                                    })()}
                                            </div>

                                            {/* Spacer to push buttons to the bottom */}
                                            <div className="flex-grow" />

                                            {/* Buttons */}
                                            <div className="mt-4 flex space-x-3">
                                                {auth?.user?.type !==
                                                    'admin' && (
                                                    <PrimaryButton
                                                        onClick={() =>
                                                            handleOpenModal(car)
                                                        }
                                                        className="h-10 flex-1 items-center space-x-2 rounded-lg bg-yellow-500 px-4 py-2 text-white transition duration-200 ease-in-out hover:bg-yellow-600"
                                                    >
                                                        <CarRentalRounded />{' '}
                                                        Réserver
                                                    </PrimaryButton>
                                                )}

                                                <SecondaryButton
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                'cars.show',
                                                                car.id,
                                                            ),
                                                        )
                                                    }
                                                    isSticky
                                                    className="h-10 flex-1 rounded-lg border border-gray-300 px-4 py-2 transition duration-200 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    Voir plus
                                                </SecondaryButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Grid>
                            ))}
                        </div>
                    </div>
                    <div className="mx-auto mt-8 flex items-center justify-center">
                        <SecondaryButton
                            onClick={() => {
                                router.visit('allcars');
                            }}
                            isSticky={true}
                        >
                            <ReloadIcon className="mr-2" />
                            Voir plus
                        </SecondaryButton>
                    </div>
                </section>

                {/* Contact Section */}
                <section
                    id="contact"
                    className="flex min-h-screen items-center justify-center bg-gray-50 px-10 py-10 dark:bg-gray-900"
                >
                    <div className="w-full">
                        <h2 className="mb-2 text-center text-3xl font-bold text-gray-700 dark:text-gray-200">
                            CONTACTEZ-NOUS
                        </h2>
                        <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
                            Pour toute question ou information supplémentaire,
                            n'hésitez pas à nous contacter. Notre équipe est à
                            votre disposition pour vous aider.
                        </p>
                        <div className="mt-2 flex flex-col items-center md:flex-row">
                            <form
                                className="mx-auto mt-6 w-full rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 md:w-1/2"
                                onSubmit={handleContactSubmit}
                            >
                                <TextField
                                    fullWidth
                                    label="Nom"
                                    variant="outlined"
                                    value={data.nom}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) =>
                                        setData('nom', e.target.value)
                                    }
                                    InputLabelProps={{
                                        className: 'dark:text-gray-400',
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    variant="outlined"
                                    value={data.email}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    InputLabelProps={{
                                        className: 'dark:text-gray-400',
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Message"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    sx={{ marginBottom: 2 }}
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    InputLabelProps={{
                                        className: 'dark:text-gray-400',
                                    }}
                                />
                                <PrimaryButton
                                    type="submit"
                                    className="w-full bg-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    disabled={auth?.user?.type == 'admin'}
                                >
                                    {auth?.user?.type == 'admin'
                                        ? "Vous êtes l'administrateur "
                                        : ' Envoyer'}
                                </PrimaryButton>
                            </form>
                            <div className="mt-6 w-full md:ml-6 md:mt-0 md:w-1/2">
                                {/* Map iframe can go here */}
                            </div>
                        </div>
                    </div>
                </section>

                {selectedCar && (
                    <ReservationModal
                        open={modalOpen}
                        handleClose={handleCloseModal}
                        car={selectedCar}
                        isAuthenticated={auth.user ? true : false}
                    />
                )}
            </div>
        </GuestLayout>
    );
}
