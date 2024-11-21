import ConfirmModal from '@/Components/ConfirmModal';
import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';

function AddVehicule({ categories, errors }) {
    const { data, setData, post, processing, setError } = useForm({
        marque: '',
        modele: '',
        immatriculation: '',
        categorie: '',
        kilometrage: '',
        description: '',
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);

        // Mettre à jour les fichiers existants avec les nouveaux fichiers
        setData((prevData) => ({
            ...prevData, // Conservez toutes les autres valeurs de data
            images: [...prevData.images, ...newFiles], // Ajoutez les nouvelles images sans toucher aux autres valeurs
        }));

        // Mettre à jour les aperçus d'images
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/vehicules/');
    };

    const handleRemoveImage = (index) => {
        setImagePreviews((prevImages) =>
            prevImages.filter((_, i) => i !== index),
        );

        setData((prevData) => ({
            ...prevData, // Conservez toutes les autres valeurs de data
            images: prevData.images.filter((_, i) => i !== index), // Ajoutez les nouvelles images sans toucher aux autres valeurs
        }));
    };

    useEffect(() => {
        if (errors) {
            Object.keys(errors).forEach((field) => {
                setError(field, { type: 'manual', message: errors[field][0] });
            });
        }
    }, [errors, setError]);

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Ajouter un Véhicule"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Véhicules' },
                        { label: 'Ajouter un Véhicule' },
                    ]}
                    right={
                        <div className="flex space-x-4 py-5">
                            <PrimaryButton
                                onClick={() => router.get('/vehicules')}
                            >
                                <GridAddIcon />
                                Retour aux Véhicules
                            </PrimaryButton>
                        </div>
                    }
                />
            }
        >
            <Head title="Ajouter un Véhicule" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4"
                >
                    <div className="mb-4 h-full rounded-md bg-white p-5 shadow-lg">
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <TextField
                                label="Marque"
                                value={data.marque}
                                onChange={(e) =>
                                    setData('marque', e.target.value)
                                }
                                error={!!errors.marque}
                                helperText={errors.marque}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Modèle"
                                value={data.modele}
                                onChange={(e) =>
                                    setData('modele', e.target.value)
                                }
                                error={!!errors.modele}
                                helperText={errors.modele}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                label="Immatriculation"
                                value={data.immatriculation}
                                onChange={(e) =>
                                    setData('immatriculation', e.target.value)
                                }
                                error={!!errors.immatriculation}
                                helperText={errors.immatriculation}
                                fullWidth
                                variant="outlined"
                            />
                            <FormControl
                                fullWidth
                                error={!!errors.categorie}
                                variant="outlined"
                            >
                                <InputLabel>Catégorie</InputLabel>
                                <Select
                                    value={data.categorie}
                                    onChange={(e) =>
                                        setData('categorie', e.target.value)
                                    }
                                    label="Catégorie"
                                >
                                    {categories.map((category) => (
                                        <MenuItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.nom}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.categorie && (
                                    <p className="text-red-600">
                                        {errors.categorie}
                                    </p>
                                )}
                            </FormControl>
                            <TextField
                                label="Kilométrage"
                                type="number"
                                value={data.kilometrage}
                                onChange={(e) =>
                                    setData('kilometrage', e.target.value)
                                }
                                error={!!errors.kilometrage}
                                helperText={errors.kilometrage}
                                fullWidth
                                variant="outlined"
                                inputProps={{
                                    min: 10, // Set the minimum value to 10
                                }}
                            />
                        </div>
                        <TextField
                            label="Description"
                            multiline
                            rows={4}
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            error={!!errors.description}
                            helperText={errors.description}
                            fullWidth
                            variant="outlined"
                        />
                    </div>
                    <div className="flex h-full flex-col rounded-md bg-white p-5 shadow-lg">
                        <div className="my-4 flex-grow">
                            <label className="block text-sm font-medium text-gray-700">
                                Images du Véhicule
                            </label>
                            <div
                                onClick={() =>
                                    document
                                        .getElementById('file-upload')
                                        .click()
                                }
                                className="mt-1 flex cursor-pointer justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5"
                            >
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H20v12H8v8h12v12h8V28h12v-8H28V8z"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex cursor-pointer text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Upload des fichiers</span>
                                            <input
                                                id="file-upload"
                                                name="images"
                                                type="file"
                                                className="sr-only"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                        <p className="pl-1">
                                            ou glisser-déposer
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG jusqu'à 10MB
                                    </p>
                                </div>
                            </div>
                            <InputLabel>{errors.images}</InputLabel>
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-8 gap-4">
                                    {imagePreviews.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative h-28 w-28 overflow-hidden rounded-lg bg-gray-100"
                                        >
                                            <img
                                                src={src}
                                                alt={`Aperçu ${index}`}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleRemoveImage(index)
                                                }
                                                type="button"
                                                className="absolute right-0 top-0 mr-1 mt-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="mt-4"
                        >
                            Ajouter le Véhicule
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            <ConfirmModal
                open={false} // Modifier selon votre logique d'ouverture
                onClose={() => {}}
                onConfirm={() => {}}
                title="Confirmer l'ajout"
                content="Êtes-vous sûr de vouloir ajouter ce véhicule ?"
            />
        </AdminLayout>
    );
}

export default AddVehicule;
