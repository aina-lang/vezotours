import { useEffect, useRef, useState } from "react";
import { usePage, Link as InertiaLink } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Palette, palette, PaletteKeys } from "@/constants/palette";

interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    expanded: boolean;
    subMenu?: SubMenuItemProps[] | null;
    link?: string;
}

interface SubMenuItemProps
    extends Omit<SidebarItemProps, "expanded" | "subMenu"> {
    active?: boolean;
}

function HoveredSubMenuItem({
    icon,
    text,
    active = false,
    link,
}: SubMenuItemProps) {
    const { paletteName } = useThemeContext() as {
        paletteName: PaletteKeys;
        mode: string;
    };

    const currentColor = active ? palette[paletteName][500] : " ";

    return (
        <InertiaLink
            href={link || "#"}
            style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                padding: "5px",
                margin: "8px 0",
                backgroundColor: active
                    ? palette[paletteName][500]
                    : currentColor,
                color: active ? "white" : palette["gray"][500],
                boxShadow: active ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                transition: "background-color 0.2s",
            }}
            className="space-x-1"
        >
            <span className="">{icon}</span>
            <span className="">{text}</span>
        </InertiaLink>
    );
}

function Tooltip({
    content,
    position,
    onMouseLeave,
    onMouseEnter,
}: {
    content: React.ReactNode;
    position: { top: number; left: number };
    onMouseLeave: () => void;
    onMouseEnter: () => void;
}) {
    return (
        <div
            className="absolute bg-white shadow-md rounded-lg p-2 z-50"
            style={{
                top: position.top,
                left: position.left,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {content}
        </div>
    );
}

export default function SidebarItem({
    icon,
    text,
    expanded = false,
    subMenu = null,
    link = "#",
}: SidebarItemProps) {
    const { paletteName } = useThemeContext() as {
        paletteName: PaletteKeys;
        mode: string;
    };
    const [expandSubMenu, setExpandSubMenu] = useState(false);
    const [active, setActive] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const { url } = usePage();
    const subMenuRef = useRef<HTMLUListElement>(null);
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

    useEffect(() => {
        const isActive = url === link;
        setActive(isActive);
        if (subMenu && subMenuRef.current) {
            const isSubMenuActive = subMenu.some((item) => item.active);
            setExpandSubMenu(isActive || isSubMenuActive);
        } else {
            setExpandSubMenu(isActive);
        }
    }, [url, link, subMenu]);

    // useEffect(() => {
    //     if (!expanded) {
    //         setExpandSubMenu(false);
    //     }
    // }, [expanded]);

    const handleSubMenuToggle = () => {
        if (expanded == true) {
            setExpandSubMenu((curr) => !curr);
        }
    };

    const handleMouseEnter = (event: React.MouseEvent) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        if (!expanded) {
            const rect = event.currentTarget.getBoundingClientRect();
            setTooltipPosition({
                top: rect.top,
                left: rect.right + 20,
            });
            setHovered(true);
        }
    };

    const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
            setHovered(false);
        }, 100);
    };

    const subMenuHeight = expandSubMenu
        ? ((subMenu?.length || 0) * 45 + (subMenu ? 15 : 0)).toString() + "px"
        : 0;

    const tooltipContent = subMenu ? (
        <ul className="sub-menu ">
            {subMenu.map((item, index) => (
                <li key={index} className="my-2">
                    <HoveredSubMenuItem
                        icon={item.icon}
                        text={item.text}
                        link={item.link}
                        active={item.active}
                    />
                </li>
            ))}
        </ul>
    ) : (
        <InertiaLink
            href={link}
            className={`group relative flex w-full cursor-pointer items-center rounded-md px-3 py-2  transition-colors my-2  ${
                !expanded && "hidden sm:flex"
            }`}
            style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                padding: "5px",
                margin: "8px 0",
                backgroundColor: active ? palette[paletteName][500] : " ",
                color: active ? "white" : palette["gray"][500],
                boxShadow: active ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                transition: "background-color 0.2s",
            }}
        >
            <span className="h-6 w-6">{icon}</span>
            <span
                className={`overflow-hidden text-start transition-all ${"ml-3 w-44"}`}
            >
                {text}
            </span>
        </InertiaLink>
    );

    return (
        <>
            <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {subMenu ? (
                    <button
                        className={`group relative my-2 flex w-full cursor-pointer items-center rounded-md px-2 py-2  transition-colors hover:bg-${paletteName} ${
                            !expanded && "hidden sm:flex"
                        }`}
                        onClick={handleSubMenuToggle}
                        style={{
                            color: active ? "white" : palette["gray"][500],
                        }}
                    >
                        <span className="h-6 w-6">{icon}</span>
                        <span
                            className={`overflow-hidden text-start transition-all ${
                                expanded ? "ml-3 w-44" : "w-0 hidden"
                            }`}
                        >
                            {text}
                        </span>
                        <div
                            className={` absolute top-2 right-2 h-4 w-4${
                                expanded ? "" : "hidden"
                            }  ${
                                expandSubMenu || active
                                    ? "rotate-90"
                                    : "rotate-0"
                            } transition-transform`}
                        >
                            <ChevronRight />
                        </div>
                    </button>
                ) : (
                    <InertiaLink
                        href={link}
                        className={`group relative   flex w-full cursor-pointer items-center rounded-md px-3 py-2  transition-colors my-2  ${
                            !expanded && "hidden sm:flex"
                        }`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            borderRadius: "5px",
                            padding: "5px",
                            margin: "8px 0",
                            backgroundColor: active
                                ? palette[paletteName][500]
                                : " ",
                            color: active ? "white" : palette["gray"][500],
                            boxShadow: active
                                ? "0 4px 6px rgba(0, 0, 0, 0.1)"
                                : "none",
                            transition: "background-color 0.2s",
                        }}
                    >
                        <span className="h-6 w-6">{icon}</span>
                        <span
                            className={`overflow-hidden text-start transition-all ${
                                expanded ? "ml-3 w-44" : "w-0 hidden"
                            }`}
                        >
                            {text}
                        </span>
                    </InertiaLink>
                )}
            </li>
            {/* {subMenu && expandSubMenu && ( */}
            <ul
                className="sub-menu pl-6"
                ref={subMenuRef}
                style={{ height: subMenuHeight, transition: "0.5s" }}
            >
                {subMenu?.map((item, index) => (
                    <li key={index}>
                        <HoveredSubMenuItem
                            icon={item.icon}
                            text={item.text}
                            link={item.link}
                            active={url === item.link}
                        />
                    </li>
                ))}
            </ul>
            {/* )} */}
            {hovered && !expanded && (
                <Tooltip
                    content={tooltipContent}
                    position={tooltipPosition}
                    onMouseEnter={() =>
                        handleMouseEnter({} as React.MouseEvent)
                    }
                    onMouseLeave={handleMouseLeave}
                />
            )}
        </>
    );
}
