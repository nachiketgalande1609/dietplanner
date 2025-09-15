import axios from "axios";
import { userLoginURL, userRegisterURL } from "./apiEndpoints";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    age?: number;
    birthDate?: string;
    weight?: number;
    height?: number;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
    error?: string;
}

export interface RegisterData {
    email: string;
    firstName: string;
    lastName: string;
    age: number;
    birthDate: string;
    weight: number;
    height: number;
    username: string;
    password: string;
}

export const userLogin = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post(userLoginURL, {
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        console.error("Error during login:", error);
        if (error.response?.data) {
            throw new Error(error.response.data.error || "Login failed");
        }
        throw new Error("Network error during login");
    }
};

export const userRegister = async (userData: RegisterData): Promise<LoginResponse> => {
    try {
        const response = await axios.post(userRegisterURL, userData);
        return response.data;
    } catch (error: any) {
        console.error("Error during registration:", error);
        if (error.response?.data) {
            // Handle missing fields error specifically
            if (error.response.data.missing_fields) {
                throw new Error(`Missing required fields: ${error.response.data.missing_fields.join(", ")}`);
            }
            throw new Error(error.response.data.error || "Registration failed");
        }
        throw new Error("Network error during registration");
    }
};
