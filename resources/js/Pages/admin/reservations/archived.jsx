import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import StyledDataGrid from '@/Components/StyledDataGrid'; // Importation de la table générique
import { Input } from '@/components/ui/input';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { MoreHorizSharp, TableView } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import { SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

const index = ({ archivedReservations }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [gridView, setGridView] = useState(false);
    const toggleGridView = () => {
        setItemsPerPage(gridView ? 5 : 8);
        setGridView(!gridView);
    };

    return (
        <AdminLayout
            header={
                <MyHeader
                    title="Véhicules"
                    breadcrumbItems={[
                        { label: 'Accueil', href: '/' },
                        { label: 'Véhicules' },
                    ]}
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
                            <div className="flex items-center overflow-hidden rounded-md border bg-gray-50 pr-2 dark:bg-gray-800">
                                <Input
                                    className="border-none bg-gray-50 p-2 focus:border-none dark:bg-gray-800"
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
                                    router.get(
                                        '/admin/archivedReservations/create',
                                    )
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
                {/* Affichage de la grille ou du tableau */}
                {gridView ? (
                    <Grid container spacing={2}>
                        {archivedReservations.data.map((reservation, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                lg={6}
                                key={index}
                                className="min-h-full"
                            >
                                <div className="flex min-h-full flex-col justify-between rounded-lg bg-white p-4 shadow dark:bg-gray-800 dark:text-gray-300">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <h4 className="text-lg font-semibold">
                                                    {reservation.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {reservation.ref}
                                                </p>
                                            </div>
                                        </div>
                                        <PrimaryButton className="bg-transparent p-0 shadow-none hover:bg-transparent">
                                            <MoreHorizSharp className="text-gray-500" />
                                        </PrimaryButton>
                                    </div>
                                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-400">
                                        {reservation.description}
                                    </p>
                                    <div className="mb-4 flex items-center">
                                        <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300">
                                            On Progress
                                        </span>
                                        <span className="ml-auto text-sm text-red-500">
                                            Due date:{' '}
                                            {reservation.datee || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                            dev web
                                        </span>
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <StyledDataGrid
                        columns={[
                            { accessorKey: 'user.nom', header: 'Client' },
                            {
                                accessorKey: 'vehicule.marque',
                                header: 'Voiture',
                            },
                            { accessorKey: 'motif', header: 'Motif' },
                            {
                                accessorKey: 'type_voyage',
                                header: 'Type de voyage',
                            },
                            {
                                accessorKey: 'date_depart',
                                header: 'Date de départ',
                            },
                            {
                                accessorKey: 'date_retour',
                                header: 'Date de retour',
                            },
                            {
                                accessorKey: 'status',
                                header: 'Status',
                                cell: (props) => {
                                    return (
                                        <>
                                            {props.getValue() ==
                                                'confirmée' && (
                                                <span className="me-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                                    {props.getValue()}
                                                </span>
                                            )}

                                            {props.getValue() ==
                                                'en attente' && (
                                                <span className="me-2 rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                    {props.getValue()}
                                                </span>
                                            )}
                                        </>
                                    );
                                },
                            },
                        ]}
                        data={archivedReservations}
                        filterableColumns={['motif', 'label', 'assignedTo']}
                        actionUrl={route(route().current())}
                        pdfUrl={'reservation.pdf'}
                        toggleStatusUrl={'admin.archivedReservations.approve'}
                        // approveBtnShow={true}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default index;
