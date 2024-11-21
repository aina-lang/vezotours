import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import StyledDataGrid from '@/Components/StyledDataGrid';
import { Input } from '@/components/ui/input';

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { MoreHorizSharp, TableView } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import { GridIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function Index({ clients }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [gridView, setGridView] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [debouncedSearchQuery, setDebouncedSearchQuery] =
        useState(searchQuery);

    // Debounce the search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // 300ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    // Toggle between grid and table view
    const toggleGridView = () => {
        setItemsPerPage(gridView ? 5 : 8);
        setGridView(!gridView);
    };

    const filteredClients = clients.data.filter((client) =>
        client.nom.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
    );

    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Véhicules et Catégories"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Véhicules' },
                    ]}
                    right={
                        <div className="flex space-x-4">
                            <button onClick={toggleGridView}>
                                {gridView ? (
                                    <GridIcon
                                        size={35}
                                        className="text-gray-500"
                                    />
                                ) : (
                                    <TableView
                                        fontSize="large"
                                        className="text-gray-500"
                                    />
                                )}
                            </button>
                            <div className="flex items-center overflow-hidden rounded-md border bg-gray-50 pr-2 dark:bg-gray-800">
                                <Input
                                    className="focus: border-none bg-gray-50 p-2 dark:bg-gray-800"
                                    placeholder="Rechercher une catégorie..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    aria-label="Rechercher une catégorie"
                                />
                                <SearchIcon size={20} />
                            </div>
                            <PrimaryButton
                                onClick={() =>
                                    router.get('/admin/clients/create')
                                }
                                aria-label="Ajouter un nouveau véhicule"
                            >
                                <GridAddIcon />
                                Nouveau Véhicule
                            </PrimaryButton>
                        </div>
                    }
                />
            }
        >
            <Head title="Véhicules et Catégories" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                {gridView ? (
                    <Grid container spacing={2}>
                        {paginatedClients.map((client, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <div className="flex flex-col rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-gray-300">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h4 className="text-lg font-semibold">
                                            {client.nom}
                                        </h4>
                                        <button className="bg-transparent p-0 shadow-none">
                                            <MoreHorizSharp className="text-gray-500" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {client.description}
                                    </p>
                                    {/* Display phone numbers */}
                                    <div className="mt-2">
                                        {client.phones &&
                                        client.phones.length > 0 ? (
                                            <p className="text-sm text-gray-500">
                                                Téléphones:{' '}
                                                {client.phones.join(', ')}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                Aucun téléphone disponible
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <StyledDataGrid
                        data={clients}
                        columns={[
                            { accessorKey: 'nom', header: 'Nom ' },
                            { accessorKey: 'prenoms', header: 'Prenom(s)' },
                            { accessorKey: 'email', header: 'Email' },
                            {
                                accessorKey: 'phones',
                                header: 'Téléphones',
                                // Format phone numbers for display if needed
                                cell: ({ row }) => {
                                    const phones = JSON.parse(
                                        JSON.parse(row.original.phones),
                                    );

                                    console.log(phones);
                                    return phones.length > 0 ? (
                                        <div className="flex flex-col space-y-2">
                                            {phones.map((phone, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-full bg-blue-200 px-3 py-1 text-sm font-medium text-blue-500 w-full text-center"
                                                >
                                                    {phone}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">
                                            Aucun téléphone
                                        </span>
                                    );
                                },
                            },
                            //     {
                            //         accessorKey: 'status',
                            //         header: 'Status',
                            //         cell: ({ row }) => (
                            //             <span
                            //                 className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadge(row.original.status)}`}
                            //             >
                            //                 {row.original.status
                            //                     .charAt(0)
                            //                     .toUpperCase() +
                            //                     row.original.status.slice(1)}
                            //             </span>
                            //         ),
                            //     },
                        ]}
                        actionUrl={route(route().current())}
                        pdfUrl={'vehicule.pdf'}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default Index;
