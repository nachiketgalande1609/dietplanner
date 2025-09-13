import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, Button, ButtonGroup, Tooltip, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Diet } from "./Pages/Diet";
import { Workout } from "./Pages/Workout";
import { Tasks } from "./Pages/Tasks";
import { theme } from "./theme";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Login from "./Pages/Login";

export const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("dietDarkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const navigate = useNavigate();
    const location = useLocation(); // 👈 get current route
    const isMobile = useMediaQuery(useTheme().breakpoints.down("md"));

    useEffect(() => {
        localStorage.setItem("dietDarkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const useButtonStyles = () => {
        const theme = useTheme();

        const getButtonStyles = (path: string) => {
            const isActive = location.pathname === path || (path === "/tasks" && location.pathname === "/"); // Treat "/" as "/tasks"

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

    return (
        <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: location.pathname == "/login" ? 0 : isMobile ? 1.5 : 3,
                        transition: (theme) =>
                            theme.transitions.create("margin", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                        width: "100%",
                    }}
                >
                    {/* 👇 Hide navbar on login page */}
                    {location.pathname !== "/login" && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: {
                                    xs: "space-between",
                                    sm: "right",
                                },
                                gap: 2,
                                mb: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <ButtonGroup
                                sx={{
                                    "& .MuiButtonGroup-grouped": {
                                        border: "none",
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

                            <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                                <IconButton
                                    onClick={() => setDarkMode(!darkMode)}
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
                        </Box>
                    )}

                    <Routes>
                        <Route path="/" element={<Tasks />} />
                        <Route path="/diet" element={<Diet />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
