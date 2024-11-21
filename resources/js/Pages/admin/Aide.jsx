import MyHeader from '@/Components/Header';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Collapse, TextField, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

export default function Aide() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openManuals, setOpenManuals] = useState({});

    const handleToggle = (index) => {
        setOpenManuals(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const manuals = [
        {
            category: "Gestion des Utilisateurs",
            items: [
                { title: "Créer un nouvel utilisateur", content: "Pour ajouter un utilisateur, accédez à la section 'Utilisateurs' et cliquez sur 'Ajouter'." },
                { title: "Modifier les droits d'accès", content: "Accédez aux paramètres de l'utilisateur pour ajuster ses permissions et ses rôles." },
                // Add more items here...
            ]
        },
        {
            category: "Configuration du Système",
            items: [
                { title: "Paramètres de sécurité", content: "Dans 'Paramètres', vous pouvez configurer les préférences de sécurité pour l'ensemble du système." },
                { title: "Gestion des sauvegardes", content: "Accédez à 'Sauvegardes' pour planifier et gérer les copies de sauvegarde." },
                // Add more items here...
            ]
        },
        {
            category: "Rapports et Statistiques",
            items: [
                { title: "Générer un rapport", content: "Pour générer un rapport, accédez à 'Rapports' et choisissez les critères souhaités." },
                { title: "Analyser les statistiques de performance", content: "Dans 'Statistiques', vous trouverez des analyses détaillées de la performance." },
                // Add more items here...
            ]
        },
        // Add more categories and manuals here...
    ];

    const filteredManuals = manuals.map(category => ({
        ...category,
        items: category.items.filter(item => item.title.toLowerCase().includes(searchQuery) || item.content.toLowerCase().includes(searchQuery))
    })).filter(category => category.items.length > 0);

    return (
        <AdminLayout
            header={<MyHeader title="Aide" breadcrumbItems={[{ title: "Tableau de Bord", href: "/dashboard" }, { title: "Aide" }]} />}
        >
            <Head title="Aide" />

            <div className="p-6 text-gray-700">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Centre d'Aide</h1>
                
                <TextField 
                    variant="outlined"
                    placeholder="Rechercher dans les manuels..."
                    fullWidth
                    onChange={handleSearchChange}
                    className="mb-6"
                />

                {filteredManuals.map((category, catIndex) => (
                    <div key={catIndex} className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h2>
                        {category.items.map((item, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg mb-4">
                                <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handleToggle(`${catIndex}-${index}`)}>
                                    <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                                    <IconButton size="small">
                                        {openManuals[`${catIndex}-${index}`] ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                </div>
                                <Collapse in={openManuals[`${catIndex}-${index}`]}>
                                    <div className="p-4 border-t border-gray-200 text-gray-600">
                                        {item.content}
                                    </div>
                                </Collapse>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
