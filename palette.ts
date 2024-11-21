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