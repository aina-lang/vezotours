import { useEffect, useRef, useState } from 'react';

import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

import ConfirmModal from '@/Components/ConfirmModal';
import Sidebar, { SidebarItem } from '@/Components/MySidebar';
import Settings from '@/Components/Settings';
import UserDropdown from '@/Components/UserDropdown';
import { useThemeContext } from '@/contexts/ThemeContext';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    Add,
    CarRental,
    Category,
    List,
    RoomService,
} from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material';
import { GridAddIcon } from '@mui/x-data-grid';
import {
    CarIcon,
    Fullscreen,
    LayoutDashboard,
    LifeBuoy,
    Moon,
    Settings2,
    Sun,
    Users2,
} from 'lucide-react';
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
// import { Toast } from "@radix-ui/react-toast";

export default function AdminLayout({ header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const { flash, auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [confirmModal, setConfirmModal] = useState(false);
    const { post } = useForm();
    const [isScrolled, setIsScrolled] = useState(false);
    const { paletteName } = useThemeContext();
    // console.log(auth);

    useEffect(() => {
        // console.log(flash);
        if (flash) {
            if (flash.success) {
                setMessage(flash.success);
                setSeverity('success');
                setOpen(true);
            } else if (flash.error) {
                setMessage(flash.error);
                setSeverity('error');
                setOpen(true);
            }
        }
    }, [flash]);
    const handleClose = () => {
        setOpen(false);
    };
    const [isFullScreen, setIsFullScreen] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem('dark-mode') === 'true';
    });

    useEffect(() => {
        const darkMode = localStorage.getItem('dark-mode');

        if (darkMode === 'false' || !darkMode) {
            document.querySelector('html').classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        } else {
            document.querySelector('html').classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode.toString());
            return newMode;
        });
    };

    const handleLogout = () => {
        setConfirmModal(true);
    };

    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen);
    };

    const scrollRef = useRef(null); // Référence pour l'élément à observer

    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const { scrollTop } = scrollRef.current; // Obtenez la position de défilement
                setIsScrolled(scrollTop > 20); // Définissez la condition pour isScrolled
            }
        };

        const refElement = scrollRef.current;
        if (refElement) {
            refElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (refElement) {
                refElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isScrolled]);

    return (
        <div
            className={`flex h-screen overflow-y-hidden bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] transition-colors duration-300 [background-size:16px_16px] dark:bg-gray-900`}
        >
            <Sidebar auth={auth}>
                <SidebarItem
                    icon={<LayoutDashboard size={20} />}
                    text="Tableau de bord"
                    link="/admin/dashboard" // Lien vers le tableau de bord
                />

                <SidebarItem icon={<CarIcon size={20} />} text="Véhicules">
                    <SidebarItem
                        icon={<List size={20} />}
                        text="Toutes les véhicules"
                        link="/admin/vehicules"
                    />
                    <SidebarItem
                        icon={<Category size={20} />}
                        text="Toutes les categories"
                        link="/admin/categories"
                    />
                    <SidebarItem
                        icon={<Add size={20} />}
                        text="Ajouter véhicule"
                        link="/admin/vehicules/create"
                    />
                    <SidebarItem
                        icon={<Add size={20} />}
                        text="Ajouter catégorie"
                        link="/admin/categories/create"
                    />
                </SidebarItem>

                <SidebarItem icon={<Users2 size={20} />} text="Clients">
                    <SidebarItem
                        icon={<List size={20} />}
                        text="Tous les clients"
                        link="/admin/clients"
                    />
                    <SidebarItem
                        icon={<Add size={20} />}
                        text="Ajouter client"
                        link="/admin/clients/create"
                    />
                </SidebarItem>

                <SidebarItem
                    icon={<CarRental size={20} />}
                    text="Réservations"
                    link="/admin/reservations"
                />
                <SidebarItem
                    icon={<CarRental size={20} />}
                    text="Archives"
                    link="/admin/reservations/archived"
                />

                <hr className="my-3" />
                {/* Section pour les Prestations */}
                <SidebarItem
                    icon={<RoomService size={20} />}
                    text="Prestations"
                >
                    <SidebarItem
                        icon={<List size={20} />}
                        text="Toutes les prestations"
                        link="/admin/prestations"
                    />

                    <SidebarItem
                        icon={<Category size={20} />}
                        text="Catégories de prestations"
                        link="/admin/serviceTypes"
                    />
                    <SidebarItem
                        icon={<Add size={20} />}
                        text="Ajouter prestation"
                        link="/admin/prestations/create"
                    />
                    <SidebarItem
                        icon={<Add size={20} />}
                        text="Ajouter categories"
                        link="/admin/serviceTypes/create"
                    />
                </SidebarItem>
                <SidebarItem
                    icon={<Settings2 size={20} />}
                    text="Paramètres"
                    // link="/settings"
                />
                <SidebarItem
                    icon={<LifeBuoy size={20} />}
                    text="Aide"
                    // link="/help"
                />
            </Sidebar>

            <div className="flex-grow overflow-y-hidden">
                {/* Main Content Area */}
                <main
                    className="relative h-screen overflow-y-auto overflow-x-hidden p-2 pb-24"
                    ref={scrollRef}
                >
                    <nav
                        className={`sticky left-0 right-0 top-0 z-50 m-3 my-0 mb-5 mt-3 rounded-lg border py-1 shadow-sm backdrop-blur-lg transition-all duration-300 ${
                            isScrolled
                                ? 'bg-white/80 px-5 shadow-sm dark:bg-gray-800'
                                : 'bg-white px-0 dark:bg-gray-800/50'
                        }`}
                        // style={{
                        //     boxShadow: isScrolled
                        //         ? `0 5px 10px rgba(0,0,0,0.1)`
                        //         : 'none',
                        // }}
                    >
                        <div className="flex h-16 items-center justify-between">
                            <div></div>
                            {/* Right Side (Search, Buttons, User Dropdown) */}
                            <div className="flex items-center space-x-4">
                                {/* Dark Mode Toggle */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                >
                                    {isDarkMode ? (
                                        <Sun className="h-5 w-5 text-yellow-500" />
                                    ) : (
                                        <Moon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                                {/* Fullscreen Toggle */}
                                <button
                                    onClick={toggleFullScreen}
                                    className="rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600"
                                >
                                    <Fullscreen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                </button>

                                <div className="flex min-h-full items-center space-x-2">
                                    <SecondaryButton
                                        isSticky
                                        className="border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    >
                                        <GridAddIcon className="mr-2" />
                                        Client
                                    </SecondaryButton>
                                    <PrimaryButton
                                        onClick={() =>
                                            router.get('/projects/add')
                                        }
                                    >
                                        <GridAddIcon className="mr-2" />
                                        Véhicule
                                    </PrimaryButton>
                                </div>

                                {/* User Dropdown */}
                                <div className="relative">
                                    <UserDropdown
                                        auth={auth}
                                        handleLogout={handleLogout}
                                        menuItems={[
                                            {
                                                label: 'Profil',
                                                action: () => {},
                                            },

                                            { label: 'Aide', action: () => {} },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation Dropdown */}
                        <div
                            className={
                                (showingNavigationDropdown
                                    ? 'block'
                                    : 'hidden') + ' sm:hidden'
                            }
                        >
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                >
                                    Accueil
                                </ResponsiveNavLink>
                            </div>
                            <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-700">
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-300">
                                        {/* {auth.login} */}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {/* {auth.email} */}
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink
                                        href={route('profile.edit')}
                                    >
                                        Profil
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        onClick={() => setConfirmModal(true)}
                                    >
                                        Déconnexion
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            // variants={slideBounceVariants}
                            className="w-full max-w-sm"
                        >
                            <Alert
                                onClose={handleClose}
                                severity={severity}
                                className="rounded-lg shadow-xl"
                            >
                                <div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: message,
                                        }}
                                    />
                                </div>
                            </Alert>
                        </div>
                    </Snackbar>
                    <ConfirmModal
                        open={confirmModal}
                        onClose={() => setConfirmModal(!confirmModal)}
                        onConfirm={() => {
                            post(route('logout'));
                            setConfirmModal(false);
                        }}
                        title="Confirmer la deconxxion"
                        content="Êtes-vous sûr de vouloir vous deconnecter ?"
                    />
                    {header}
                    {children}
                    <Settings />
                </main>
            </div>
        </div>
    );
}
