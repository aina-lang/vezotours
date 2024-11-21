import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, usePage } from '@inertiajs/react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Calendar, Car, User } from 'lucide-react';

const ReservationDetails = () => {
    const { reservation } = usePage().props;

    return (
        <AdminLayout header={<h1>Détails de la Réservation</h1>}>
            <div className="p-6">
                {/* Informations sur le véhicule */}
                <Paper elevation={3} className="mb-6 p-6">
                    <Typography
                        variant="h5"
                        className="mb-4 flex items-center space-x-2"
                    >
                        <Car className="text-blue-500" />
                        <span>Informations sur le véhicule</span>
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Marque:</strong>{' '}
                                {reservation.vehicule.marque}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Modèle:</strong>{' '}
                                {reservation.vehicule.modele}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Prix Journalier:</strong>{' '}
                                {reservation.vehicule.prix_journalier} Ar
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Kilométrage:</strong>{' '}
                                {reservation.vehicule.kilometrage} km
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Informations sur l'utilisateur */}
                <Paper elevation={3} className="mb-6 p-6">
                    <Typography
                        variant="h5"
                        className="mb-4 flex items-center space-x-2"
                    >
                        <User className="text-green-500" />
                        <span>Informations sur l'utilisateur</span>
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Nom:</strong> {reservation.user.nom}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {reservation.user.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <strong>Téléphone:</strong>
                            {JSON.parse(
                                JSON.parse(reservation.user.phones),
                            ).map((phone, index) => (
                                <Typography variant="body1" key={index}>
                                    {phone}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Détails de la réservation */}
                <Paper elevation={3} className="mb-6 p-6">
                    <Typography
                        variant="h5"
                        className="mb-4 flex items-center space-x-2"
                    >
                        <Calendar className="text-purple-500" />
                        <span>Détails de la Réservation</span>
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Date de départ:</strong>{' '}
                                {reservation.date_depart}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Date de retour:</strong>{' '}
                                {reservation.date_retour}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>Status:</strong> {reservation.status}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Motif:</strong> {reservation.motif}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Back Button */}
                <Box display="flex" justifyContent="center" className="mt-4">
                    <PrimaryButton
                        variant="contained"
                        color="primary"
                        onClick={() => router.cancel()} // Redirect to the projects page
                    >
                        Retour à la liste des réservations
                    </PrimaryButton>
                </Box>
            </div>
        </AdminLayout>
    );
};

export default ReservationDetails;
