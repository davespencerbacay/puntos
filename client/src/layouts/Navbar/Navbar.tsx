
import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./Navbar.scss";

const navigation = [
    {
        label: "Product",
        dropdown: true,
        items: ["Platform Overview", "Loyalty Management", "AI Loyalty Cloud"],
    },
    {
        label: "Solutions",
        dropdown: true,
        items: ["Customer Loyalty", "Customer Engagement", "Loyalty Programs"],
    },
    {
        label: "Partners",
        dropdown: true,
        items: ["Technology Partners", "Agency Partners", "Partner Program"],
    },
    { label: "Customers", dropdown: false },
    {
        label: "Resources",
        dropdown: true,
        items: ["Guides", "Case Studies", "Webinars"],
    },
    { label: "Loyalty Blog", dropdown: false },
    { label: "Pricing", dropdown: false },
];

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownAnchor, setDropdownAnchor] = useState<{
        element: HTMLElement;
        label: string;
    } | null>(null);

    const handleDropdownOpen = (
        event: React.MouseEvent<HTMLElement>,
        label: string
    ) => {
        setDropdownAnchor({
            element: event.currentTarget,
            label,
        });
    };

    const handleDropdownClose = () => {
        setDropdownAnchor(null);
    };

    const handleMobileClose = () => {
        setMobileOpen(false);
        handleDropdownClose();
    };

    return (
        <AppBar position="static" elevation={0} className="navbar">
            <Toolbar className="navbar__container">

                <Box component="a" href="/" className="navbar__logo">
                    <span className="navbar__logo-name">antavo</span>
                    <span className="navbar__logo-tagline">
                        AI LOYALTY CLOUD
                    </span>
                </Box>

                {isMobile && (
                    <IconButton
                        className="navbar__mobile-toggle"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                )}

                <Box
                    component="nav"
                    className={`navbar__nav ${isMobile && mobileOpen ? "is-open" : ""
                        }`}
                >
                    <Box className="navbar__links">
                        {navigation.map((item) => (
                            <Box key={item.label} className="navbar__item">
                                {item.dropdown ? (
                                    <>
                                        <Button
                                            className="navbar__link"
                                            onClick={(event) =>
                                                handleDropdownOpen(
                                                    event,
                                                    item.label
                                                )
                                            }
                                            endIcon={
                                                <KeyboardArrowDownIcon
                                                    className={
                                                        dropdownAnchor?.label ===
                                                            item.label
                                                            ? "is-rotated"
                                                            : ""
                                                    }
                                                />
                                            }
                                            aria-expanded={
                                                dropdownAnchor?.label ===
                                                item.label
                                            }
                                        >
                                            {item.label}
                                        </Button>

                                        <Menu
                                            anchorEl={
                                                dropdownAnchor?.label ===
                                                    item.label
                                                    ? dropdownAnchor.element
                                                    : null
                                            }
                                            open={
                                                dropdownAnchor?.label ===
                                                item.label
                                            }
                                            onClose={handleDropdownClose}
                                            className="navbar__dropdown-menu"
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "left",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "left",
                                            }}
                                        >
                                            {item.items?.map((subItem) => (
                                                <MenuItem
                                                    key={subItem}
                                                    onClick={() => {
                                                        handleDropdownClose();
                                                        handleMobileClose();
                                                    }}
                                                >
                                                    {subItem}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </>
                                ) : (
                                    <Button
                                        className="navbar__link"
                                        href="#"
                                        onClick={handleMobileClose}
                                    >
                                        {item.label}
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Box>

                    <Button
                        component="a"
                        href="#contact"
                        variant="contained"
                        disableElevation
                        className="navbar__cta"
                        onClick={handleMobileClose}
                    >
                        Book a call
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
