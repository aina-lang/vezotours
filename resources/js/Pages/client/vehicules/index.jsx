import ConfirmModal from '@/Components/ConfirmModal';
import { CustomToolbar } from '@/Components/CustomToolBar';
import MyHeader from '@/Components/Header';
import PrimaryButton from '@/Components/PrimaryButton';
import StyledDataGrid  from '@/Components/StyledDataGrid';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { frFR } from '@/constants/local';

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreHorizSharp, PictureAsPdf, TableView } from '@mui/icons-material';
import {
    Box,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Pagination,
    Typography,
} from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import {
    CheckIcon,
    DeleteIcon,
    EditIcon,
    GridIcon,
    SearchIcon,
} from 'lucide-react';

import React, { useState } from 'react';

function Index({ vehicules }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [gridView, setGridView] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const { delete: deleteRequest } = useForm();
    const filteredVehicules = vehicules.filter((vehicule) => {
        const searchableText =
            `${vehicule.reference} ${vehicule.label} ${vehicule.assignedTo}`.toLowerCase();
        return searchableText.includes(searchQuery.toLowerCase());
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [contextMenu, setContextMenu] = useState(null);
    const paginatedVehicules = filteredVehicules.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );
    const handleEdit = (row, event) => {
        // event.current.stopPropagation();
        console.log('Edit', row);
        // Logique pour modifier l'élément
        router.get(`vehicules/${row.id}/edit/`);
    };

    console.log(vehicules);
    const [currentFocusRow, setCureentFocusRow] = useState(null);

    const handleDelete = (row) => {
        setCureentFocusRow(row);
        setDialogOpen(true);
        // console.log("Delete", row);
    };

    const handleConfirmDelete = () => {
        console.log(currentFocusRow.id);
        deleteRequest(`/vehicules/delete/${currentFocusRow.id}`, {
            onSuccess: () => {
                console.log('yes');
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
        setDialogOpen(false);
    };

    const handleExportPDF = (row) => {
        console.log('Export PDF', row);
        window.open(route('vehicule.pdf', row.id), '_blank');
    };

    // Handle right-click on the row
    const handleRowRightClick = (event, row) => {
        event.preventDefault(); // Prevent the default context menu
        setSelectedRow(row);
        setContextMenu({
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const SelectionStatus = ({ selectedRows }) => {
        const count = selectedRows.length;
        const label =
            count === 1 ? 'Ligne sélectionnée' : 'Lignes sélectionnées';

        return (
            <Typography className="text-gray-500">
                {count} {label}
            </Typography>
        );
    };

    const toggleGridView = () => {
        if (gridView === false) {
            setItemsPerPage(8);
        } else {
            setItemsPerPage(5);
        }
        setGridView(!gridView);
    };

    const arrayfields = {
        id: { checked: true },
        marque: { checked: true },
        modele: { checked: true },
        immatriculation: { checked: true },
        categorie: { checked: true },
        prix_journalier: { checked: true },
        kilometrage: { checked: true },
        description: { checked: true },
        disponibilite: { checked: true },
    };

    // Fonction pour générer les colonnes du DataGrid
    const generateColumns = (fields) => {
        return Object.keys(fields)
            .map((key) => {
                const field = fields[key];
                console.log(fields['id'].value);
                switch (key) {
                    case 'marque':
                        return {
                            field: 'marque',
                            headerName: 'Marque',
                            width: 150,
                            renderCell: (params) => (
                                <Link
                                    href={'/admin/vehicules/' + params.row.id}
                                    className="flex h-full items-center text-sm"
                                >
                                    {params.value || 'N/A'}
                                </Link>
                            ),
                        };
                    case 'modele':
                        return {
                            field: 'modele',
                            headerName: 'Modèle',
                            width: 150,
                            renderCell: (params) => (
                                <p className="flex h-full items-center text-sm">
                                    {params.value || 'N/A'}
                                </p>
                            ),
                        };
                    case 'immatriculation':
                        return {
                            field: 'immatriculation',
                            headerName: 'Immatriculation',
                            width: 180,
                            renderCell: (params) => (
                                <p className="flex h-full items-center text-sm">
                                    {params.value || 'N/A'}
                                </p>
                            ),
                        };
                    case 'categorie':
                        return {
                            field: 'categorie',
                            headerName: 'Catégorie',
                            width: 150,
                            renderCell: (params) => (
                                <p className="flex h-full items-center text-sm">
                                    {params.value.nom || 'N/A'}
                                </p>
                            ),
                        };
                    case 'prix_journalier':
                        return {
                            field: 'prix_journalier',
                            headerName: 'Prix Journalier',
                            width: 150,
                            renderCell: (params) => (
                                <p className="flex h-full items-center text-sm">
                                    {params.value
                                        ? `${params.value} Ar`
                                        : 'N/A'}
                                </p>
                            ),
                        };
                    case 'kilometrage':
                        return {
                            field: 'kilometrage',
                            headerName: 'Kilométrage',
                            width: 150,
                            renderCell: (params) => (
                                <p className="flex h-full items-center text-sm">
                                    {params.value
                                        ? `${params.value} km/h`
                                        : 'N/A'}
                                </p>
                            ),
                        };
                    case 'description':
                        return {
                            field: 'description',
                            headerName: 'Description',
                            width: 200,
                            renderCell: (params) => (
                                <p className="flex h-full items-center truncate text-sm">
                                    {params.value || 'N/A'}
                                </p>
                            ),
                        };
                    case 'disponibilite':
                        return {
                            field: 'disponible',
                            headerName: 'Disponibilité',
                            width: 200,
                            renderCell: (params) => {
                                const isAvailable = params.value; // Assuming params.value is a boolean

                                return (
                                    <div className="flex h-full items-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                                isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {isAvailable ? 'Oui' : 'Non'}
                                        </span>
                                    </div>
                                );
                            },
                        };
                    default:
                        return null;
                }
            })
            .filter((column) => column !== null);
    };

    const columns = generateColumns(arrayfields);

    columns.unshift({
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        sortable: false,
        renderCell: (params) => (
            <div className="flex h-full w-full space-x-2 text-sm">
                {params.row.status != 'confirmée' && (
                    <>
                        <IconButton
                            aria-label="edit"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon size={18} />
                        </IconButton>
                        <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => handleDelete(params.row)}
                        >
                            <DeleteIcon size={20} />
                        </IconButton>
                    </>
                )}
                <IconButton
                    aria-label="pdf"
                    color="info"
                    onClick={() => handleExportPDF(params.row)}
                >
                    <PictureAsPdf sx={{ width: 20 }} />
                </IconButton>
            </div>
        ),
    });

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
                        <div className="flex space-x-4 py-5">
                            {/* Un button grid view et table view */}
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
                                    router.get('/admin/vehicules/create')
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
                        {paginatedVehicules.map((Vehicule, index) => (
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
                                                    {Vehicule.title}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {Vehicule.ref}
                                                </p>
                                            </div>
                                        </div>
                                        <PrimaryButton className="bg-transparent p-0 shadow-none hover:bg-transparent">
                                            <MoreHorizSharp className="text-gray-500" />
                                        </PrimaryButton>
                                    </div>

                                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-400">
                                        {Vehicule.description}
                                    </p>

                                    <div className="mb-4 flex items-center">
                                        <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300">
                                            On Progress
                                        </span>
                                        <span className="ml-auto text-sm text-red-500">
                                            Due date:{' '}
                                            {Vehicule.datee
                                                ? Vehicule.datee
                                                : 'N/A'}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        {/* {Vehicule?.categories.map((tag, idx) => ( */}
                                        <span
                                            // key={idx}
                                            className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                        >
                                            {/* {tag} */}
                                            dev web
                                        </span>
                                        {/* ))} */}
                                    </div>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <div
                        style={{ minHeight: 300, width: '100%' }}
                        className="overflow-hidden rounded-md bg-white p-5 shadow-lg"
                    >
                        <StyledDataGrid
                            localeText={frFR}
                            slots={{
                                toolbar: () => <CustomToolbar />,
                            }}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
                            }}
                            hideFooterPagination
                            hideFooter
                            rows={paginatedVehicules}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                            onRowSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = vehicules.filter((row) =>
                                    selectedIDs.has(row.id),
                                );
                                console.log(selectedIDs);
                                setSelectedRows(selectedRows);
                            }}
                            rowSelection
                            rowSelectionModel={selectedRows.map(
                                (row) => row.id,
                            )} // Reflects the selected rows by ID
                            getRowId={(row) => row.id}
                            onRowContextMenu={(params, event) =>
                                handleRowRightClick(event, params.row)
                            }
                        />

                        <Menu
                            open={contextMenu !== null}
                            onClose={handleCloseContextMenu}
                            anchorReference="anchorPosition"
                            anchorPosition={
                                contextMenu !== null
                                    ? {
                                          top: contextMenu.mouseY,
                                          left: contextMenu.mouseX,
                                      }
                                    : undefined
                            }
                            onClick={handleCloseContextMenu}
                        >
                            <MenuItem
                                onClick={() =>
                                    console.log(
                                        `Edit ${selectedRow?.firstName}`,
                                    )
                                }
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() =>
                                    console.log(
                                        `Delete ${selectedRow?.firstName}`,
                                    )
                                }
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                        {/* Action Buttons */}
                        {/* {selectedRows.length > 0 && ( */}
                        <Box
                            sx={{
                                mt: 2,
                                p: selectedRows.length > 0 ? 2 : 0,
                                backgroundColor: '#f5f5f5',
                                borderRadius: '8px',
                                height: selectedRows.length > 0 ? 'auto' : 0,
                                // Slight scaling for smooth effect
                                overflow: 'hidden',
                                transition:
                                    'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease', // Smooth transition for all effects
                            }}
                            className="flex items-center justify-between"
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded border border-indigo-500 bg-white px-4 py-2 text-indigo-500">
                                    Actions en masse
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    // style={{ boxShadow: "none" }}
                                    className="w-48 border-none bg-white shadow-lg"
                                >
                                    <DropdownMenuLabel className="font-bold text-gray-900">
                                        Actions en masse
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            handleEdit(selectedRows);
                                        }}
                                        className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <EditIcon className="mr-2 text-blue-500" />
                                        Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            handleDelete(selectedRows);
                                        }}
                                        className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <DeleteIcon className="mr-2 text-red-500" />
                                        Supprimer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            /* Add your handler here */
                                        }}
                                        className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <CheckIcon className="mr-2 text-green-500" />
                                        Valider
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            /* Add your handler here */
                                        }}
                                        className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <PictureAsPdf className="mr-2 text-gray-500" />
                                        Générer PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <SelectionStatus selectedRows={selectedRows} />
                        </Box>
                    </div>
                )}
                <Pagination
                    count={Math.ceil(filteredVehicules.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                    className="dark:text-gray-300"
                    lang="fr"
                    // title="nombre des pages"
                />{' '}
            </div>

            <ConfirmModal
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => handleConfirmDelete()}
                title="Confirmer la suppresion"
                content="Êtes-vous sûr de vouloir supprimer ce véhicule ?"
            />
        </AdminLayout>
    );
}

export default Index;
