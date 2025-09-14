import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    age?: number;
    birthDate?: string;
    weight?: number;
    height?: number;
}

interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    token: string | null;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isCheckingAuth = false;

            // Persist to localStorage
            localStorage.setItem("authToken", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isCheckingAuth = false;

            // Clear localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
        },
        setCheckingAuth: (state, action: PayloadAction<boolean>) => {
            state.isCheckingAuth = action.payload;
        },
        updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        },
    },
});

export const { setUser, logout, setCheckingAuth, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
