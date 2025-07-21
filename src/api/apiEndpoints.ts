const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const fetchDietPlanURL = `${API_BASE_URL}/api/diet`;
export const markMealCompleteURL = `${API_BASE_URL}/api/diet/complete`;
export const markMealIncompleteURL = `${API_BASE_URL}/api/diet/incomplete`;
export const updateDietPlanURL = `${API_BASE_URL}/api/diet/update`;
