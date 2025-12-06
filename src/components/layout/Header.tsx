import { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Container,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import TMDBLogo from "../../assets/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg";
import { ThemeButton } from "../../common/theme/themeButton/ThemeButton";

const navItems = [
    { label: "Main", link: "/" },
    { label: "Category Movies", link: "/categoryMovies" },
    { label: "Filtered Movies", link: "/filteredMovies" },
    { label: "Search", link: "/search" },
    { label: "Favorites", link: "/favorites" },
];

export const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        {/* ЛОГО */}
                        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
                            <img src={TMDBLogo} width={160} height={25} alt="TMDB Logo" />
                        </Link>

                        {/* ДЕСКТОП МЕНЮ */}
                        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.link}
                                    component={Link}
                                    to={item.link}
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: "none",
                                        color: pathname === item.link ? "#1976d2" : "#000",
                                        borderBottom: pathname === item.link ? "2px solid #1976d2" : "2px solid transparent",
                                        transition: "0.2s",
                                        "&:hover": {
                                            color: "#1976d2",
                                            borderBottom: "2px solid #1976d2",
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* КНОПКА ТЕМЫ */}
                        <ThemeButton />

                        {/* БУРГЕР НА МОБИЛЬНЫХ */}
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon sx={{ color: "#000" }} />
                        </IconButton>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* МОБИЛЬНОЕ МЕНЮ */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
            >
                <Box sx={{ width: 240 }}>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.link} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={item.link}
                                    selected={pathname === item.link}
                                    onClick={handleDrawerToggle}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};
