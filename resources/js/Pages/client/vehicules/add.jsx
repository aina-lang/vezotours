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
        prix_journalier: '',
        kilometrage: '',
        description: '',
        images: [], // On initialise un tableau pour les images
    });

    const [imagePreviews, setImagePreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files); // Mettre à jour les données avec les fichiers sélectionnés

        // Générer des aperçus des images sélectionnées
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/vehicules/'); // Ajoutez la route pour l'envoi du formulaire
    };

    const handleRemoveImage = (index) => {
        setImagePreviews((prevImages) =>
            prevImages.filter((_, i) => i !== index),
        );
    };

    useEffect(() => {
        // Si des erreurs sont présentes, les afficher dans le formulaire
        if (errors) {
            Object.keys(errors).forEach((field) => {
                console.log(field);
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
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 rounded-md bg-white p-5 shadow-lg">
                        {' '}
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
                                       {console.log(e.target.value); setData('categorie', e.target.value)}
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
                                label="Prix Journalier"
                                type="number"
                                value={data.prix_journalier}
                                onChange={(e) =>
                                    setData('prix_journalier', e.target.value)
                                }
                                error={!!errors.prix_journalier}
                                helperText={errors.prix_journalier}
                                fullWidth
                                variant="outlined"
                            />
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
                    <div className="rounded-md bg-white p-5 shadow-lg">
                        {/* Section pour la sélection des images */}
                        <div className="mt-4">
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

                            {/* Affichage des aperçus d'images en grille */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-6 gap-4">
                                    {imagePreviews.map((src, index) => (
                                        <div
                                            key={index}
                                            className="relative h-32 w-32 overflow-hidden rounded-lg bg-gray-100"
                                        >
                                            <img
                                                src={src}
                                                alt={`Aperçu ${index}`}
                                                className="h-full w-full object-cover"
                                            />
                                            {/* Bouton de suppression */}
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
