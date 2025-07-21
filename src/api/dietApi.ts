import axios from "axios";
import { fetchDietPlanURL, markMealCompleteURL, markMealIncompleteURL, updateDietPlanURL } from "./apiEndpoints";

export const fetchDietPlan = async (date: string) => {
    try {
        const response = await axios.get(fetchDietPlanURL, {
            params: { date },
        });
        return response.data.data;
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
        return response.data.data;
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
        return response.data.data;
    } catch (error) {
        console.error("Error marking meal incomplete:", error);
        throw error;
    }
};

export const updateDietPlan = async (updatedData: any) => {
    try {
        const response = await axios.put(updateDietPlanURL, updatedData);
        return response.data; // Return full response
    } catch (error) {
        console.error("Error updating diet plan:", error);
        throw error;
    }
};
