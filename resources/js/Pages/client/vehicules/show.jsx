import ConfirmModal from '@/Components/ConfirmModal';
import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
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
            const previews = decodedImages.map(
                (image) => `/storage/${image}`,
            );
            setImagePreviews(previews);
        }
    }, [vehicule.images]);

    const handleRemoveImage = (index) => {
        setImageToDelete(index);
        setConfirmOpen(true); // Open confirmation modal
    };

    const confirmImageRemoval = () => {
        setImagePreviews((prevImages) => prevImages.filter((_, i) => i !== imageToDelete));
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
                                    router.get(`/admin/vehicules/${vehicule.id}/edit`)
                                }
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
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Détails du véhicule</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <p><strong>Marque:</strong> {vehicule.marque}</p>
                            <p><strong>Modèle:</strong> {vehicule.modele}</p>
                        </div>
                        <div className="col-span-1">
                            <p><strong>Immatriculation:</strong> {vehicule.immatriculation}</p>
                            <p><strong>Kilométrage:</strong> {vehicule.kilometrage} km</p>
                        </div>
                        <div className="col-span-1">
                            <p><strong>Prix Journalier:</strong> {vehicule.prix_journalier} €/jour</p>
                        </div>
                        <div className="col-span-1">
                            <p><strong>Catégorie:</strong> {vehicule.categorie ? vehicule.categorie.nom : 'Non définie'}</p>
                        </div>
                    </div>
                    <p className="mt-4"><strong>Description:</strong> {vehicule.description}</p>
                </div>

                {/* Display Images */}
                <div className="my-4">
                    <h3 className="text-lg font-medium mb-4">Images du véhicule</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {imagePreviews.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`Image ${index}`}
                                    className="w-full h-48 object-cover rounded-md shadow-md cursor-pointer"
                                    onClick={() => openImageModal(index)}
                                />
                                {/* Remove button */}
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            ✕
                        </button>
                        <img
                            src={imagePreviews[currentImageIndex]}
                            alt={`Image ${currentImageIndex}`}
                            className="max-w-full max-h-full"
                        />
                        {/* Navigation buttons */}
                        <button
                            onClick={showPrevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
                        >
                            ◀
                        </button>
                        <button
                            onClick={showNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full"
                        >
                            ▶
                        </button>
                    </div>
                </div>
            )}

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
