import ConfirmModal from '@/Components/ConfirmModal';
import MyHeader from '@/Components/Header';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';

function ShowVehicule({ vehicule, errors }) {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Load existing images
    useEffect(() => {
        if (vehicule.images) {
            const decodedImages = JSON.parse(vehicule.images);
            const previews = decodedImages.map((image) => `/storage/${image}`);
            setImagePreviews(previews);
        }
    }, [vehicule.images]);

    const handleRemoveImage = (index) => {
        setImageToDelete(index);
        setConfirmOpen(true); // Open confirmation modal
    };

    const confirmImageRemoval = () => {
        setImagePreviews((prevImages) =>
            prevImages.filter((_, i) => i !== imageToDelete),
        );
        setConfirmOpen(false); // Close confirmation modal
        // Here you can add an API call to actually remove the image from the backend
    };

    const openImageModal = (index) => {
        setCurrentImageIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imagePreviews.length - 1 : prevIndex - 1,
        );
    };

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === imagePreviews.length - 1 ? 0 : prevIndex + 1,
        );
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title={`Détails du Véhicule : ${vehicule.marque} ${vehicule.modele}`}
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Véhicules', href: '/admin/vehicules' },
                        { label: `${vehicule.marque} ${vehicule.modele}` },
                    ]}
                    right={
                        <div className="flex space-x-4 py-5">
                            <PrimaryButton
                                onClick={() =>
                                    router.get(
                                        `/admin/vehicules/${vehicule.id}/edit`,
                                    )
                                }
                                className="bg-blue-600 transition hover:bg-blue-700"
                            >
                                Modifier le Véhicule
                            </PrimaryButton>
                        </div>
                    }
                />
            }
        >
            <Head title={`Véhicule ${vehicule.marque} ${vehicule.modele}`} />

            <div className="mx-auto space-y-5 p-6 pt-0">
                <div className="rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:shadow-xl">
                    <div className="flex">
                        {' '}
                        <img
                            src={`/storage/${JSON.parse(vehicule.images)[0]}`}
                            alt={`Image `}
                            className="w-2/3 rounded-md object-cover"
                            // onClick={() => openImageModal(index)}
                        />
                        <div className="w-1/3 p-2 pl-4">
                            {' '}
                            <h2 className="mb-4 text-2xl font-bold">
                                {vehicule.marque} / {vehicule.modele}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 flex justify-between">
                                    <p>
                                        <strong>Immatriculation:</strong>{' '}
                                    </p>
                                    <p>{vehicule.immatriculation}</p>
                                </div>
                                <div className="col-span-2 flex justify-between">
                                    <p>
                                        <strong>Kilométrage:</strong>{' '}
                                    </p>
                                    <p>{vehicule.kilometrage} km/h</p>
                                </div>

                                <div className="col-span-2 flex justify-between">
                                    <p>
                                        <strong>Catégorie:</strong>{' '}
                                    </p>
                                    <p>
                                        {' '}
                                        {vehicule.categorie
                                            ? vehicule.categorie.nom
                                            : 'Non définie'}
                                    </p>
                                </div>
                            </div>
                            <Divider sx={{ marginTop: 2 }} />
                            <p className="mt-4">{vehicule.description}</p>
                        </div>
                    </div>
                </div>

                {imagePreviews.length > 1 && (
                    <div className="my-4">
                        <h3 className="mb-4 text-lg font-medium">
                            Images du véhicule
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {imagePreviews.map((image, index) => (
                                <div key={index} className="group relative">
                                    <img
                                        src={image}
                                        alt={`Image ${index}`}
                                        className="h-48 w-full cursor-pointer rounded-md object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                                        onClick={() => openImageModal(index)}
                                    />
                                    {/* Remove button */}
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {vehicule.unavailableDates &&
                    vehicule.unavailableDates.length > 0 && (
                        <div className="my-4 rounded-md border border-red-300 bg-red-100 p-4">
                            <h4 className="font-semibold text-red-600">
                                Non disponible du :
                            </h4>
                            <ul className="list-disc pl-6 text-gray-700">
                                {vehicule.unavailableDates.map(
                                    (dateRange, idx) => (
                                        <li key={idx}>
                                            {dateRange.start} à {dateRange.end}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    )}
            </div>

            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <button
                    onClick={closeImageModal}
                    className="absolute right-6 top-6 text-2xl text-gray-800 hover:text-gray-500"
                >
                    ✕
                </button>
                <div className="relative w-full rounded-lg bg-white p-4 shadow-lg">
                    <img
                        src={imagePreviews[currentImageIndex]}
                        alt={`Image ${currentImageIndex}`}
                        className="h-full w-full rounded-md"
                    />
                    <button
                        onClick={showPrevImage}
                        className="absolute left-8 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-lg hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={showNextImage}
                        className="absolute right-8 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-2 shadow-md transition hover:bg-gray-200"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmImageRemoval}
                title="Supprimer l'image"
                content="Êtes-vous sûr de vouloir supprimer cette image ?"
            />
        </AdminLayout>
    );
}

export default ShowVehicule;
