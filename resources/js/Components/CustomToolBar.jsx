import { Box } from '@mui/material'; // Assurez-vous d'importer Box si ce n'est pas déjà fait
import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarDensitySelector,
    GridToolbarExport,
} from '@mui/x-data-grid';

// Votre barre d'outils personnalisée
export const CustomToolbar = () => (
    <GridToolbarContainer sx={{ marginBottom: 2 }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector
            slotProps={{
                tooltip: {
                    title: 'Change density',
                },
            }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarExport
            slotProps={{
                tooltip: {
                    title: 'Export data',
                },
                button: {
                    variant: 'outlined',
                },
            }}
        />
    </GridToolbarContainer>
);