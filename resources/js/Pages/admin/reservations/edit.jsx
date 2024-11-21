import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';

const EditReservation = ({ users, vehicules, reservation }) => {
    const { data, setData, put, processing, errors } = useForm({
        user_id: reservation.user_id || null,
        vehicule_id: reservation.vehicule_id || null,
        type_voyage: reservation.type_voyage || null,
        date_depart: reservation.date_depart ? dayjs(reservation.date_depart) : null,
        date_retour: reservation.date_retour ? dayjs(reservation.date_retour) : null,
        motif: reservation.motif || '',
    });

    const travelTypes = [
        { id: 1, label: 'circuit' },
        { id: 2, label: 'transfert' },
        { id: 3, label: 'boucle' },
    ];

    useEffect(() => {
        if (!data.user_id && users.length > 0) {
            setData('user_id', users[0]?.id);
        }
        if (!data.vehicule_id && vehicules.length > 0) {
            setData('vehicule_id', vehicules[0]?.id);
        }
        if (!data.type_voyage && travelTypes.length > 0) {
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
            alert('La date de retour doit être égale ou supérieure à la date de départ.');
            return;
        }

        // Format dates for submission
        const formData = {
            ...data,
            date_depart: data.date_depart.format('YYYY-MM-DD HH:mm:ss'),
            date_retour: data.date_retour.format('YYYY-MM-DD HH:mm:ss'),
        };

        // Use 'put' for updating the reservation
        router.put(`/admin/reservations/${reservation.id}`, formData, {
            onSuccess: () => {
                // Do something on success, like redirect or display a message
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
        });
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Modifier la Réservation"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Réservations', href: '/admin/reservations' },
                        { label: 'Modifier' },
                    ]}
                />
            }
        >
            <Head title="Modifier la Réservation" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                <form onSubmit={handleSubmit} className="p-4">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => option.nom}
                                value={
                                    users.find((user) => user.id === data.user_id) || null
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
                                        (vehicule) => vehicule.id === data.vehicule_id,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setData('vehicule_id', newValue?.id || null);
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
                                        (type) => type.label === data.type_voyage,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setData('type_voyage', newValue?.label || null);
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
                                onChange={(e) => setData('motif', e.target.value)}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                error={!!errors.motif}
                                helperText={errors.motif}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date de départ souhaitée"
                                    value={data.date_depart}
                                    onChange={(newValue) => setData('date_depart', newValue)}
                                    shouldDisableDate={(date) =>
                                        date.isBefore(dayjs().startOf('day'))
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date de Retour"
                                    value={data.date_retour}
                                    onChange={(newValue) => setData('date_retour', newValue)}
                                    shouldDisableDate={(date) =>
                                        date.isBefore(dayjs().startOf('day'))
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
                        <Grid item xs={12}>
                            <PrimaryButton type="submit" disabled={processing}>
                                Modifier la réservation
                            </PrimaryButton>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditReservation;
