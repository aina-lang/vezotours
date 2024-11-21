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
import React, { useState } from 'react';

function Index({ serviceTypes }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [gridView, setGridView] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    console.log(serviceTypes);
    // Toggle between grid and table view
    const toggleGridView = () => {
        setItemsPerPage(gridView ? 5 : 8);
        setGridView(!gridView);
    };

    const filteredCategories = serviceTypes.data.filter((category) =>
        category.nom.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

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
                                />
                                <SearchIcon size={20} />
                            </div>
                            <PrimaryButton
                                onClick={() =>
                                    router.get('/admin/serviceTypes/create')
                                }
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
                        {paginatedCategories.map((categorie, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <div className="flex flex-col rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-gray-300">
                                    <div className="mb-4 flex items-start justify-between">
                                        <h4 className="text-lg font-semibold">
                                            {categorie.nom}
                                        </h4>
                                        <button className="bg-transparent p-0 shadow-none">
                                            <MoreHorizSharp className="text-gray-500" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {categorie.description}
                                    </p>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <StyledDataGrid
                        data={serviceTypes}
                        columns={[
                            { accessorKey: 'nom', header: 'Libellé' },
                            {
                                accessorKey: 'description',
                                header: 'Description',
                            },
                        ]}
                        // filterableColumns={['motif', 'label', 'assignedTo']}
                        actionUrl={route(route().current())}
                        pdfUrl={'vehicule.pdf'}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

export default Index;
