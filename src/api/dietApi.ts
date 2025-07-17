import axios from "axios";
import { fetchDietPlanURL, markMealCompleteURL, markMealIncompleteURL } from "./apiEndpoints";

export const fetchDietPlan = async (date: string) => {
    try {
        const response = await axios.get(fetchDietPlanURL, {
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
        const response = await axios.post(markMealCompleteURL, {
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
        const response = await axios.delete(markMealIncompleteURL, {
            data: { date, mealTime },
        });
        return response.data;
    } catch (error) {
        console.error("Error marking meal incomplete:", error);
        throw error;
    }
};
