import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { CalendarCheckIcon } from 'lucide-react';
import React from 'react';
import banner from '../../../assets/images/bgbanner.jpg';

function Services({ services, categories, auth }) {
    return (
        <GuestLayout auth={auth} footerShown={true}>
            <Head title="Nos Services" />

            <div
                className="relative mx-auto mb-0 flex min-h-screen bg-cover bg-fixed pb-0 pt-32"
                style={{ backgroundImage: `url(${banner})` }}
            >
                {/* Flou sur l'image de fond */}
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

                {/* Contenu principal */}
                <div className="relative z-10 flex min-h-full flex-col">
                    <section className="mb-12 p-10 text-white">
                        <h1 className="text-4xl font-bold">
                            Découvrez Nos Prestations de Service
                        </h1>
                        <p className="mt-4 text-lg text-gray-300">
                            Nous vous offrons une gamme complète de services
                            adaptés à vos besoins. Que vous soyez à la recherche
                            de soins, de conseils spécialisés, ou de solutions
                            personnalisées, nous avons ce qu'il vous faut.
                            Explorez nos catégories et trouvez le service qui
                            vous convient.
                        </p>
                    </section>

                    <div className="h-full bg-white pb-32">
                        {/* Service Categories */}
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="space-y-6 bg-white p-6"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Category Name */}
                                    <div className="text-2xl font-semibold text-blue-600">
                                        {category.nom}
                                    </div>
                                </div>

                                {/* Category Description */}
                                <p className="mt-2 text-sm text-gray-600">
                                    {category.description}
                                </p>

                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                    {services
                                        .filter(
                                            (service) =>
                                                service.service_type_id ===
                                                category.id,
                                        )
                                        .map((service) => (
                                            <div
                                                key={service.id}
                                                className="flex cursor-pointer items-start rounded-lg border border-gray-300 p-4 transition-all duration-300 hover:border-blue-500"
                                            >
                                                {/* Service Icon */}
                                                <div className="mr-4 text-xl text-yellow-500">
                                                    <CalendarCheckIcon />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-gray-800">
                                                        {service.nom}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {service.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}

export default Services;
