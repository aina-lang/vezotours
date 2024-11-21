import ConfirmModal from '@/Components/ConfirmModal';
import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import React, { useState } from 'react';

function AddPrestation({  serviceTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        description: '',
        service_type_id: '', // Ajout du champ pour le type de service
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/prestations'); // Envoi du formulaire pour ajouter une prestation
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Ajouter une Prestation"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Prestations' },
                        { label: 'Ajouter une Prestation' },
                    ]}
                    right={
                        <div className="flex space-x-4 py-5">
                            <PrimaryButton
                                onClick={() => router.get('/admin/prestations')}
                            >
                                <GridAddIcon />
                                Retour aux Prestations
                            </PrimaryButton>
                        </div>
                    }
                />
            }
        >
            <Head title="Ajouter une Prestation" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                <form onSubmit={handleSubmit} className=''>
                    <div className="mb-4 rounded-md bg-white p-5 shadow-lg grid gap-4">
                        <TextField
                            label="Nom"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                            error={!!errors.nom}
                            helperText={errors.nom}
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                            variant="outlined"
                        />

                        {/* Ajout du champ de sélection du type de service */}
                        <FormControl fullWidth variant="outlined" error={!!errors.service_type_id}>
                            <InputLabel>Type de Service</InputLabel>
                            <Select
                                label="Type de Service"
                                value={data.service_type_id}
                                onChange={(e) => setData('service_type_id', e.target.value)}
                            >
                                {serviceTypes.map((serviceType) => (
                                    <MenuItem key={serviceType.id} value={serviceType.id}>
                                        {serviceType.nom}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.service_type_id && (
                                <div className="text-red-500 text-sm">{errors.service_type_id}</div>
                            )}
                        </FormControl>
                    </div>

                    <div className="mt-6">
                        <PrimaryButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={processing}
                            fullWidth
                            className="bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Ajouter la Prestation
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            <ConfirmModal
                open={false} // Modifier selon votre logique d'ouverture
                onClose={() => {}}
                onConfirm={() => {}}
                title="Confirmer l'ajout"
                content="Êtes-vous sûr de vouloir ajouter cette prestation ?"
            />
        </AdminLayout>
    );
}

export default AddPrestation;
