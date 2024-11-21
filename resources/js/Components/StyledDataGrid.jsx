import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { router, useForm } from '@inertiajs/react';
import {
    CheckCircleOutline,
    ChevronLeft,
    ChevronRight,
    Download,
    PictureAsPdf,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronUp,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Ellipsis,
    FilterIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';

const StyledDataGrid = ({
    columns,
    data,
    actionUrl,
    pdfUrl,
    toggleStatusUrl,
    approveBtnShow,
    FilterComponent,
}) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState(data.current_page);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentFocusRow, setCurrentFocusRow] = useState(null);
    const {
        delete: deleteRequest,
        post,
        data: formData,
        setData,
    } = useForm({ idsToApprove: [], idsToDelete: [] });
    const { paletteName } = useThemeContext();
    const currentPalette = palette[paletteName];

    const handleEdit = (row) => {
        if (row.original) {
            router.visit(`${actionUrl}/${row.original.id}/edit/`);
        } else {
            console.error('Row or ID is undefined');
        }
    };

    const handleDelete = (row) => {
        if (row.original) {
            setCurrentFocusRow(row.original);
            setDialogOpen(true);
        } else {
            console.error('Row is undefined');
        }
    };

    const handleConfirmDelete = () => {
        if (currentFocusRow?.id) {
            deleteRequest(`${actionUrl}/${currentFocusRow.id}`, {
                onSuccess: () => {
                    console.log('Deleted:', currentFocusRow.id);
                    setDialogOpen(false);
                    // Optionally refresh the table data
                },
                onError: (errors) => console.error(errors),
            });
        } else {
            console.error('Current focus row ID is undefined');
        }
    };

    const handleExportPDF = (row) => {
        if (row.original) {
            window.open(route(`${pdfUrl}`, row.original.id), '_blank');
        } else {
            console.error('Row or ID is undefined');
        }
    };

    const handleExportCSV = () => {
        const csvRows = [];
        const headers = columns.map((col) => col.id);
        csvRows.push(headers.join(','));

        data.data.forEach((row) => {
            const values = headers.map((header) => {
                const cellValue = row[header] !== undefined ? row[header] : '';
                return `"${cellValue}"`;
            });
            csvRows.push(values.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleApprove = (row) => {
        console.log(row);
        post(route(`${toggleStatusUrl}`, row.original.id));
    };

    const handleConfirmBulkDelete = () => {
        if (selectedRows.length > 0) {
            // console.log(idsToDelete);
            post(
                `${actionUrl}/bulk-delete`,
                // { data: { ids: idsToDelete } }, // Objet JSON envoyé au backend
                {
                    onSuccess: () => {
                        console.log(
                            'Suppression réussie pour les IDs :',
                            formData.idsToDelete,
                        );
                        setDialogOpen(false);
                        table.toggleAllRowsSelected(false);
                    },
                    onError: (errors) => console.error(errors),
                },
            );
        } else {
            console.error('Aucune ligne sélectionnée pour la suppression.');
        }
    };

    const handleApproveMany = () => {
        const idsToApprove = selectedRows.map((row) => row.original.id);

        post(`${actionUrl}/bulk-approve`, {
            formData: JSON.stringify({ ids: idsToApprove }),

            onSuccess: () => {
                console.log(
                    'Approbation réussie pour les lignes :',
                    idsToApprove,
                );
                table.toggleAllRowsSelected(false);
                // Optionnel : Rafraîchir les données après l'approbation
            },
            onError: (errors) =>
                console.error("Erreur d'approbation :", errors),
        });
    };

    const handleBulkAction = (action, row) => {
        console.log(row);
        if (row) {
            // const row = selectedRows[0];
            switch (action) {
                case 'edit':
                    handleEdit(row);
                    break;
                case 'delete':
                    handleDelete(row);
                    break;
                case 'pdf':
                    handleExportPDF(row);
                    break;
                case 'approve':
                    handleApprove(row);
                    break;
                default:
                    console.log('Unknown action');
            }
        } else if (selectedRows.length > 1) {
            switch (action) {
                case 'delete':
                    console.log('Deleting rows:', selectedRows);

                    setDialogOpen(true);
                    break;

                    console.log('Generating PDF for rows:', selectedRows);
                    break;
                case 'approve':
                    handleApproveMany();
                    break;
                default:
                    console.log('Unknown action');
            }
        } else {
            console.log('No rows selected.');
        }
    };

    const selectableColumns = [
        {
            id: 'select',
            header: ({ table }) => (
                <input
                    className="rounded-sm border-gray-300 dark:border-none"
                    style={{
                        backgroundColor: table.getIsAllRowsSelected()
                            ? currentPalette[500]
                            : 'white',
                    }}
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={() => table.toggleAllRowsSelected()}
                />
            ),
            cell: ({ row }) => (
                <input
                    className="rounded-sm border-gray-300 dark:border-none"
                    type="checkbox"
                    style={{
                        backgroundColor: row.getIsSelected()
                            ? currentPalette[500]
                            : 'white',
                    }}
                    checked={row.getIsSelected()}
                    onChange={() => row.toggleSelected()}
                />
            ),
        },
        ...columns,
        {
            id: 'actions',
            header: ({ table }) => <div>Actions</div>,
            cell: ({ row }) => (
                <div
                    sx={{ borderRadius: '8px' }}
                    className="flex items-center justify-between"
                >
                    <DropdownMenu
                        // open={dropdownOpen}
                        className=""
                        // onOpenChange={setDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <IconButton
                                onClick={() => {
                                    // setDropdownOpen(!dropdownOpen);
                                    setSelectedRow(row);
                                }}
                            >
                                <Ellipsis />
                            </IconButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-white">
                            {/* <DropdownMenuLabel className="font-bold text-gray-900">
                                Actions
                            </DropdownMenuLabel> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleBulkAction('edit', row)}
                                className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <EditIcon className="mr-2 text-blue-500" />
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleBulkAction('delete', row)}
                                className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <DeleteIcon className="mr-2 text-red-500" />
                                Supprimer
                            </DropdownMenuItem>
                            {approveBtnShow && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleBulkAction('approve', row)
                                    }
                                    className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {row.original.status == 'en attente' && (
                                        <>
                                            <CheckCircleOutline className="mr-2 text-green-500" />
                                            Approuver
                                        </>
                                    )}
                                    {row.original.status == 'confirmée' && (
                                        <>
                                            <CheckCircleOutline className="mr-2 text-green-500" />
                                            Mettre en attente
                                        </>
                                    )}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => handleBulkAction('pdf', row)}
                                className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <PictureAsPdf className="mr-2 text-gray-500" />
                                Générer PDF
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const handleResetVisibility = () => {
        const defaultVisibility = columns.reduce((acc, column) => {
            acc[column.id] = true; // or false based on your default preference
            return acc;
        }, {});
        setColumnVisibility(defaultVisibility);
        // Optionally, reset the columns in the table as well
        columns.forEach((column) => column.toggleVisibility(true)); // or false based on default
    };

    const table = useReactTable({
        data: data?.data || [],
        columns: selectableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: (newRowSelection) => {
            console.log(table.getSelectedRowModel().rows);
            setRowSelection(newRowSelection);
            setSelectedRows(table.getSelectedRowModel().rows);
        },

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        setSelectedRows(selectedRows);

        // Mettre à jour les IDs à supprimer avec les lignes sélectionnées
        const ids = selectedRows.map((row) => row.original.id);

        setData('idsToApprove', ids);
        setData('idsToDelete', ids);
    }, [rowSelection]); // Assurez-vous qu

    useEffect(() => {
        setCurrentPage(data.current_page);
    }, [data]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= data.last_page) {
            // Update current page and fetch new data
            setCurrentPage(page);
            // Fetch data from the server, e.g., using Inertia.js
            router.get(`${actionUrl}?page=${page}`);
        }
    };

    return (
        <div className="w-full overflow-hidden rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 border">
            {/* Filter bar */}
            <div className="flex items-center justify-between space-x-4 rounded-lg p-3">
                {/* Column visibility dropdown */}
                <DropdownMenu className="ml-auto rounded-md border shadow-lg">
                    <DropdownMenuTrigger asChild>
                        <button className="flex transform items-center space-x-2 rounded-md bg-white p-2 px-3 text-gray-700 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-200">
                            <span>Colonnes</span>
                            <ChevronDown className="h-4 w-4 text-gray-600" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-md bg-white p-3 text-gray-700 shadow-lg">
                        <button
                            onClick={handleResetVisibility}
                            className="flex w-full items-center px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            Réinitialiser
                        </button>
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="flex w-full space-x-8 capitalize text-gray-700"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value, e) => {
                                        // e.preventDefault()
                                        setColumnVisibility((prev) => ({
                                            ...prev,
                                            [column.id]: value,
                                        }));
                                        column.toggleVisibility(value);
                                    }}
                                >
                                    <span className="flex-grow p-1">
                                        {column.id}
                                    </span>
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Export CSV button */}
                <DropdownMenu className="ml-4 rounded-md border shadow-lg">
                    <DropdownMenuTrigger asChild>
                        <button className="flex transform items-center space-x-2 rounded-md bg-white p-2 px-3 text-gray-700 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-200">
                            <span>Export</span>
                            <Download className="h-4 w-4 text-gray-600" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-md bg-white p-3 text-gray-700 shadow-lg"
                    >
                        <DropdownMenuItem
                            onClick={handleExportCSV}
                            className="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                            <Download className="mr-2" /> Exporter vers CSV
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {FilterComponent && (
                    <div className="flex flex-grow items-center justify-end space-x-4">
                        <FilterIcon className="text-gray-500" />
                        <FilterComponent className="flex-grow" />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="rounded-lg p-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border-t border-b  p-4 text-left text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                        >
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer flex items-center'
                                                            : '',
                                                    onClick:
                                                        header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                                {header.column.getIsSorted() && (
                                                    <span className="ml-2">
                                                        {header.column.getIsSorted() ===
                                                        'asc' ? (
                                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={`w-full hover:bg-gray-100 ${row.getIsSelected() ? 'bg-blue-100' : ''}`}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="border-t border-gray-200 p-4 text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center text-gray-400"
                                    >
                                        Aucun résultat trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Data from Laravel */}
            <div className="mb-5 flex items-center justify-between rounded-lg dark:bg-gray-800">
                {selectedRows.length >1 && (
                    <DropdownMenu className="rounded-md border border-gray-400 shadow-lg">
                        <DropdownMenuTrigger className="rounded-md border bg-white p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            Actions en masse
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white p-3 text-gray-700 dark:bg-gray-800">
                            <DropdownMenuLabel className="font-bold text-gray-900 dark:text-gray-200">
                                Actions en masse
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem
                                onClick={() => handleBulkAction('edit')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <EditIcon className="mr-2 text-blue-500" />{' '}
                                Modifier
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                onClick={() => handleBulkAction('delete')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <DeleteIcon className="mr-2 text-red-500" />{' '}
                                Supprimer
                            </DropdownMenuItem>
                            {approveBtnShow && (
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('approve')}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    <CheckCircleOutline className="mr-2 text-green-500" />{' '}
                                    Approuver
                                </DropdownMenuItem>
                            )}
                            {/* <DropdownMenuItem
                                onClick={() => handleBulkAction('pdf')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <PictureAsPdf className="mr-2 text-gray-500" />{' '}
                                Générer PDF
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <div className="flex items-center space-x-2">
                    {/* Previous Page Button */}
                    <button
                        disabled={data.current_page === 1}
                        onClick={() => handlePageChange(data.current_page - 1)}
                        className="rounded-full bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Current Page Indicator */}
                    <button
                        style={{
                            background: ` linear-gradient(to right, ${currentPalette[600]}, ${currentPalette[500]})`,
                        }}
                        className="rounded-full px-4 py-2 text-white shadow-lg transition-shadow duration-200"
                    >
                        {data.current_page}
                    </button>

                    {/* Next Page Button */}
                    <button
                        disabled={data.current_page === data.last_page}
                        onClick={() => handlePageChange(data.current_page + 1)}
                        className="rounded-full bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <span className="text-sm text-gray-500">
                    {data.from} à {data.to} de {data.total} ligne(s)
                </span>
            </div>

            <ConfirmModal
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={
                    selectedRows.length < 1
                        ? handleConfirmDelete
                        : handleConfirmBulkDelete
                }
                title="Confirmer la suppression"
                content="Êtes-vous sûr de vouloir supprimer ce véhicule ?"
            />
        </div>
    );
};

export default StyledDataGrid;
