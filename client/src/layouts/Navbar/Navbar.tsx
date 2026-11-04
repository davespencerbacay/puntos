
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
    Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import "./Navbar.scss";
import mainLogo from "assets/main-logo.png";
import { APP_NAME, TAG_LINE } from "constants/constants";

const navigation = [
    {
        label: "Product",
        dropdown: true,
        items: ["Platform Overview", "Loyalty Management", "AI Loyalty Cloud"],
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
        <AppBar position="sticky" elevation={0} className="navbar">
            <Toolbar className="navbar__toolbar">
                <Container
                    maxWidth="xl"
                    className="navbar__container"
                >
                    {/* LOGO */}
                    <Box component="a" href="/" className="navbar__logo">
                        <img
                            src={mainLogo}
                            alt={`${APP_NAME} - ${TAG_LINE}`}
                        />
                    </Box>

                    {/* MOBILE TOGGLE */}
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

                    {/* NAVIGATION */}
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

                        {/* CTA */}
                        <Button
                            component="a"
                            href="#contact"
                            variant="contained"
                            disableElevation
                            className="navbar__cta"
                            onClick={handleMobileClose}
                        >
                            Puntos Portal
                        </Button>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
}
