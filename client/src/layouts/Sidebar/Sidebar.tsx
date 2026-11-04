
import React, { useState } from "react";
import {
    Avatar,
    Box,
    Typography,
    Collapse,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { NavLink, useLocation } from "react-router-dom";

import "./Sidebar.scss";

// ==========================================
// NAVIGATION INTERFACES
// ==========================================

interface MenuItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
}

interface NavigationItem extends MenuItem {
    children?: MenuItem[];
}

// ==========================================
// NAVIGATION CONFIGURATION
// ==========================================

const navigation: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/portal/dashboard",
        icon: <DashboardRoundedIcon />,
    },
    {
        label: "Profile",
        path: "/portal/profile",
        icon: <PersonOutlineRoundedIcon />,
    },
    {
        label: "My Puntos Wallet",
        path: "/portal/wallet",
        icon: <AccountBalanceWalletOutlinedIcon />,
    },
    {
        label: "ContentHub",
        path: "/portal/content-hub",
        icon: <FolderOpenOutlinedIcon />,
        children: [
            {
                label: "Events",
                path: "/portal/content-hub/events",
                icon: <EventOutlinedIcon />,
            },
            {
                label: "Email Templates",
                path: "/portal/content-hub/email-templates",
                icon: <EmailOutlinedIcon />,
            },
            {
                label: "Marketing Resources",
                path: "/portal/content-hub/marketing-resources",
                icon: <PermMediaOutlinedIcon />,
            },
        ],
    },
    {
        label: "FAQs",
        path: "/portal/faqs",
        icon: <HelpOutlineRoundedIcon />,
    },
    {
        label: "Contacts",
        path: "/portal/contacts",
        icon: <HeadsetMicOutlinedIcon />,
    },

    // Example of another parent menu with multiple submenus
    // {
    //     label: "Management",
    //     path: "/portal/management",
    //     icon: <FolderOpenOutlinedIcon />,
    //     children: [
    //         {
    //             label: "Users",
    //             path: "/portal/management/users",
    //             icon: <PersonOutlineRoundedIcon />,
    //         },
    //         {
    //             label: "Roles",
    //             path: "/portal/management/roles",
    //             icon: <HelpOutlineRoundedIcon />,
    //         },
    //         {
    //             label: "Permissions",
    //             path: "/portal/management/permissions",
    //             icon: <FolderOpenOutlinedIcon />,
    //         },
    //     ],
    // },
];

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

const Sidebar: React.FC = () => {
    const location = useLocation();

    // Initialize expanded menus based on the current route
    const [expandedMenus, setExpandedMenus] = useState<string[]>(() =>
        navigation
            .filter((item) =>
                item.children?.some(
                    (child) =>
                        location.pathname === child.path ||
                        location.pathname.startsWith(`${child.path}/`)
                )
            )
            .map((item) => item.path)
    );

    // Toggle individual parent menus
    const toggleMenu = (path: string) => {
        setExpandedMenus((previous) =>
            previous.includes(path)
                ? previous.filter((item) => item !== path)
                : [...previous, path]
        );
    };

    // Check whether a parent menu has an active submenu
    const isMenuActive = (item: NavigationItem) => {
        return (
            item.children?.some(
                (child) =>
                    location.pathname === child.path ||
                    location.pathname.startsWith(`${child.path}/`)
            ) ?? false
        );
    };

    // Generate unique submenu IDs
    const getSubmenuId = (path: string) =>
        `submenu-${path.replace(/[^a-zA-Z0-9]/g, "-")}`;

    return (
        <Box component="aside" className="sidebar">

            {/* ======================================
                USER PROFILE
            ====================================== */}

            <Box className="sidebar__user">
                <Avatar
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Dave Spencer Bacay"
                    className="sidebar__user-avatar"
                />

                <Box className="sidebar__user-info">
                    <Typography className="sidebar__user-name">
                        Dave Spencer Bacay
                    </Typography>

                    <Typography className="sidebar__user-role">
                        Partner
                    </Typography>
                </Box>
            </Box>

            {/* ======================================
                MAIN NAVIGATION
            ====================================== */}

            <Box className="sidebar__header">
                <Typography className="sidebar__title">
                    MAIN MENU
                </Typography>
            </Box>

            <Box
                component="nav"
                className="sidebar__navigation"
                aria-label="Portal navigation"
            >
                {navigation.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const isExpanded = expandedMenus.includes(item.path);
                    const isActive = isMenuActive(item);

                    // Regular navigation link
                    if (!hasChildren) {
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? "active" : ""
                                    }`
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    }

                    // Parent menu with dynamic submenus
                    return (
                        <Box
                            key={item.path}
                            className="sidebar__menu-group"
                        >
                            <Box
                                component="button"
                                type="button"
                                className={`sidebar__link sidebar__submenu-toggle ${isActive ? "active" : ""
                                    }`}
                                onClick={() => toggleMenu(item.path)}
                                aria-expanded={isExpanded}
                                aria-controls={getSubmenuId(item.path)}
                            >
                                {item.icon}

                                <span>{item.label}</span>

                                <ExpandMoreRoundedIcon
                                    className={`sidebar__expand-icon ${isExpanded ? "expanded" : ""
                                        }`}
                                />
                            </Box>

                            <Collapse
                                in={isExpanded}
                                timeout="auto"
                                unmountOnExit
                            >
                                <Box
                                    id={getSubmenuId(item.path)}
                                    className="sidebar__submenu"
                                >
                                    {item.children?.map((child) => (
                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            end
                                            className={({ isActive }) =>
                                                `sidebar__submenu-link ${isActive ? "active" : ""
                                                }`
                                            }
                                        >
                                            {child.icon}
                                            <span>{child.label}</span>
                                        </NavLink>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    );
                })}
            </Box>

            {/* ======================================
                PROMOTIONAL CARD
            ====================================== */}

            <Box className="sidebar__promo">
                <Typography className="sidebar__promo-label">
                    PUNTOS REWARDS
                </Typography>

                <Typography className="sidebar__promo-title">
                    Make every point count!
                </Typography>

                <Typography className="sidebar__promo-description">
                    Keep earning points and discover exciting rewards.
                </Typography>

                <NavLink
                    to="/portal/wallet"
                    className="sidebar__promo-link"
                >
                    Explore rewards
                    <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
                </NavLink>
            </Box>

        </Box>
    );
};

export default Sidebar;
