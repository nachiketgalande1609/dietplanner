// api/tasksApi.ts
import axios from "axios";
import { TASK_REORDER_URL, TASKS_URL } from "./apiEndpoints";

export interface Task {
    id: string;
    title: string;
    description?: string;
    date: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    repeat?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        endDate?: string;
    };
}

// Fetch all tasks
export const fetchTasks = async () => {
    try {
        const response = await axios.get(TASKS_URL);
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to fetch tasks");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

// Fetch tasks for a specific date
export const fetchTasksByDate = async (date: string) => {
    try {
        const response = await axios.get(TASKS_URL, {
            params: { date },
        });
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to fetch tasks");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error fetching tasks by date:", error);
        throw error;
    }
};

// Create a new task
export const createTask = async (task: Omit<Task, "id">) => {
    try {
        const response = await axios.post(TASKS_URL, task);
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to create task");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
};

// Update an existing task
export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    try {
        const response = await axios.put(`${TASKS_URL}/${id}`, task);
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to update task");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
    try {
        const response = await axios.delete(`${TASKS_URL}/${id}`);
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to delete task");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};

// Toggle task completion status
export const toggleTaskCompletion = async (id: string, completed: boolean): Promise<Task> => {
    try {
        const response = await axios.patch(`${TASKS_URL}/${id}/completion`, { completed });
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to toggle task completion");
        }
        return response.data.data;
    } catch (error) {
        console.error("Error toggling task completion:", error);
        throw error;
    }
};

// Reorder tasks
export const reorderTasks = async (taskId: string, newIndex: number): Promise<void> => {
    try {
        const response = await axios.patch(TASK_REORDER_URL, {
            taskId,
            newIndex,
        });
        if (!response.data.success) {
            throw new Error(response.data.error || "Failed to reorder tasks");
        }
    } catch (error) {
        console.error("Error reordering tasks:", error);
        throw error;
    }
};
