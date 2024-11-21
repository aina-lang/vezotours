import { Link, styled } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { User } from 'lucide-react';
import React from 'react';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        padding: theme.spacing(1), // Ajout de padding pour le contenu
    },
}));

const UserTooltip = ({ user }) => {
    return (
        <HtmlTooltip
            title={
                <div className="flex flex-col">
                    <div className="mb-1 flex items-center">
                        <User className="mr-2 text-blue-600 h-20" />
                        <strong>
                            {user.nom} {user.prenoms}
                        </strong>
                    </div>
                    <p>Email: {user.email}</p>
                    <p>Téléphone: {JSON.parse(JSON.parse(user.phones))}</p>
                </div>
            }
            arrow
        >
            <Link
                href={route('clients.show', user.id)} // Remplacez `1` par `user.id` pour rediriger vers le bon client
                className="text-blue-600 hover:underline"
            >
                {user.prenoms}
                {/* Affichez le nom et les prénoms de l'utilisateur */}
            </Link>
        </HtmlTooltip>
    );
};

export default UserTooltip;
