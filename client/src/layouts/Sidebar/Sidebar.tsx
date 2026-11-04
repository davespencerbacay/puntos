
import React from "react";
import {
    Avatar,
    Box,
    Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { NavLink } from "react-router-dom";

import "./Sidebar.scss";

const navigation = [
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
        label: "FAQs",
        path: "/portal/faqs",
        icon: <HelpOutlineRoundedIcon />,
    },
    {
        label: "Contacts",
        path: "/portal/contacts",
        icon: <HeadsetMicOutlinedIcon />,
    },
];

const Sidebar: React.FC = () => {
    return (
        <Box component="aside" className="sidebar">
            {/* User Profile */}
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

            {/* Navigation */}
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
                {navigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? "active" : ""}`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </Box>

            {/* Promotional Card */}
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
