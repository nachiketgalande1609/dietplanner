import React, { useState } from "react";
import { Box, Typography, Button, Chip, Checkbox, TextField, Stack, Paper, Collapse, Divider, IconButton } from "@mui/material";
import { Dayjs } from "dayjs";
import { CheckCircle, Close, Edit, ExpandLess, ExpandMore, RadioButtonUnchecked, Save } from "@mui/icons-material";

type WorkoutDay = {
    day: string;
    categories: WorkoutCategory[];
};

type Workout = {
    name: string;
    completed: boolean;
    sets: number;
    reps: number;
    weight: number;
    notes: string;
};

type WorkoutCategory = {
    name: string;
    exercises: Workout[];
};

const workoutRoutine: WorkoutDay[] = [
    {
        day: "Monday",
        categories: [
            {
                name: "Chest",
                exercises: [
                    { name: "Barbell Bench Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Incline Barbell Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Dumbell Fly", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "Machine Chest Press", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                ],
            },
            {
                name: "Shoulder",
                exercises: [
                    { name: "Overhead Dumbbell Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Lateral Dumbbell Raises", completed: false, sets: 3, reps: 12, weight: 0, notes: "" },
                    { name: "Front Dumbbell Raises", completed: false, sets: 3, reps: 12, weight: 0, notes: "" },
                ],
            },
            {
                name: "Triceps",
                exercises: [
                    { name: "Close Grip Bench Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Triceps Cable Pushdown", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                ],
            },
        ],
    },
    {
        day: "Tuesday",
        categories: [
            {
                name: "Back",
                exercises: [
                    { name: "Wide Grip Lat Pulldowns", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Bent-Over Barbell Rows", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Deadlifts", completed: false, sets: 3, reps: 6, weight: 0, notes: "" },
                ],
            },
            {
                name: "Biceps",
                exercises: [
                    { name: "Dumbbell Curls", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "EZ Bar Curls", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "Hammer Curls", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                ],
            },
        ],
    },
    {
        day: "Wednesday",
        categories: [
            {
                name: "Legs",
                exercises: [
                    { name: "Barbell Squats", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Leg Extensions", completed: false, sets: 3, reps: 12, weight: 0, notes: "" },
                    { name: "Leg Curls", completed: false, sets: 3, reps: 12, weight: 0, notes: "" },
                    { name: "Calf Raises", completed: false, sets: 3, reps: 15, weight: 0, notes: "" },
                ],
            },
        ],
    },
    {
        day: "Thursday",
        categories: [
            {
                name: "Abs",
                exercises: [
                    { name: "Leg Raises", completed: false, sets: 3, reps: 15, weight: 0, notes: "" },
                    { name: "Crunches", completed: false, sets: 3, reps: 20, weight: 0, notes: "" },
                    { name: "Planks", completed: false, sets: 3, reps: 1, weight: 0, notes: "Hold for 60 seconds" },
                ],
            },
        ],
    },
    {
        day: "Friday",
        categories: [
            {
                name: "Chest",
                exercises: [
                    { name: "Dumbbell Bench Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Incline Dumbbell Press", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Pushups", completed: false, sets: 3, reps: 15, weight: 0, notes: "" },
                ],
            },
            {
                name: "Back",
                exercises: [
                    { name: "Seated Cable Rows", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "T Bar Rows", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                ],
            },
            {
                name: "Shoulder",
                exercises: [
                    { name: "Arnold Press", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "Face Pulls", completed: false, sets: 3, reps: 12, weight: 0, notes: "" },
                ],
            },
        ],
    },
    {
        day: "Saturday",
        categories: [
            {
                name: "Legs",
                exercises: [
                    { name: "Front Barbell Squats", completed: false, sets: 3, reps: 8, weight: 0, notes: "" },
                    { name: "Lunges", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                ],
            },
            {
                name: "Triceps",
                exercises: [{ name: "Skull Crushers", completed: false, sets: 3, reps: 10, weight: 0, notes: "" }],
            },
            {
                name: "Biceps",
                exercises: [
                    { name: "Concentration Curls", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "Preacher Curls", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                ],
            },
        ],
    },
    {
        day: "Sunday",
        categories: [
            {
                name: "Abs",
                exercises: [
                    { name: "Ab Wheel Roll", completed: false, sets: 3, reps: 10, weight: 0, notes: "" },
                    { name: "Bicycle Crunches", completed: false, sets: 3, reps: 20, weight: 0, notes: "" },
                ],
            },
        ],
    },
];
export const WorkoutDayPanel: React.FC<{ selectedDate: Dayjs }> = ({ selectedDate }) => {
    const dayOfWeek = selectedDate.format("dddd");
    const todayWorkout = workoutRoutine.find((day) => day.day === dayOfWeek) || { day: "Rest Day", categories: [] };
    const [workoutData, setWorkoutData] = useState<WorkoutDay>(todayWorkout);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
    const [editingExercise, setEditingExercise] = useState<{ categoryIndex: number; exerciseIndex: number } | null>(null);

    const handleExerciseChange = (categoryIndex: number, exerciseIndex: number, field: keyof Workout, value: any) => {
        const updatedWorkoutData = { ...workoutData };
        const exercise = updatedWorkoutData.categories[categoryIndex].exercises[exerciseIndex];
        (exercise as any)[field] = value;
        setWorkoutData(updatedWorkoutData);
    };

    const toggleCategory = (index: number) => {
        setExpandedCategory(expandedCategory === index ? null : index);
    };

    const startEditing = (categoryIndex: number, exerciseIndex: number) => {
        setEditingExercise({ categoryIndex, exerciseIndex });
    };

    const stopEditing = () => {
        setEditingExercise(null);
    };

    return (
        <Box
            sx={{
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {todayWorkout.categories.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        textAlign: "center",
                        p: 4,
                        borderRadius: 4,
                        bgcolor: "background.paper",
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
                    }}
                >
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        It's a rest day!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enjoy your recovery. You've earned it.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {workoutData.categories.map((category, categoryIndex) => (
                        <Paper
                            key={categoryIndex}
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                overflow: "hidden",
                                bgcolor: "background.paper",
                                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                                borderLeft: "4px solid",
                                borderLeftColor: "primary.main",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                    cursor: "pointer",
                                    bgcolor: "rgba(25, 118, 210, 0.05)",
                                }}
                                onClick={() => toggleCategory(categoryIndex)}
                            >
                                <Typography variant="h6" fontWeight={700}>
                                    {category.name}
                                </Typography>
                                {expandedCategory === categoryIndex ? (
                                    <ExpandLess sx={{ color: "primary.main" }} />
                                ) : (
                                    <ExpandMore sx={{ color: "text.secondary" }} />
                                )}
                            </Box>

                            <Collapse in={expandedCategory === categoryIndex}>
                                <Divider />
                                <Box sx={{ p: 2 }}>
                                    {category.exercises.map((exercise, exerciseIndex) => (
                                        <Box
                                            key={exerciseIndex}
                                            sx={{
                                                mb: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: exercise.completed ? "rgba(46, 125, 50, 0.05)" : "transparent",
                                                border: exercise.completed ? "1px solid rgba(46, 125, 50, 0.3)" : "1px solid rgba(0,0,0,0.1)",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Checkbox
                                                        icon={<RadioButtonUnchecked />}
                                                        checkedIcon={<CheckCircle sx={{ color: "success.main" }} />}
                                                        checked={exercise.completed}
                                                        onChange={(e) =>
                                                            handleExerciseChange(categoryIndex, exerciseIndex, "completed", e.target.checked)
                                                        }
                                                        sx={{ p: 0 }}
                                                    />
                                                    <Typography variant="subtitle1" fontWeight={600}>
                                                        {exercise.name}
                                                    </Typography>
                                                </Box>
                                                {editingExercise?.categoryIndex === categoryIndex &&
                                                editingExercise?.exerciseIndex === exerciseIndex ? (
                                                    <Box>
                                                        <IconButton onClick={stopEditing} size="small">
                                                            <Close fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <IconButton onClick={() => startEditing(categoryIndex, exerciseIndex)} size="small">
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    mt: 1,
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <Chip label={`${exercise.sets} sets`} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                                                <Chip label={`${exercise.reps} reps`} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                                                {exercise.weight > 0 && (
                                                    <Chip label={`${exercise.weight} kg`} size="small" color="primary" sx={{ fontWeight: 500 }} />
                                                )}
                                            </Box>

                                            {editingExercise?.categoryIndex === categoryIndex && editingExercise?.exerciseIndex === exerciseIndex && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                                        <TextField
                                                            label="Sets"
                                                            type="number"
                                                            size="small"
                                                            value={exercise.sets}
                                                            onChange={(e) =>
                                                                handleExerciseChange(
                                                                    categoryIndex,
                                                                    exerciseIndex,
                                                                    "sets",
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            label="Reps"
                                                            type="number"
                                                            size="small"
                                                            value={exercise.reps}
                                                            onChange={(e) =>
                                                                handleExerciseChange(
                                                                    categoryIndex,
                                                                    exerciseIndex,
                                                                    "reps",
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            label="Weight (kg)"
                                                            type="number"
                                                            size="small"
                                                            value={exercise.weight}
                                                            onChange={(e) =>
                                                                handleExerciseChange(
                                                                    categoryIndex,
                                                                    exerciseIndex,
                                                                    "weight",
                                                                    parseFloat(e.target.value) || 0
                                                                )
                                                            }
                                                            variant="outlined"
                                                            fullWidth
                                                        />
                                                    </Stack>
                                                    <TextField
                                                        label="Notes"
                                                        fullWidth
                                                        size="small"
                                                        value={exercise.notes}
                                                        onChange={(e) => handleExerciseChange(categoryIndex, exerciseIndex, "notes", e.target.value)}
                                                        variant="outlined"
                                                        multiline
                                                        rows={2}
                                                    />
                                                    <Button variant="contained" startIcon={<Save />} onClick={stopEditing} sx={{ mt: 2 }} fullWidth>
                                                        Save Changes
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Paper>
                    ))}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: "1rem",
                            fontWeight: 600,
                            textTransform: "none",
                            background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            "&:hover": {
                                boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                                transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease",
                        }}
                        onClick={() => alert("Workout saved!")}
                    >
                        Complete Today's Workout
                    </Button>
                </Box>
            )}
        </Box>
    );
};
