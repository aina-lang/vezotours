import ApplicationLogo from '@/Components/ApplicationLogo';
import ConfirmModal from '@/Components/ConfirmModal';
import PrimaryButton from '@/Components/PrimaryButton';
import { ScrollToTopButton } from '@/Components/ScrollToTopButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Settings from '@/Components/Settings';
import UserDropdown from '@/Components/UserDropdown';
import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { router, useForm, usePage } from '@inertiajs/react';
import {
    DashboardSharp,
    Email,
    Facebook,
    Instagram,
    LinkedIn,
    LocationOn,
    LoginRounded,
    Phone,
    Twitter,
} from '@mui/icons-material';
import { Alert, Drawer, Menu, MenuItem, Snackbar } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const GuestLayout = ({ children, auth, footerShown }) => {
    const [isSticky, setSticky] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { flash, serviceTypes } = usePage().props;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmModal, setConfirmModal] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [activeLink, setActiveLink] = useState('home');
    const { post } = useForm();
    const { paletteName } = useThemeContext();
    console.log(serviceTypes);
    const currentPalette = palette[paletteName];
    const [isSidebarOpen, setSidebarOpen] = useState(false); // State for controlling sidebar visibility

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const currentURL = window.location.href;

        if (currentURL !== `${window.location.origin}/`) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentURL = route().current('home');

            console.log(route().current());

            if (currentURL) {
                setSticky(window.scrollY > 50);
            } else if (route().current('prestations')) {
                setActiveLink('prestations');
            } else {
                setSticky(true);
            }

            const sections = ['home', 'service', 'about', 'cars', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
                        setActiveLink(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (flash && (flash.success || flash.error)) {
            setMessage(flash.success || flash.error);
            setSeverity(flash.success ? 'success' : 'error');
            setOpen(true);
        }
    }, [flash]);

    const handleClose = () => {
        setOpen(false);
    };

    const toggleMenu = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
        setMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setConfirmModal(!confirmModal);
    };

    const links = [
        { href: 'home', label: 'Accueil' },
        { href: 'service', label: 'Services' },
        { href: 'about', label: 'À propos' },
        { href: 'cars', label: 'Véhicules' },
        { href: 'contact', label: 'Contact' },
    ];

    const scrollToSection = (id) => {
        const currentURL = route().current('home');
        if (currentURL) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.visit('/', {
                data: { scrollTo: id },
                preserveScroll: false,
            });
        }

        setMenuOpen(false);
    };

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenuHumberger = () => setIsOpen(!isOpen);

    return (
        <div className="{ min-h-screen bg-gray-100 dark:bg-gray-900 sm:pt-0">
            <motion.header
                initial={{ y: -50 }}
                animate={{ y: isSticky ? 0 : -10 }}
                transition={{ type: 'tween', duration: 0.5 }}
                className={`fixed top-0 z-50 flex w-full items-center justify-between ${
                    isSticky
                        ? 'bg-white shadow-md backdrop-blur-sm dark:bg-gray-900'
                        : 'bg-transparent'
                } px-6 py-4 dark:text-white`}
            >
                <ApplicationLogo
                    className="mr-8 hidden md:flex"
                    isSticky={isSticky}
                />
                <div className="flex items-center">
                    <nav className="mx-auto hidden md:flex">
                        {links.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => scrollToSection(link.href)}
                                className={`relative px-4 py-2 transition-all duration-300 ${activeLink === link.href ? 'font-bold' : isSticky ? 'text-gray-600' : 'text-white'} dark:text-white dark:hover:text-gray-300`}
                                style={{
                                    color:
                                        activeLink === link.href
                                            ? currentPalette[500]
                                            : isSticky
                                              ? palette['gray'][600]
                                              : 'white',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = currentPalette[400]; // Change to desired hover color
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color =
                                        activeLink === link.href
                                            ? currentPalette[500]
                                            : isSticky
                                              ? palette['gray'][600]
                                              : 'white';
                                }}
                            >
                                {link.label}
                                <span
                                    className={`absolute bottom-0 left-0 h-0.5 w-full scale-x-0 rounded-full transition-transform duration-300 ease-in-out ${
                                        activeLink === link.href
                                            ? 'scale-x-100'
                                            : ''
                                    }`}
                                    style={{
                                        backgroundColor: currentPalette[500],
                                    }}
                                ></span>
                            </button>
                        ))}

                        {serviceTypes?.length > 0 && (
                            <div>
                                <button
                                    onClick={handleOpenMenu}
                                    className={`flex items-center px-4 py-2 transition-all duration-300 ${activeLink === 'prestations' ? 'font-bold' : isSticky ? 'text-gray-600' : 'text-white'} dark:text-white dark:hover:text-gray-300`}
                                    style={{
                                        color:
                                            activeLink === 'prestations'
                                                ? currentPalette[500]
                                                : isSticky
                                                  ? palette['gray'][600]
                                                  : 'white',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color =
                                            currentPalette[400]; // Change to desired hover color
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color =
                                            activeLink === '#'
                                                ? currentPalette[500]
                                                : isSticky
                                                  ? palette['gray'][600]
                                                  : 'white';
                                    }}
                                >
                                    Prestations de services
                                    {isMenuOpen ? (
                                        <ChevronUp className="ml-2" />
                                    ) : (
                                        <ChevronDown className="ml-2" />
                                    )}
                                </button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={isMenuOpen}
                                    onClose={handleCloseMenu}
                                    PaperProps={{
                                        style: {
                                            boxShadow: 'none',
                                            border: 'none',
                                        },
                                    }}
                                    className="mt-2 w-full"
                                >
                                    {serviceTypes?.map((service, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => {
                                                router.visit('/prestations', {
                                                    data: {
                                                        scrollTo: service.id,
                                                    }, // Pass the service ID to the new page
                                                    preserveScroll: false,
                                                });
                                            }}
                                        >
                                            {service.nom}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        )}
                    </nav>
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenuHumberger}
                            className="focus:outline-none"
                        >
                            <svg
                                className={`"h-8 dark:text-white" w-6 ${isSticky ? 'text-gray-500' : 'text-white'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Settings isGuest isSticky={isSticky} />
                    {!auth?.user ? (
                        <>
                            <PrimaryButton
                                onClick={() => router.visit('/login')}
                                className="dark:text-white"
                            >
                                <LoginRounded className="mr-2 h-2" /> Se
                                connecter
                            </PrimaryButton>
                            <SecondaryButton
                                onClick={() => router.visit('/register')}
                                isSticky={isSticky}
                                className="bg-gray-800 dark:bg-gray-900 dark:text-white"
                            >
                                S'inscrire
                            </SecondaryButton>
                        </>
                    ) : (
                        <UserDropdown
                            auth={auth}
                            handleLogout={handleLogout}
                            menuItems={[
                                {
                                    label: 'Tableau de bord',
                                    // icon: <DashboardSharp />,
                                    action: () =>
                                        router.visit(
                                            auth.user.type == 'admin'
                                                ? '/admin/dashboard'
                                                : '/client/dashboard',
                                        ),
                                },
                                {
                                    label: 'Profil',
                                    action: () => router.visit('/profil'),
                                },
                                {
                                    label: 'Paramètres',
                                    action: () => router.visit('/parametres'),
                                },
                                {
                                    label: 'Aide',
                                    action: () => router.visit('/aide'),
                                },
                            ]}
                        />
                    )}
                </div>
            </motion.header>

            <Drawer
                anchor="left"
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="bg-white/20 backdrop-blur-sm"
            >
                {/* Menu Rideau */}
                <div
                    className="h-full w-64 space-y-6 p-6"
                    // style={{ backgroundColor: currentPalette['gray'][800] }}
                >
                    <ul className="mb-0 list-none space-y-4">
                        {links.map((link) => (
                            <li key={link.href}>
                                <button
                                    onClick={() => {
                                        scrollToSection(link.href);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full rounded-lg px-4 py-2 text-left text-lg transition-colors duration-300`}
                                    style={{
                                        color:
                                            activeLink === link.href
                                                ? 'white' // Actif: couleur de surbrillance
                                                : palette['gray'][500], // Couleur standard
                                        backgroundColor:
                                            activeLink === link.href
                                                ? currentPalette[500] // Fond clair pour l'élément actif
                                                : '', // Pas de fond pour les autres éléments
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor =
                                            currentPalette[100]; // Fond au survol
                                        e.target.style.color =
                                            currentPalette[400]; // Changer la couleur du texte au survol
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                            activeLink === link.href
                                                ? currentPalette[500]
                                                : ''; // Réinitialiser l'arrière-plan
                                        e.target.style.color =
                                            activeLink === link.href
                                                ? 'white' // Réinitialiser la couleur du texte si actif
                                                : palette['gray'][500]; // Couleur par défaut
                                    }}
                                >
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </Drawer>

            <main>{children}</main>

            <ScrollToTopButton />

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
                onClose={() => setConfirmModal(false)}
                title="Déconnexion"
                content="Êtes-vous sûr de vouloir vous déconnecter ?"
                onConfirm={() => {
                    post(route('logout'));
                    setConfirmModal(false);
                }}
            />

            {footerShown && (
                <footer className="mt-0 flex flex-col items-center bg-gray-100 text-center text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    <div className="container p-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Informations de Contact */}
                            <div className="mb-6 md:text-left">
                                <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
                                    Contact
                                </h5>
                                <ul className="mb-0 list-none space-y-4">
                                    <li className="flex items-center justify-center space-x-3 md:justify-start">
                                        <Email className="text-gray-700 dark:text-gray-300" />
                                        <span>Email : </span>
                                        <a
                                            href="mailto:contact@vezoTours.com"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            contact@vezoTours.com
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-center space-x-3 md:justify-start">
                                        <Phone className="text-gray-700 dark:text-gray-300" />
                                        <span>Téléphone : </span>
                                        <a
                                            href="tel:+123456789"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            +123 456 789
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-center space-x-3 md:justify-start">
                                        <LocationOn className="text-gray-700 dark:text-gray-300" />
                                        <span>Adresse : </span>
                                        <p>123 Rue Ayna, Ville, Pays</p>
                                    </li>
                                </ul>
                            </div>

                            {/* Liens des réseaux sociaux */}
                            <div className="mb-6 text-center">
                                <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
                                    Suivez-nous
                                </h5>
                                <ul className="mb-0 list-none space-y-4 text-center">
                                    <li className="flex items-center justify-center space-x-3">
                                        <Facebook className="text-gray-700 dark:text-gray-300" />
                                        <a
                                            href="https://www.facebook.com/vezoTours"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Facebook
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-center space-x-3">
                                        <Twitter className="text-gray-700 dark:text-gray-300" />
                                        <a
                                            href="https://www.twitter.com/vezoTours"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Twitter
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-center space-x-3">
                                        <Instagram className="text-gray-700 dark:text-gray-300" />
                                        <a
                                            href="https://www.instagram.com/vezoTours"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            Instagram
                                        </a>
                                    </li>
                                    <li className="flex items-center justify-center space-x-3">
                                        <LinkedIn className="text-gray-700 dark:text-gray-300" />
                                        <a
                                            href="https://www.linkedin.com/company/vezoTours"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            LinkedIn
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Liens Rapides */}
                            <div className="mb-6 md:text-right">
                                <h5 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
                                    Liens rapides
                                </h5>
                                <ul className="mb-0 list-none space-y-4">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <button
                                                onClick={() =>
                                                    scrollToSection(link.href)
                                                }
                                                className="text-gray-700 hover:text-gray-500 dark:text-gray-300"
                                            >
                                                {link.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-gray-200 p-4 text-center dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} vezoTours. Tous
                            droits réservés.
                        </p>
                    </div>
                </footer>
            )}

            {/* <CookieConsent /> */}
        </div>
    );
};

export default GuestLayout;
