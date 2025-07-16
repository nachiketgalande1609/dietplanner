import { createTheme, type PaletteMode, type ThemeOptions } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
    const isLight = mode === "light";

    return {
        palette: {
            mode,
            primary: {
                main: isLight ? "#1976d2" : "#90caf9",
            },
            secondary: {
                main: isLight ? "#9c27b0" : "#ce93d8",
            },
            background: {
                default: isLight ? "#f5f5f5" : "#121212",
                paper: isLight ? "#ffffff" : "#1e1e1e",
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },
        },
    };
};

export const theme = (mode: PaletteMode) => createTheme(getDesignTokens(mode));
