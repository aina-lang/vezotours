import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

const AddReservation = ({ users, vehicules }) => {
    const { data, setData, post, processing, errors } = useForm({
        user_id: null,
        vehicule_id: null,
        type_voyage: null,
        date_depart: null,
        date_retour: null,
        motif: '',
    });

    const travelTypes = [
        { id: 1, label: 'circuit' },
        { id: 2, label: 'transfert' },
        { id: 3, label: 'boucle' },
    ];

    useEffect(() => {
        if (users.length > 0) {
            setData('user_id', users[0]?.id);
        }
        if (vehicules.length > 0) {
            setData('vehicule_id', vehicules[0]?.id);
        }
        if (travelTypes.length > 0) {
            setData('type_voyage', travelTypes[0]?.label);
        }
    }, [users, vehicules]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if dates are valid
        if (
            !data.date_depart ||
            !data.date_retour ||
            dayjs(data.date_retour).isBefore(data.date_depart)
        ) {
            alert(
                'La date de retour doit être égale ou supérieure à la date de départ.',
            );
            return;
        }

        // Format dates for submission

        const formData = new FormData();

        const formattedDetails = {
            ...data,
            date_depart: data.date_depart.format('YYYY-MM-DD HH:mm:ss'),
            date_retour: data.date_retour.format('YYYY-MM-DD HH:mm:ss'),
        };

        console.log(formattedDetails);
        Object.keys(formattedDetails).forEach((key) => {
            formData.append(key, formattedDetails[key]);
        });

        router.post('/admin/reservations', formData, {
            onSuccess: () => {},
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
        });
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Ajouter une Réservation"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Réservations', href: '/admin/reservations' },
                        { label: 'Ajouter' },
                    ]}
                />
            }
        >
            <Head title="Ajouter une Réservation" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                <form onSubmit={handleSubmit} className="p-4">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => option.nom}
                                value={
                                    users.find(
                                        (user) => user.id === data.user_id,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setData('user_id', newValue?.id || null);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Client"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.user_id}
                                        helperText={errors.user_id}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={vehicules}
                                getOptionLabel={(option) => option.marque}
                                value={
                                    vehicules.find(
                                        (vehicule) =>
                                            vehicule.id === data.vehicule_id,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setData(
                                        'vehicule_id',
                                        newValue?.id || null,
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Véhicule"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.vehicule_id}
                                        helperText={errors.vehicule_id}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={travelTypes}
                                getOptionLabel={(option) => option.label}
                                value={
                                    travelTypes.find(
                                        (type) =>
                                            type.label === data.type_voyage,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setData(
                                        'type_voyage',
                                        newValue?.label || null,
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Type de Voyage"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.type_voyage}
                                        helperText={errors.type_voyage}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Motif"
                                value={data.motif}
                                onChange={(e) =>
                                    setData('motif', e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                error={!!errors.motif}
                                helperText={errors.motif}
                            />
                        </Grid>
                        <div className="grid grid-cols-2 m-4 gap-4">
                            <Grid item xs={12}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        label="Date de départ souhaitée"
                                        value={data.date_depart}
                                        onChange={(newValue) =>
                                            setData('date_depart', newValue)
                                        }
                                        shouldDisableDate={(date) =>
                                            date.isBefore(
                                                dayjs().startOf('day'),
                                            )
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                error={!!errors.date_depart}
                                                helperText={errors.date_depart}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        label="Date de Retour"
                                        value={data.date_retour}
                                        onChange={(newValue) =>
                                            setData('date_retour', newValue)
                                        }
                                        shouldDisableDate={(date) =>
                                            date.isBefore(
                                                dayjs().startOf('day'),
                                            )
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                error={!!errors.date_retour}
                                                helperText={errors.date_retour}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                        </div>
                        <Grid item xs={12}>
                            <PrimaryButton type="submit" disabled={processing}>
                                Ajouter la réservation
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddReservation;
