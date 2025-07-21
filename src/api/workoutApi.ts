// workoutApi.ts
import axios from "axios";
import { fetchWorkoutPlanURL, updateWorkoutPlanURL, markExerciseCompleteURL } from "./apiEndpoints";

export const fetchWorkoutPlan = async (date: string) => {
    try {
        const response = await axios.get(fetchWorkoutPlanURL, {
            params: { date },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching workout plan:", error);
        throw error;
    }
};

export const updateWorkoutPlan = async (date: string, workouts: any) => {
    try {
        const response = await axios.put(updateWorkoutPlanURL, {
            date,
            workouts,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating workout plan:", error);
        throw error;
    }
};

export const markExerciseComplete = async (date: string, exerciseId: string) => {
    try {
        const response = await axios.post(markExerciseCompleteURL, {
            date,
            exerciseId,
        });
        return response.data;
    } catch (error) {
        console.error("Error marking exercise complete:", error);
        throw error;
    }
};
