import { palette } from '@/constants/palette';
import { useThemeContext } from '@/contexts/ThemeContext';
import { router } from '@inertiajs/react';
import { ChevronDown, ChevronFirst, ChevronLast } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ApplicationLogo from './ApplicationLogo';

const SidebarContext = createContext();

export default function Sidebar({ children, auth }) {
    // Load the expanded state from local storage or default to true
    const [expanded, setExpanded] = useState(() => {
        const savedState = localStorage.getItem('sidebarExpanded');
        return savedState === 'false' ? false : true; // Default to true if not found
    });

    // Save the expanded state to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarExpanded', expanded);
    }, [expanded]);

    const { paletteName } = useThemeContext();
    const currentPalette = palette[paletteName];
    // bg-zinc-800
    return (
        <aside
            className={`h-screen border-r shadow-md bg-white transition-all ease-in dark:bg-gray-800 ${expanded ? 'w-60' : ''}`}
        >
            <nav className={`flex h-full flex-col bg-[${currentPalette[500]}]`}>
                <div className="mb-2 flex items-center justify-between space-x-2 p-4 pb-2">
                    {expanded && <ApplicationLogo isSticky />}
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="rounded-lg bg-gray-50 p-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-700"
                    >
                        {expanded ? (
                            <ChevronFirst className="" />
                        ) : (
                            <ChevronLast />
                        )}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul
                        className={`pt-5 flex-1 px-3 ${expanded ? 'overflow-y-auto' : ''}`}
                    >
                        {children}
                    </ul>
                </SidebarContext.Provider>

                <div className="flex border-t p-3">
                    <div
                        className={`flex items-center justify-between overflow-hidden transition-all ${
                            expanded ? 'ml-3 w-56' : 'w-0'
                        } `}
                    >
                        <div className="leading-4">
                            <h4 className="font-semibold text-gray-700">
                                {auth.user.nom}
                            </h4>
                            <span className="text-xs text-gray-600">
                                {auth.user.email}
                            </span>
                        </div>
                        {/* <MoreVertical size={20} /> */}
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export function SidebarItem({ icon, text, alert, children, link }) {
    const { expanded } = useContext(SidebarContext);
    const [isActive, setIsActive] = useState(false);
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const { paletteName } = useThemeContext();
    const currentPalette = palette[paletteName];

    // Check local storage for the active link
    useEffect(() => {
        const activeLink = localStorage.getItem('activeSidebarItem');
        console.log(activeLink, link, activeLink === link);
        if (activeLink === link) {
            setIsActive(true);
            setIsSubMenuOpen(true); // Open submenu if this item is active
        } else {
            setIsActive(false);
        }
    }, [link]);

    useEffect(() => {
        if (children) {
            const childActive = React.Children.toArray(children).some(
                (child) => {
                    const childLink = child.props.link; // Assuming children have a 'link' prop
                    return (
                        childLink &&
                        localStorage.getItem('activeSidebarItem') === childLink
                    );
                },
            );
            setIsSubMenuOpen(childActive); // Open submenu if any child is active
        }
    }, [children]);
    // Handle navigation and toggle submenu
    const handleNavigation = () => {
        if (link) {
            localStorage.setItem('activeSidebarItem', link);
            router.visit(link); // Inertia's navigation function
            setIsActive(true);
        } else {
            setIsSubMenuOpen((prev) => !prev); // Toggle submenu if no link provided
        }
    };

    return (
        <>
            <li
                className={`group relative z-50 my-1 flex cursor-pointer flex-col items-start rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'shadow-lg' : ''}`}
                onClick={handleNavigation}
                style={{
                    background: isActive
                        ? `linear-gradient(to right ,${currentPalette[500]},${currentPalette[400]})`
                        : 'transparent',
                    color: isActive ? 'white' : palette['gray'][600],
                    // color: isActive ? currentPalette[600] : 'white',
                }}
            >
                <div className="flex w-full items-center">
                    <span className='text-xl'>{icon}</span>
                    <span
                        className={`overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'hidden w-0'}`}
                    >
                        {text}
                    </span>
                    {children && expanded && (
                        <ChevronDown
                            className={`ml-auto transform transition-transform ${isSubMenuOpen ? 'rotate-180' : 'rotate-0'}`}
                        />
                    )}
                    {alert && (
                        <div
                            className={`absolute right-2 h-2 w-2 rounded bg-blue-500 ${expanded ? '' : 'top-2'}`}
                        ></div>
                    )}
                </div>

                {/* Tooltip lorsque le menu est réduit */}
                {!children && !expanded && !isSubMenuOpen && (
                    <div
                        className={`invisible absolute left-full ml-6 flex min-w-[150px] -translate-x-3 items-center rounded-md bg-indigo-100 px-3 py-2 text-sm text-[${paletteName[800]}] opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
                    >
                        <span>{icon}</span>
                        {text}
                    </div>
                )}

                {children && !expanded && (
                    <ul
                        className={`invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-indigo-100 px-2 py-1 text-sm text-[${paletteName[800]}] opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
                    >
                        {children}
                    </ul>
                )}
            </li>

            {/* Expanded submenu when sidebar is expanded */}
            {children && isSubMenuOpen && expanded && (
                <ul className="pl-6">{children}</ul>
            )}
        </>
    );
}
