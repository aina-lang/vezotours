import MyHeader from '@/Components/Header';
import StyledDataGrid from '@/Components/StyledDataGridForDashboard';
import UserTooltip from '@/Components/UserTooltip';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { AdminPanelSettingsOutlined, CarRentalSharp } from '@mui/icons-material';
import { Link } from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import { CarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const chartSetting = {
    yAxis: [
        {
            label: 'Réservations',
        },
    ],
    height: 300,
};

const Card = ({ title, value, icon, color }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const incrementCount = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount < value) {
                    return prevCount + 1;
                }
                clearInterval(incrementCount);
                return value;
            });
        }, 10);
        return () => clearInterval(incrementCount);
    }, [value]);

    return (
        <motion.div
            className={`relative space-x-4 rounded-lg bg-white p-4 py-8 pt-2 shadow-sm dark:bg-gray-800 border`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        >
            <div
                className={`-top-5 h-16 w-16 ${color} absolute flex items-center justify-center rounded-xl`}
            >
                {icon}
            </div>
            <div className="flex justify-between text-3xl">
                <div className="flex-grow text-right">
                    <h6 className="text-lg font-semibold">{title}</h6>
                    <p className="text-3xl font-bold text-gray-600">{count}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default function Dashboard({
    totalArchive,
    totalCars,
    totalReservations,
    totalUsers,
    totalConfirmedReservations,
    totalPendingReservations,
    totalCancelledReservations,
    totalRentedCars,
    totalAvailableCars,
    monthlyData,
    upcomingReservations,
    nextReservation,
}) {
    return (
        <AdminLayout
            header={<MyHeader title="Tableau de Bord" breadcrumbItems={[]} />}
        >
            <Head title="Tableau de Bord" />
            <div className="flex-grow p-4 text-gray-500">
                <div className="grid grid-cols-4 gap-4">
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
                        title="Total Archive"
                        value={totalArchive}
                        icon={
                            <AdminPanelSettingsOutlined className="text-white" />
                        }
                        color="bg-gradient-to-tr from-orange-500 to-orange-300 shadow-orange-200 shadow-lg dark:shadow-black/30"
                    />
                </div>

                {/* Section des Cartes */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
                    <motion.div
                        className="rounded-lg bg-white p-4 shadow-md border"
                        initial={{ opacity: 0, x: -200 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                    >
                        <h2 className="mb-4 text-xl font-semibold">
                            Répartition des Réservations
                        </h2>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        {
                                            id: 'confirmées',
                                            value: totalConfirmedReservations,
                                            label: 'Confirmées',
                                        },
                                        {
                                            id: 'en attente',
                                            value: totalPendingReservations,
                                            label: 'En attente',
                                        },
                                        {
                                            id: 'autres',
                                            value:
                                                totalReservations -
                                                (totalConfirmedReservations +
                                                    totalPendingReservations),
                                            label: 'Autres',
                                        },
                                    ],
                                },
                            ]}
                            height={300}
                        />
                    </motion.div>

                    <motion.div
                        className="rounded-lg bg-white p-4 shadow-md border"
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                    >
                        <h2 className="mb-4 text-xl font-semibold">
                            Répartition des Voitures
                        </h2>
                        <PieChart
                            series={[
                                {
                                    data: [
                                        {
                                            id: 'louées',
                                            value: totalRentedCars,
                                            label: 'Louées',
                                        },
                                        {
                                            id: 'disponibles',
                                            value: totalAvailableCars,
                                            label: 'Disponibles',
                                        },
                                    ],
                                },
                            ]}
                            height={300}
                        />
                    </motion.div>
                </div>

                {/* Section des Réservations à Venir */}
                <motion.div
                    className="mt-8 rounded-lg bg-white border p-4 shadow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                >
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
                            { accessorKey: 'status', header: 'Statut' },
                        ]}
                        data={upcomingReservations}
                    />
                </motion.div>

                {/* Prochaine Réservation */}
                {nextReservation && (
                    <motion.div
                        className="mt-8 rounded-lg bg-white p-4 shadow"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                    >
                        <h2 className="mb-4 text-xl font-semibold">
                            Prochaine Réservation
                        </h2>
                        <p>Client : {nextReservation.user.nom}</p>
                        <p>Voiture : {nextReservation.vehicule.marque}</p>
                        <p>Date de départ : {nextReservation.date_depart}</p>
                        <p>Date de retour : {nextReservation.date_retour}</p>
                    </motion.div>
                )}

                {/* Section pour le graphique */}
                <motion.div
                    className="mt-8 rounded-lg bg-white p-4 shadow"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 25 }}
                >
                    <h2 className="mb-4 text-xl font-semibold">
                        Répartition Mensuelle
                    </h2>
                    <BarChart
                        dataset={monthlyData.map((value, index) => ({
                            id: index,
                            value,
                            label: new Intl.DateTimeFormat('fr-FR', {
                                month: 'long',
                            }).format(new Date(0, index)),
                        }))}
                        xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                        series={[
                            {
                                dataKey: 'value',
                                label: 'Réservations',
                            },
                        ]}
                        {...chartSetting}
                    />
                </motion.div>
            </div>
        </AdminLayout>
    );
}
