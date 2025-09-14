import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    CssBaseline,
    ThemeProvider,
    Button,
    ButtonGroup,
    Tooltip,
    IconButton,
    useMediaQuery,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography,
    Divider,
} from "@mui/material";
import { Diet } from "./Pages/Diet";
import { Workout } from "./Pages/Workout";
import { Tasks } from "./Pages/Tasks";
import { theme } from "./theme";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Login from "./Pages/Login";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { logout, setUser, setCheckingAuth } from "./store/slices/userSlice";
import { toggleDarkMode } from "./store/slices/themeSlice";

export const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isCheckingAuth } = useAppSelector((state) => state.user);
    const { darkMode } = useAppSelector((state) => state.theme);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));
    const open = Boolean(anchorEl);

    // Check if user is authenticated on app load
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("authToken");
            const userData = localStorage.getItem("user");

            if (token && userData) {
                dispatch(
                    setUser({
                        user: JSON.parse(userData),
                        token,
                    })
                );

                // If user is on login page and authenticated, redirect to tasks
                if (location.pathname === "/login") {
                    navigate("/tasks", { replace: true });
                }
            } else {
                dispatch(logout());

                // If user is not on login page and not authenticated, redirect to login
                if (location.pathname !== "/login") {
                    navigate("/login", { replace: true });
                }
            }

            dispatch(setCheckingAuth(false));
        };

        checkAuth();
    }, [dispatch, navigate, location.pathname]);

    // Protect routes from unauthenticated access
    useEffect(() => {
        if (!isCheckingAuth && !isAuthenticated && location.pathname !== "/login") {
            navigate("/login", { replace: true });
        }

        if (!isCheckingAuth && isAuthenticated && location.pathname === "/login") {
            navigate("/tasks", { replace: true });
        }
    }, [isAuthenticated, isCheckingAuth, location.pathname, navigate]);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        setAnchorEl(null);
        navigate("/login", { replace: true });
    };

    const useButtonStyles = () => {
        const theme = useTheme();

        const getButtonStyles = (path: string) => {
            const isActive = location.pathname === path || (path === "/tasks" && location.pathname === "/");

            return {
                background: isActive ? "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)" : theme.palette.background.paper,
                color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                "&:hover": {
                    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
                },
            };
        };

        return getButtonStyles;
    };

    const getButtonStyles = useButtonStyles();

    // Show nothing while checking authentication
    if (isCheckingAuth) {
        return (
            <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
                <CssBaseline />
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                    {/* You can add a loading spinner here if desired */}
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: location.pathname === "/login" ? 0 : isMobile ? 1.5 : 3,
                        transition: (theme) =>
                            theme.transitions.create("margin", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        width: "100%",
                    }}
                >
                    {/* 👇 Hide navbar on login page */}
                    {location.pathname !== "/login" && isAuthenticated && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                mb: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Livo Brand Text */}
                            {!isMobile && (
                                <Box
                                    sx={{
                                        width: 350,
                                        display: "flex",
                                        alignItems: "center",
                                        px: 3,
                                        py: 1,
                                        bgcolor: "background.paper",
                                        borderRadius: 3,
                                        border: isMobile ? "none" : "1px solid",
                                        borderColor: "divider",
                                    }}
                                >
                                    <Typography
                                        variant="h5"
                                        component="h1"
                                        sx={{
                                            fontWeight: 800,
                                            letterSpacing: "-0.5px",
                                            textAlign: "center",
                                            background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        Livo
                                    </Typography>
                                </Box>
                            )}

                            {/* Navigation and User Controls Container */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: {
                                        xs: "space-between",
                                        sm: "space-between",
                                    },
                                    flex: 1,
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                <ButtonGroup
                                    sx={{
                                        "& .MuiButtonGroup-grouped": {
                                            border: isMobile ? "none" : "1px solid",
                                            borderColor: "divider",
                                        },
                                    }}
                                >
                                    <Button onClick={() => navigate("/tasks")} sx={getButtonStyles("/tasks")}>
                                        Tasks
                                    </Button>
                                    <Button onClick={() => navigate("/diet")} sx={getButtonStyles("/diet")}>
                                        Diet
                                    </Button>
                                    <Button onClick={() => navigate("/workout")} sx={getButtonStyles("/workout")}>
                                        Workout
                                    </Button>
                                </ButtonGroup>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                                        <IconButton
                                            onClick={() => dispatch(toggleDarkMode())}
                                            sx={{
                                                backgroundColor: "background.paper",
                                                width: "36.5px",
                                                height: "36.5px",
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                },
                                            }}
                                        >
                                            {darkMode ? <DarkModeIcon sx={{ fontSize: "1.25rem" }} /> : <SunnyIcon sx={{ fontSize: "1.25rem" }} />}
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Account settings">
                                        <IconButton
                                            onClick={handleProfileMenuOpen}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                backgroundColor: "background.paper",
                                                width: "40px",
                                                height: "40px",
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                },
                                            }}
                                            aria-controls={open ? "account-menu" : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? "true" : undefined}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: "primary.main",
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                {user?.firstName?.[0]}
                                                {user?.lastName?.[0]}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Profile Menu Dropdown */}
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleProfileMenuClose}
                        onClick={handleProfileMenuClose}
                        PaperProps={{
                            elevation: 2,
                            sx: {
                                overflow: "visible",
                                mt: 1.5,
                                minWidth: 250,
                                "& .MuiAvatar-root": {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                        <MenuItem onClick={handleProfileMenuClose}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                {user?.firstName?.[0]}
                                {user?.lastName?.[0]}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight="bold">
                                    {user?.firstName} {user?.lastName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user?.email}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleProfileMenuClose}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleProfileMenuClose}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>

                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={isAuthenticated ? <Tasks /> : null} />
                        <Route path="/diet" element={isAuthenticated ? <Diet /> : null} />
                        <Route path="/workout" element={isAuthenticated ? <Workout /> : null} />
                        <Route path="/tasks" element={isAuthenticated ? <Tasks /> : null} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
