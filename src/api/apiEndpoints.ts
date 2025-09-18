// Base Backend URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Authentication
export const userLoginURL = `${API_BASE_URL}/api/user/login`;
export const userRegisterURL = `${API_BASE_URL}/api/user/register`;

// Diet
export const fetchDietPlanURL = `${API_BASE_URL}/api/diet`;
export const markMealCompleteURL = `${API_BASE_URL}/api/diet/complete`;
export const markMealIncompleteURL = `${API_BASE_URL}/api/diet/incomplete`;
export const updateDietPlanURL = `${API_BASE_URL}/api/diet/update`;

// Workout
export const fetchWorkoutPlanURL = `${API_BASE_URL}/api/workout`;
export const updateWorkoutPlanURL = `${API_BASE_URL}/api/workout/update`;
export const markExerciseCompleteURL = `${API_BASE_URL}/api/workout/complete`;

// Tasks
export const TASKS_URL = `${API_BASE_URL}/api/tasks`;
export const TASK_REORDER_URL = `${API_BASE_URL}/api/tasks/reorder`;
