import PrimaryButton from '@/Components/PrimaryButton';
import ReservationModal from '@/Components/ReservationModal';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { CarRentalRounded } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import _ from 'lodash';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

export default function AllCars({ auth, latestVehicles, categories }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    const [query, setQuery] = useState({
        search: '',
        date_depart: '',
        date_retour: '',
        categorie: '',
    });

    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState(latestVehicles.data);
    const [page, setPage] = useState(1); // Initialize page to 1
    const listRef = useRef(null);

    const { setData } = useForm({
        search: '',
        date_depart: '',
        date_retour: '',
        categorie: '',
    });

    const loader = useRef(null);

    const [totalPages, setTotalPages] = useState(latestVehicles.last_page);

    // Handle form field changes
    const handleChange = (field, value) => {
        setQuery((prev) => ({ ...prev, [field]: value }));
        setData(field, value);
    };

    const handleOpenModal = (car) => {
        setSelectedCar(car);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCar(null);
    };

    const resetFilters = () => {
        setQuery({
            search: '',
            date_depart: '',
            date_retour: '',
            categorie: '',
        });
        setCars(latestVehicles.data);
        setPage(1); // Reset to the first page
    };

    // Fetch cars with debounce
    const fetchCars = useCallback((query) => {
        setLoading(true);
        router.get(
            route(route().current()),
            { search: query },
            {
                preserveState: true,
                replace: true,
                onSuccess: (data) => {
                    setCars(data.props.latestVehicles.data);
                    setPage(data.props.latestVehicles.current_page);
                    setTotalPages(data.props.latestVehicles.last_page);
                    setLoading(false);
                },
            },
        );
    }, []);

    // Debounced version of the search query handler
    const debounceSearch = useMemo(
        () => _.debounce(() => fetchCars(query), 500),
        [fetchCars, query],
    );

    useEffect(() => {
        if (query) {
            debounceSearch();
        }
        return () => {
            debounceSearch.cancel(); // Clean up debounce
        };
    }, [query, debounceSearch]);

    // Load more cars when scrolling
    const loadMoreCars = () => {
        if (loading || page >= totalPages) return; // Do nothing if already loading or on last page
        setLoading(true);

        router.get(
            route(route().current()),
            {
                page: page + 1,
                search: query,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: (data) => {
                    setCars((prevCars) => [
                        ...prevCars,
                        ...data.props.latestVehicles.data,
                    ]);
                    setPage(data.props.latestVehicles.current_page);
                    setTotalPages(data.props.latestVehicles.last_page);
                    setLoading(false);
                },
            },
        );
    };

    // Handle scroll event to load more cars
    const handleScroll = () => {
        const scrollPosition =
            listRef.current.scrollTop + listRef.current.clientHeight;
        const bottomPosition = listRef.current.scrollHeight;

        if (scrollPosition >= bottomPosition - 50 && !loading) {
            loadMoreCars();
        }
    };

    // Add scroll listener when component mounts
    useEffect(() => {
        const listElement = listRef.current;
        listElement.addEventListener('scroll', handleScroll);

        return () => {
            listElement.removeEventListener('scroll', handleScroll);
        };
    }, [loading, page, totalPages]);

    return (
        <GuestLayout auth={auth} footerShown={false}>
            <Head title="Ayna lbr - Unlock Your Travel Experience" />

            <div className="flex h-screen justify-start overflow-hidden bg-gray-50 text-gray-800">
                <section className="left-0 right-0 top-0 z-30 mx-auto min-h-screen w-64 pb-5">
                    <Paper
                        elevation={5}
                        className="mt-24 mx-5  w-full bg-white px-6 py-5 text-gray-800"
                    >
                        <h2 className="mb-4 text-lg font-semibold">
                           Filtrer les Véhicules
                        </h2>
                        <div className="mt-2 flex flex-col space-y-5">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Marque"
                                    type="text"
                                    value={query.search}
                                    onChange={(e) =>
                                        handleChange('search', e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    className="text-gray-800"
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon className="mr-2" />
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date de départ"
                                    type="date"
                                    value={query.date_depart}
                                    onChange={(e) =>
                                        handleChange(
                                            'date_depart',
                                            e.target.value,
                                        )
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    className="text-gray-800"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date de retour"
                                    type="date"
                                    value={query.date_retour}
                                    onChange={(e) =>
                                        handleChange(
                                            'date_retour',
                                            e.target.value,
                                        )
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    className="text-gray-800"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Catégorie de voiture"
                                    select
                                    value={query.categorie}
                                    onChange={(e) =>
                                        handleChange(
                                            'categorie',
                                            e.target.value,
                                        )
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    className="text-gray-800"
                                >
                                    {categories.map((option, index) => (
                                        <MenuItem key={index} value={option.id}>
                                            {option.nom}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Reset Filters Button */}
                            <Grid item xs={12}>
                                <PrimaryButton
                                    onClick={() => resetFilters()}
                                    className="mt-4 w-full rounded py-2 text-white focus:outline-none"
                                >
                                    Réinitialiser les filtres
                                </PrimaryButton>
                            </Grid>
                        </div>
                    </Paper>
                </section>

                {/* Display filtered cars */}
                <section
                    className="mt-12 min-h-screen w-full flex-grow overflow-auto px-12 pb-32"
                    ref={listRef}
                >
                    <div>
                        <h3 className="my-14 text-3xl font-bold">
                            Derniers Véhicules
                        </h3>
                        <Grid container spacing={3}>
                            {cars.length <= 0 ? (
                                // Fallback UI when there are no cars
                                <Grid item xs={12}>
                                    <div className="py-6 text-center">
                                        <Typography
                                            variant="h6"
                                            className="text-gray-600"
                                        >
                                            Aucune voiture disponible pour
                                            l'instant.
                                        </Typography>
                                    </div>
                                </Grid>
                            ) : (
                                // Render the car items when cars array is not empty
                                cars.map((car, index) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={6}
                                        key={index}
                                    >
                                        <motion.div
                                            className="flex group  h-full items-center rounded-lg border border-gray-300 bg-white  shadow-lg transition-shadow duration-300 hover:shadow-xl"
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
                                        >
                                            {/* Image on the left */}
                                            <div className="relative mr-4 h-48 w-48 overflow-hidden rounded-l-md">
                                                <img
                                                    src={
                                                        '/storage/' +
                                                        JSON.parse(
                                                            car.images,
                                                        )[0]
                                                    }
                                                    alt={car.modele}
                                                    className="h-48 w-48  object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>

                                            {/* Car details on the right */}
                                            <div className="flex h-full flex-grow flex-col justify-between p-4">
                                                <div className="font-semibold">
                                                    <div className="flex w-full justify-between">
                                                        <span className="text-2xl text-gray-800">
                                                            {car.marque}{' '}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            {car.modele}
                                                        </span>
                                                    </div>
                                                    {/* Rating */}
                                                    <div className="ml-2 text-right text-yellow-500">
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
                                                                    car.avis
                                                                        .length;
                                                                const roundedRating =
                                                                    averageRating.toFixed(
                                                                        1,
                                                                    );

                                                                const fullStars =
                                                                    Math.floor(
                                                                        roundedRating,
                                                                    );
                                                                const emptyStars =
                                                                    5 -
                                                                    fullStars;
                                                                return (
                                                                    <span>
                                                                        {'★'.repeat(
                                                                            fullStars,
                                                                        )}
                                                                        {'☆'.repeat(
                                                                            emptyStars,
                                                                        )}
                                                                        <span className="ml-1 text-gray-600">
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
                                                </div>

                                                {/* Description */}
                                                <Typography
                                                    variant="body2"
                                                    className="mb-4 text-gray-700"
                                                >
                                                   {car.description.length > 100 ? `${car.description.slice(0, 100)}...` : car.description}

                                                </Typography>

                                                {/* Button Section */}
                                                <div className="mt-4 flex items-center justify-between space-x-4">
                                                    {auth?.user?.type !==
                                                        'admin' && (
                                                        <PrimaryButton
                                                            variant="contained"
                                                            onClick={() => {
                                                                handleOpenModal(
                                                                    car,
                                                                );
                                                            }}
                                                            className="text-white"
                                                        >
                                                           <CarRentalRounded />{' '}   Réserver
                                                        </PrimaryButton>
                                                    )}
                                                    <SecondaryButton
                                                        onClick={() => {
                                                            router.visit(
                                                                route(
                                                                    'cars.show',
                                                                    car.id,
                                                                ),
                                                            );
                                                        }}
                                                        className="flex-1"
                                                        isSticky={true}
                                                    >
                                                        Voir plus
                                                    </SecondaryButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Grid>
                                ))
                            )}
                        </Grid>

                        {/* Infinite scroll loading indicator */}
                        {loading && (
                            <div className="my-8 text-center">
                                <CircularProgress size={50} color="primary" />
                                <Typography
                                    variant="h6"
                                    style={{ marginTop: '10px' }}
                                >
                                    Chargement des véhicules...
                                </Typography>
                            </div>
                        )}
                    </div>
                </section>
                <div ref={loader} className="h-32"></div>
            </div>

            {selectedCar && (
                <ReservationModal
                    open={modalOpen}
                    handleClose={handleCloseModal}
                    car={selectedCar}
                    isAuthenticated={auth.user ? true : false}
                />
            )}
            {/* Loader trigger */}
        </GuestLayout>
    );
}
