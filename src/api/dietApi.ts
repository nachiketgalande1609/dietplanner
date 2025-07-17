import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchDietPlan = async (date: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/diet`, {
            params: { date },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching diet plan:", error);
        throw error;
    }
};

export const markMealComplete = async (date: string, mealTime: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/diet/complete`, {
            date,
            mealTime,
        });
        return response.data;
    } catch (error) {
        console.error("Error marking meal complete:", error);
        throw error;
    }
};

export const markMealIncomplete = async (date: string, mealTime: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/diet/complete`, {
            data: { date, mealTime },
        });
        return response.data;
    } catch (error) {
        console.error("Error marking meal incomplete:", error);
        throw error;
    }
};
