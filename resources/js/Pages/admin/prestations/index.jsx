import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import StyledDataGrid from '@/Components/StyledDataGrid';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { MoreHorizSharp, TableView } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';
import { SearchIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

const index = ({ prestations, categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [gridView, setGridView] = useState(false);
    const [dateDepart, setDateDepart] = useState('');
    const [dateRetour, setDateRetour] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(
        prestations.data.current_page,
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= data.last_page) {
            // Update current page and fetch new data
            setCurrentPage(page);
            // Fetch data from the server, e.g., using Inertia.js
            router.get(`${actionUrl}?page=${page}`);
        }
    };

    useEffect(() => {
        setCurrentPage(prestations.data.current_page);
    }, [prestations.data]);

    const toggleGridView = () => {
        setGridView(!gridView);
    };

    // Handle real-time filter change with debouncing
    const handleFilter = useCallback(
        debounce(() => {
            router.get(
                route(route().current()),
                {
                    search: searchQuery,
                    date_depart: dateDepart,
                    date_retour: dateRetour,
                    categorie: selectedCategory,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }, 500), // 500ms debounce delay
        [searchQuery, dateDepart, dateRetour, selectedCategory],
    );

    // Clean up the debounce function on component unmount
    useEffect(() => {
        return () => {
            handleFilter.cancel();
        };
    }, [handleFilter]);

    // Call handleFilter on changes to search, category, or dates
    useEffect(() => {
        handleFilter();
    }, [searchQuery, dateDepart, dateRetour, selectedCategory, handleFilter]);

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Véhicules"
                    breadcrumbItems={[{ label: 'Véhicules' }]}
                    right={
                        <div className="flex space-x-4">
                            <button onClick={toggleGridView}>
                                {gridView ? (
                                    <GridAddIcon
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
                            <div className="flex items-center overflow-hidden rounded-md border bg-white pr-2 dark:bg-gray-800">
                                <Input
                                    className="border-none p-2 focus:border-none dark:bg-gray-800"
                                    placeholder="Rechercher un véhicule..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                <SearchIcon size={20} />
                            </div>
                            <PrimaryButton
                                onClick={() =>
                                    router.get('/admin/prestations/create')
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
            <Head title="Véhicules" />
            <div className="mx-auto space-y-5 p-6 pt-0">
                {gridView ? (
                    <Grid container spacing={2}>
                        {prestations.data.map((prestation, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                key={index}
                                className="min-h-full"
                            >
                                <div className="relative flex h-full flex-col justify-between rounded-lg bg-white p-4 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800 dark:text-gray-300">
                                    <div className="absolute right-4 top-4">
                                        <Link
                                            href={route(
                                                'prestations.show',
                                                prestation.id,
                                            )}
                                        >
                                            <MoreHorizSharp className="text-gray-200 transition hover:text-blue-500" />
                                        </Link>
                                    </div>
                                    <img
                                        src={
                                            '/storage/' +
                                            JSON.parse(prestation.images)[0]
                                        }
                                        alt={prestation.modele}
                                        className="h-48 w-full rounded-lg object-cover"
                                    />
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <h4 className="text-lg font-semibold">
                                                    {prestation.marque}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {prestation.modele}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-400">
                                        {prestation.description}
                                    </p>
                                    <div className="mb-4 flex items-center">
                                        <span className="mr-2 rounded bg-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-800 dark:text-green-300">
                                            {prestation.kilometrage} Km/h
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <StyledDataGrid
                        columns={[
                            { accessorKey: 'nom', header: 'Libellé' },
                            {
                                accessorKey: 'description',
                                header: 'Description',
                            },
                        ]}
                        data={prestations}
                        actionUrl={route(route().current())}
                        pdfUrl={'prestation.pdf'}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default index;
