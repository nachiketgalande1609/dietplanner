import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, Button, ButtonGroup, Tooltip, IconButton } from "@mui/material";
import { Diet } from "./components/Pages/Diet";
import { Workout } from "./components/Pages/Workout";
import { Page3 } from "./components/Pages/Page3";
import { theme } from "./theme";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current path

    const getButtonStyles = (path: string) => ({
        backgroundColor: location.pathname === path ? "primary.main" : "background.paper",
        color: location.pathname === path ? "primary.contrastText" : "text.primary",
        "&:hover": {
            backgroundColor: location.pathname === path ? "primary.dark" : "action.hover",
        },
    });

    return (
        <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
            <CssBaseline />
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        transition: (theme) =>
                            theme.transitions.create("margin", {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                    }}
                >
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
                                {darkMode ? <DarkModeIcon /> : <SunnyIcon />}
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Routes>
                        <Route path="/" element={<Diet />} />
                        <Route path="/diet" element={<Diet />} />
                        <Route path="/workout" element={<Workout />} />
                        <Route path="/page3" element={<Page3 />} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
