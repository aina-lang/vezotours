import MyHeader from '@/Components/Header';
import StyledDataGrid from '@/Components/StyledDataGridForDashboard';
import UserTooltip from '@/Components/UserTooltip';
import ClientLayout from '@/Layouts/ClientLayout';
import { Head } from '@inertiajs/react';
import {
   AdminPanelSettingsOutlined,
    CarRentalSharp,
} from '@mui/icons-material';
import { Link } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { CarIcon } from 'lucide-react';

const chartSetting = {
    yAxis: [
        {
            label: 'rainfall (mm)',
        },
    ],
    width: 400,
    height: 300,
    // sx: {
    //     [`.${axisClasses.left} .${axisClasses.label}`]: {
    //         transform: 'translate(-20px, 0)',
    //     },
    // },
};

const valueFormatter = (value) => `${value} unités`;

export default function Dashboard({
    totalCars,
    totalReservations,
    totalUsers,
    rentedCarsPercentage,
    availableCarsPercentage,
    monthlyData,
    mostRentedCars,
    upcomingReservations, // Ajout de la propriété pour les réservations à venir
}) {
    console.log(route(route().current()));
    return (
        <ClientLayout
            header={<MyHeader title="Tableau de Bord" breadcrumbItems={[]} />}
        >
            <Head title="Tableau de Bord" />

            <div className="flex-grow p-4 text-gray-500">
                {/* Section des Cartes */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <Card
                        title="Total de Voitures"
                        value={totalCars}
                        icon={<CarIcon className="text-white" />}
                        color="bg-gradient-to-tr from-blue-500 to-blue-300 shadow-blue-200 shadow-lg dark:shadow-black/30"
                    />
                    <Card
                        title="Réservations"
                        value={totalReservations}
                        icon={<CarRentalSharp className="text-white" />}
                        color="bg-gradient-to-tr from-green-500 to-green-300 shadow-green-200 shadow-lg dark:shadow-black/30"
                    />
                    <Card
                        title="Utilisateurs"
                        value={totalUsers}
                        icon={
                            <AdminPanelSettingsOutlined className="text-white" />
                        }
                        color="bg-gradient-to-tr from-orange-500 to-orange-300 shadow-orange-200 shadow-lg dark:shadow-black/30"
                    />
                    <Card
                        title="Voitures Louées (%)"
                        icon={<CarRentalSharp className="text-white" />}
                        color="bg-gradient-to-tr from-pink-500 to-pink-300 shadow-pink-200 shadow-lg dark:shadow-black/30"
                    />
                </div>

                <div className="mt-16 flex w-full space-x-4">
                    {/* Section des Réservations à Venir */}
                    <div className="w-3/5 rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Réservations à Venir
                        </h2>
                        <StyledDataGrid
                            columns={[
                                {
                                    accessorKey: 'user.nom',
                                    header: 'Client',
                                    cell: (props) => (
                                        <UserTooltip
                                            user={props.row.original.user}
                                        />
                                    ),
                                },
                                {
                                    accessorKey: 'vehicule.marque',
                                    header: 'Voiture',
                                    cell: (props) => (
                                        <Link
                                            href={route(
                                                'admin.reservations.show',
                                                props.row.original.id,
                                            )}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {props.getValue()}
                                        </Link>
                                    ),
                                },
                                {
                                    accessorKey: 'date_depart',
                                    header: 'Date de Départ',
                                },
                                {
                                    accessorKey: 'date_retour',
                                    header: 'Date de Retour',
                                },
                                {
                                    accessorKey: 'status',
                                    header: 'Statut',
                                    cell: (props) => (
                                        <span
                                            className={`me-2 rounded px-2.5 py-0.5 text-xs font-medium ${
                                                props.getValue() === 'confirmée'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {props.getValue()}
                                        </span>
                                    ),
                                },
                            ]}
                            data={upcomingReservations} // Passer les données des réservations à venir ici
                        />
                    </div>

                    {/* Section pour le graphique */}
                    <div className="min-h-full flex-grow rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-4 text-xl font-semibold">
                            Distribution des Voitures
                        </h2>
                        <BarChart
                            dataset={monthlyData.map((value, index) => ({
                                id: index, // Assignation d'un id basé sur l'index
                                value, // Utilisation de la valeur de monthlyData
                                label: new Intl.DateTimeFormat('fr-FR', {
                                    month: 'long',
                                }).format(new Date(0, index)), // Formatage du mois
                            }))}
                            xAxis={[{ scaleType: 'band', dataKey: 'label' }]} // Utilisez 'label' comme dataKey pour l'axe X
                            series={[
                                {
                                    dataKey: 'value', // Assurez-vous que dataKey correspond à la valeur dans votre dataset
                                    label: 'Valeur mensuelle', // Titre de la série
                                    valueFormatter, // Utilisation du formatteur de valeur
                                },
                            ]}
                            {...chartSetting}
                        />
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}

const Card = ({ title, value, icon, color }) => (
    <div
        className={`relative space-x-4 rounded-lg bg-white p-4 py-8 pt-2 shadow-lg dark:bg-gray-800`}
    >
        <div
            className={`-top-5 h-16 w-16 ${color} absolute flex items-center justify-center rounded-xl`}
        >
            {icon}
        </div>
        <div className="flex justify-between text-3xl">
            <div className="flex-grow text-right">
                <h6 className="text-lg font-semibold">{title}</h6>
                <p className="text-3xl font-bold text-gray-600">{value}</p>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, chart }) => (
    <div className="w-2/3 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        <h6 className="mb-4 text-lg font-semibold">{title}</h6>
        {chart}
    </div>
);
