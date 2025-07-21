import { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, Checkbox, TextField, Stack, Paper, Collapse, Divider, IconButton, CircularProgress } from "@mui/material";
import { Dayjs } from "dayjs";
import { CheckCircle, Close, Edit, ExpandLess, ExpandMore, RadioButtonUnchecked, Save } from "@mui/icons-material";
import { markExerciseComplete, updateWorkoutPlan } from "../../api/workoutApi";

type Workout = {
    id?: string;
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

interface WorkoutDayPanelProps {
    selectedDate: Dayjs;
    workoutData: {
        day: string;
        categories: WorkoutCategory[];
    } | null;
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
}

export const WorkoutContentPanel = ({ selectedDate, workoutData, loading, error, onRefresh }: WorkoutDayPanelProps) => {
    const [localWorkoutData, setLocalWorkoutData] = useState<{
        day: string;
        categories: WorkoutCategory[];
    } | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
    const [editingExercise, setEditingExercise] = useState<{
        categoryIndex: number;
        exerciseIndex: number;
    } | null>(null);

    useEffect(() => {
        if (workoutData) {
            setLocalWorkoutData(workoutData);
        } else {
            // No workout data for this day
            setLocalWorkoutData({
                day: selectedDate.format("dddd"),
                categories: [],
            });
        }
    }, [workoutData, selectedDate]);

    const handleExerciseChange = async (categoryIndex: number, exerciseIndex: number, field: keyof Workout, value: any) => {
        if (!localWorkoutData) return;

        const updatedWorkoutData = { ...localWorkoutData };
        const exercise = updatedWorkoutData.categories[categoryIndex].exercises[exerciseIndex];
        (exercise as any)[field] = value;

        setLocalWorkoutData(updatedWorkoutData);

        // Auto-save when marking complete
        if (field === "completed") {
            try {
                await markExerciseComplete(selectedDate.format("YYYY-MM-DD"), exercise.id || exercise.name);
            } catch (err) {
                console.error("Failed to update exercise status:", err);
                // Revert if failed
                exercise[field] = !value;
                setLocalWorkoutData({ ...updatedWorkoutData });
            }
        }
    };

    const saveWorkoutPlan = async () => {
        if (!localWorkoutData) return;

        try {
            await updateWorkoutPlan(selectedDate.format("YYYY-MM-DD"), localWorkoutData.categories);
            alert("Workout saved successfully!");
            onRefresh();
        } catch (err) {
            console.error("Failed to save workout:", err);
            alert("Failed to save workout. Please try again.");
        }
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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="error">{error}</Typography>
                <Button onClick={onRefresh} sx={{ mt: 2 }}>
                    Retry
                </Button>
            </Paper>
        );
    }

    if (!localWorkoutData) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "auto",
                minHeight: "100%",
                bgcolor: "background.default",
            }}
        >
            {localWorkoutData.categories.length === 0 ? (
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
                        {localWorkoutData.day === "Rest Day" ? "It's a rest day!" : "No workout planned for today"}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {localWorkoutData.day === "Rest Day" ? "Enjoy your recovery. You've earned it." : "Check your workout plan or add exercises."}
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ mt: 2 }}>
                    {localWorkoutData.categories.map((category, categoryIndex) => (
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

                    {localWorkoutData.categories.length > 0 && (
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
                                background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                                    transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
                            }}
                            onClick={saveWorkoutPlan}
                        >
                            Complete Today's Workout
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};
