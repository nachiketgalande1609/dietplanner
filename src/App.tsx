import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, Button, ButtonGroup, Tooltip, IconButton } from "@mui/material";
import { Page1 } from "./components/Pages/Page1";
import { Page2 } from "./components/Pages/Page2";
import { Page3 } from "./components/Pages/Page3";
import { theme } from "./theme";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

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
                                xs: "space-between", // on small screens (mobile)
                                sm: "right", // on small+ screens and up
                            },
                            gap: 2,
                            mb: 2,
                            flexWrap: "wrap", // Optional: ensures no overflow on very narrow screens
                        }}
                    >
                        <ButtonGroup
                            sx={{
                                "& .MuiButtonGroup-grouped": {
                                    border: "none",
                                    backgroundColor: "background.paper",
                                    color: "text.primary",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                },
                            }}
                        >
                            <Button
                                onClick={() => navigate("/page1")}
                                sx={{
                                    backgroundColor: "background.paper",
                                    color: "text.primary",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                Page 1
                            </Button>
                            <Button
                                onClick={() => navigate("/page2")}
                                sx={{
                                    backgroundColor: "background.paper",
                                    color: "text.primary",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                Page 2
                            </Button>
                            <Button
                                onClick={() => navigate("/page3")}
                                sx={{
                                    backgroundColor: "background.paper",
                                    color: "text.primary",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                Page 3
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
                        <Route path="/" element={<Page1 />} />
                        <Route path="/page1" element={<Page1 />} />
                        <Route path="/page2" element={<Page2 />} />
                        <Route path="/page3" element={<Page3 />} />
                    </Routes>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
