import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { router } from '@inertiajs/react';
import { HomeIcon } from 'lucide-react';
import React from 'react';

interface BreadcrumbItemType {
    label: string;
    href: string | URL;
    icon?: React.ReactNode; // Make icon optional
}

interface MyHeaderProps {
    title: string;
    breadcrumbItems: BreadcrumbItemType[];
    right: React.ReactElement;
}

const MyHeader: React.FC<MyHeaderProps> = ({
    title,
    breadcrumbItems,
    right,
}) => {
    // Add "Accueil" as the first breadcrumb item

    // Ajout de "Tableau de bord" en tant que premier élément de la breadcrumb
    const items: BreadcrumbItemType[] = [
        {
            label: 'Tableau de bord',
            href: `dashboard`, // Redirection selon la route actuelle
            icon: <HomeIcon className="h-5 w-5" aria-hidden="true" />, // Ajustement de la taille de l'icône si nécessaire
        },
        ...breadcrumbItems,
    ];

    return (
        <div className="overflow-y-hidden py-0">
            <div className="mx-auto w-full">
                <div className="overflow-hidden">
                    <div className="p-6 text-gray-900">
                        <div className="flex flex-row items-center justify-between">
                            {/* Breadcrumb Component */}
                            <Breadcrumb>
                                <BreadcrumbList className="flex items-center space-x-2">
                                    {items.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem>
                                                {item.href ? (
                                                    <BreadcrumbLink
                                                        className="flex cursor-pointer items-center text-gray-500 hover:underline"
                                                        onClick={() => {
                                                            router.get(
                                                                item.href,
                                                            );
                                                        }}
                                                    >
                                                        {item.icon && (
                                                            <span className="mr-1">
                                                                {item.icon}
                                                            </span>
                                                        )}
                                                        {item.label}
                                                    </BreadcrumbLink>
                                                ) : (
                                                    <BreadcrumbPage className="font-bold text-gray-600">
                                                        {item.label}
                                                    </BreadcrumbPage>
                                                )}
                                            </BreadcrumbItem>
                                            {index < items.length - 1 && (
                                                <BreadcrumbSeparator className="text-gray-400">
                                                    /
                                                </BreadcrumbSeparator>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>

                            {right}
                            {/* Header Title */}
                            {/* <span className="font-bold text-2xl mt-4">{title}</span> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyHeader;
