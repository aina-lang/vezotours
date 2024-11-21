import { router } from '@inertiajs/react';
import {
    Badge,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';

const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
};

const ReservationModal = ({ open, handleClose, car, isAuthenticated }) => {
    const [reservationDetails, setReservationDetails] = useState({
        user_id: '',
        vehicule_id: car.id,
        date_depart: null,
        date_retour: null,
        motif: '',
        pieces_jointes: [],
        type_voyage: '',
    });

    const handleDetailChange = (event) => {
        const { name, value } = event.target;
        setReservationDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleDepartureDateChange = (newDate) => {
        setReservationDetails((prevDetails) => ({
            ...prevDetails,
            date_depart: newDate,
        }));
    };

    const handleReturnDateChange = (newDate) => {
        setReservationDetails((prevDetails) => ({
            ...prevDetails,
            date_retour: newDate,
        }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setReservationDetails((prevDetails) => ({
            ...prevDetails,
            pieces_jointes: [...prevDetails.pieces_jointes, ...files],
        }));
    };

    const handleFileDelete = (fileToDelete) => {
        setReservationDetails((prevDetails) => ({
            ...prevDetails,
            pieces_jointes: prevDetails.pieces_jointes.filter(
                (file) => file !== fileToDelete,
            ),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData();

        // Format dates before appending to formData
        const formattedDetails = {
            ...reservationDetails,
            date_depart: reservationDetails.date_depart
                ? reservationDetails.date_depart.format('YYYY-MM-DD HH:mm:ss')
                : null,
            date_retour: reservationDetails.date_retour
                ? reservationDetails.date_retour.format('YYYY-MM-DD HH:mm:ss')
                : null,
        };

        // Append all reservation details to formData
        Object.keys(formattedDetails).forEach((key) => {
            if (key === 'pieces_jointes') {
                formattedDetails[key].forEach((file) => {
                    formData.append('pieces_jointes[]', file);
                });
            } else {
                formData.append(key, formattedDetails[key]);
            }
        });

        // Submit reservation data via Inertia
        await router.post('/client/reservations', formData, {
            onSuccess: () => {
                handleClose(); // Close the modal on successful submission
            },
            onError: (errors) => {
                console.error('Submission errors:', errors);
            },
        });
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center"
        >
            <motion.div
                variants={modalVariants}
                initial="hidden"
                animate={open ? 'visible' : 'hidden'}
                transition={{ duration: 0.3 }}
                className="w-1/2 rounded-lg bg-white p-6 shadow-lg"
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Réservation de {car.marque} {car.modele}
                </Typography>

                <TextField
                    fullWidth
                    label="Motif de réservation"
                    name="motif"
                    value={reservationDetails.motif}
                    onChange={handleDetailChange}
                    sx={{ mt: 2 }}
                />

                {/* Dropdown for Travel Type */}
                <InputLabel id="type-de-voyage-label" sx={{ mt: 2 }}>
                    Type de voyage
                </InputLabel>
                <Select
                    labelId="type-de-voyage-label"
                    name="type_voyage"
                    value={reservationDetails.type_voyage}
                    onChange={handleDetailChange}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    <MenuItem value="circuit">Circuit</MenuItem>
                    <MenuItem value="boucle">Boucle</MenuItem>
                    <MenuItem value="transfert">Transfert</MenuItem>
                </Select>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date de départ souhaitée"
                            value={reservationDetails.date_depart}
                            onChange={handleDepartureDateChange}
                            shouldDisableDate={(date) =>
                                date.isBefore(dayjs().startOf('day'))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date de retour souhaitée"
                            value={reservationDetails.date_retour}
                            onChange={handleReturnDateChange}
                            shouldDisableDate={(date) =>
                                date.isBefore(reservationDetails.date_depart)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />
                    </LocalizationProvider>

                    {/* File Upload Button */}
                    {/* <div>
                        <InputLabel htmlFor="file-upload" sx={{ mt: 2 }}>
                            Joindre des fichiers
                        </InputLabel>
                        <input
                            // accept="*/
                    /*"
                            id="file-upload"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                sx={{ mt: 2 }}
                            >
                                Choisir des fichiers
                            </Button>
                        </label>
                    </div> */}
                </div>

                {/* List Attached Files */}
                <div className="mt-4">
                    {reservationDetails.pieces_jointes.length > 0 && (
                        <Typography variant="body2">
                            Fichiers joints:
                        </Typography>
                    )}
                    {reservationDetails.pieces_jointes.map((file, index) => (
                        <Badge
                            key={index}
                            badgeContent="x"
                            color="error"
                            onClick={() => handleFileDelete(file)}
                        >
                            <Typography variant="body2">{file.name}</Typography>
                        </Badge>
                    ))}
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                    {!isAuthenticated && (
                        <PrimaryButton
                            onClick={() => router.visit('login')}
                            sx={{ mt: 2 }}
                        >
                            Se connecter
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={!isAuthenticated}
                    >
                        Soumettre la réservation
                    </PrimaryButton>
                </div>
            </motion.div>
        </Modal>
    );
};

export default ReservationModal;
