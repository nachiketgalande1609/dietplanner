import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: localStorage.getItem("dietDarkMode") ? JSON.parse(localStorage.getItem("dietDarkMode")!) : false,
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem("dietDarkMode", JSON.stringify(state.darkMode));
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
            localStorage.setItem("dietDarkMode", JSON.stringify(state.darkMode));
        },
    },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
