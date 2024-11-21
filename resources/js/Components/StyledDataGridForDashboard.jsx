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
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { delete: deleteRequest, post } = useForm();
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

    const handleBulkAction = (action, row) => {
        console.log(row);
        // if (selectedRows.length === 1) {
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

        if (selectedRows.length > 1) {
            switch (action) {
                case 'delete':
                    console.log('Deleting rows:', selectedRows);
                    // Open confirmation modal for bulk delete
                    setDialogOpen(true); // You may want to modify this for bulk deletion
                    break;
                case 'pdf':
                    console.log('Generating PDF for rows:', selectedRows);
                    break;
                default:
                    console.log('Unknown action');
            }
        } else {
            console.log('No rows selected.');
        }
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleButtonClick = (event) => {
        setAnchorEl(event.currentTarget); // Définit l'élément déclencheur comme ancre
        // Autres actions si nécessaires
    };

    const handleClose = () => {
        setAnchorEl(null); // Ferme le menu
    };

    const open = Boolean(anchorEl);
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
        <div className="relative w-full rounded-lg bg-white p-2 dark:bg-gray-800">
            {/* Filter bar */}
            <div className="flex items-center justify-between space-x-4 py-4">
                <div
                // className="absolute -top-4 rounded-md p-5 text-white shadow-lg bg-neutral-800"
                // style={{
                //     background: `linear-gradient(to right, ${currentPalette[600]}, ${currentPalette[500]})`,
                // }}
                >
                    Dernier reservation
                </div>
                {/* Column visibility dropdown */}
                <div className="flex space-x-2">
                    {' '}
                    <DropdownMenu className="ml-auto border shadow-md">
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center rounded-sm border border-gray-200 bg-white p-2 py-1 text-gray-500 dark:border-none dark:bg-gray-800">
                                Colonnes{' '}
                                <ChevronDown className="ml-5 h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 rounded-md bg-white p-2 text-gray-500 shadow-md">
                            <button
                                onClick={handleResetVisibility}
                                className="mb-2 flex w-full justify-start text-gray-700 hover:bg-gray-200"
                            >
                                Reinitialiser
                            </button>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="flex w-full space-x-4 capitalize text-gray-700"
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
                    <DropdownMenu className="ml-auto border shadow-md">
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center rounded-sm border border-gray-200 bg-white p-2 py-1 text-gray-500 dark:border-none dark:bg-gray-800">
                                Export <Download className="ml-5 h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="min-w-52 rounded-md bg-white p-2 text-gray-500 shadow-md"
                        >
                            <DropdownMenuItem
                                onClick={handleExportCSV}
                                className="flex cursor-pointer items-center"
                            >
                                <Download className="mr-2" /> Exporter vers CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {FilterComponent && (
                    <div className="flex flex-grow items-center justify-end space-x-4">
                        <FilterIcon className="text-gray-500" />
                        <FilterComponent className="flex-grow" />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="mb-4 min-h-56 overflow-x-auto overflow-y-hidden dark:bg-gray-800">
                <table className="min-w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border-b border-t p-4 text-left text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                                    >
                                        {/* Sortable header */}
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
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                            {/* Sorting indicator */}
                                            {header.column.getIsSorted() ? (
                                                header.column.getIsSorted() ===
                                                'asc' ? (
                                                    <ChevronUp className="ml-2 h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                                )
                                            ) : null}
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
                                    className={`w-full hover:bg-gray-100 dark:hover:bg-gray-50/10 ${row.getIsSelected() ? 'bg-gray-200 dark:bg-gray-500/10' : ''}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="border-t border-gray-200 p-3 text-sm text-gray-700 dark:border-gray-900"
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
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Data from Laravel */}
            <div className="mb-5 flex items-center justify-between rounded-sm p-4 dark:border-none dark:bg-gray-800">
                {selectedRows.length > 0 && (
                    <div
                        sx={{ borderRadius: '8px' }}
                        className="flex items-center justify-between"
                    >
                        <DropdownMenu className="border border-gray-400">
                            <DropdownMenuTrigger className="rounded border px-4 py-2 text-gray-500 dark:border-none dark:border-gray-500">
                                Actions en masse
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-48 border-none bg-white shadow-lg">
                                <DropdownMenuLabel className="font-bold text-gray-900">
                                    Actions en masse
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('edit')}
                                    className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <EditIcon className="mr-2 text-blue-500" />
                                    Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('delete')}
                                    className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <DeleteIcon className="mr-2 text-red-500" />
                                    Supprimer
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('approve')}
                                    className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <CheckCircleOutline className="mr-2 text-green-500" />
                                    Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleBulkAction('pdf')}
                                    className="flex items-center bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <PictureAsPdf className="mr-2 text-gray-500" />
                                    Générer PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                <div className="flex items-center space-x-2">
                    {/* Previous Page Button */}
                    <button
                        disabled={data.current_page === 1}
                        onClick={() => handlePageChange(data.current_page - 1)}
                        className="flex items-center justify-center rounded-full bg-gray-200 px-2 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-2 w-2" />
                    </button>

                    {/* Current Page Indicator */}
                    <button
                        style={{
                            background: `linear-gradient(to right, ${currentPalette[600]}, ${currentPalette[500]})`,
                        }}
                        className="rounded-full px-4 py-2 text-white shadow-lg transition-shadow duration-200"
                    >
                        {data.current_page}
                    </button>

                    {/* Next Page Button */}
                    <button
                        disabled={data.current_page === data.last_page}
                        onClick={() => handlePageChange(data.current_page + 1)}
                        className="flex items-center justify-center rounded-full bg-gray-200 px-2 py-2 text-gray-600 transition-colors duration-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <span className="text-sm text-gray-500">
                    {data.from} à {data.to} de {data.total} ligne(s)
                </span>
            </div>

            <ConfirmModal
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                content="Êtes-vous sûr de vouloir supprimer ce véhicule ?"
            />
        </div>
    );
};

export default StyledDataGrid;
