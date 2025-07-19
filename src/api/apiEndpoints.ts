const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const fetchDietPlanURL = `${API_BASE_URL}/diet`;
export const markMealCompleteURL = `${API_BASE_URL}/diet/complete`;
export const markMealIncompleteURL = `${API_BASE_URL}/diet/incomplete`;
export const updateDietPlanURL = `${API_BASE_URL}/diet/update`;
