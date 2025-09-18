import { useEffect, useState } from "react";
import { Box, Typography, Button, Chip, Checkbox, TextField, Stack, Paper, Collapse, IconButton, CircularProgress } from "@mui/material";
import { Dayjs } from "dayjs";
import { CheckCircle, Close, Edit, ExpandLess, ExpandMore, RadioButtonUnchecked, Save, Delete, DragHandle, Add } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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

interface WorkoutContentPanelProps {
    isMobile: boolean;
    selectedDate: Dayjs;
    workoutData: {
        day: string;
        categories: WorkoutCategory[];
    } | null;
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    direction: "left" | "right";
}

export const WorkoutContentPanel = ({ isMobile, selectedDate, workoutData, loading, error, onRefresh, direction }: WorkoutContentPanelProps) => {
    const [localWorkoutData, setLocalWorkoutData] = useState<{
        day: string;
        categories: WorkoutCategory[];
    } | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
    const [editingExercise, setEditingExercise] = useState<{
        categoryIndex: number;
        exerciseIndex: number;
    } | null>(null);
    const [newExercise, setNewExercise] = useState<Partial<Workout> | null>(null);

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

    const handleCreateExercise = () => {
        setNewExercise({
            name: "",
            completed: false,
            sets: 3,
            reps: 10,
            weight: 0,
            notes: "",
        });
    };

    const handleCancelCreate = () => {
        setNewExercise(null);
    };

    const handleSaveNewExercise = () => {
        if (!newExercise?.name?.trim()) return;

        // Add the new exercise to the first category (or create a new category if none exists)
        if (localWorkoutData) {
            const updatedWorkoutData = { ...localWorkoutData };
            if (updatedWorkoutData.categories.length === 0) {
                updatedWorkoutData.categories.push({
                    name: "Custom Exercises",
                    exercises: [newExercise as Workout],
                });
            } else {
                updatedWorkoutData.categories[0].exercises.push(newExercise as Workout);
            }
            setLocalWorkoutData(updatedWorkoutData);
        }
        setNewExercise(null);
    };

    const handleDeleteExercise = (categoryIndex: number, exerciseIndex: number) => {
        if (!localWorkoutData) return;

        const updatedWorkoutData = { ...localWorkoutData };
        updatedWorkoutData.categories[categoryIndex].exercises.splice(exerciseIndex, 1);

        // Remove category if empty
        if (updatedWorkoutData.categories[categoryIndex].exercises.length === 0) {
            updatedWorkoutData.categories.splice(categoryIndex, 1);
        }

        setLocalWorkoutData(updatedWorkoutData);
    };

    const onDragEnd = (result: any) => {
        // Handle drag and drop reordering if needed
        console.log("Drag ended", result);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    textAlign: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                    Failed to load workout plan
                </Typography>
                <Button
                    variant="contained"
                    onClick={onRefresh}
                    sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                        boxShadow: "none",
                        "&:hover": {
                            boxShadow: "0 4px 12px rgba(254, 107, 139, 0.3)",
                        },
                    }}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: { xs: 0, sm: 4 },
                bgcolor: "background.default",
                borderTop: "1px solid",
                borderColor: "divider",
                position: "relative",
                minHeight: isMobile ? "calc(100vh - 120px)" : "auto",
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: { xs: 0, sm: 2, md: 3 },
                    position: "relative",
                    overflowX: "hidden",
                }}
            >
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={selectedDate.toString()}
                        custom={direction}
                        initial={{ x: direction === "left" ? 100 : -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction === "left" ? -100 : 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ height: "100%" }}
                    >
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: "100%" }}>
                                        {/* New Exercise Form */}
                                        {newExercise && (
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    borderRadius: "12px",
                                                    border: "2px solid",
                                                    borderColor: "primary.main",
                                                    bgcolor: "background.paper",
                                                }}
                                            >
                                                <Stack spacing={2}>
                                                    <TextField
                                                        autoFocus
                                                        label="Exercise Name"
                                                        fullWidth
                                                        value={newExercise.name || ""}
                                                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                                        <TextField
                                                            label="Sets"
                                                            type="number"
                                                            size="small"
                                                            value={newExercise.sets || 0}
                                                            onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) || 0 })}
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            label="Reps"
                                                            type="number"
                                                            size="small"
                                                            value={newExercise.reps || 0}
                                                            onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) || 0 })}
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            label="Weight (kg)"
                                                            type="number"
                                                            size="small"
                                                            value={newExercise.weight || 0}
                                                            onChange={(e) =>
                                                                setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) || 0 })
                                                            }
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                                        <Button
                                                            onClick={handleSaveNewExercise}
                                                            variant="contained"
                                                            startIcon={<Save />}
                                                            disabled={!newExercise.name?.trim()}
                                                            size="small"
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button onClick={handleCancelCreate} variant="outlined" startIcon={<Close />} size="small">
                                                            Cancel
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        )}

                                        {!localWorkoutData || localWorkoutData.categories.length === 0 ? (
                                            <Box
                                                sx={{
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    p: 3,
                                                    textAlign: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <Typography variant="h6" color="text.secondary" fontWeight={500}>
                                                    {localWorkoutData?.day === "Rest Day" ? "It's a rest day!" : "No workout planned for today"}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {localWorkoutData?.day === "Rest Day"
                                                        ? "Enjoy your recovery. You've earned it."
                                                        : "Check your workout plan or add exercises."}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Add />}
                                                    onClick={handleCreateExercise}
                                                    sx={{
                                                        borderRadius: "12px",
                                                        textTransform: "none",
                                                        px: 3,
                                                        py: 1,
                                                        fontSize: "0.875rem",
                                                        fontWeight: 600,
                                                        background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            boxShadow: "0 4px 12px rgba(254, 107, 139, 0.3)",
                                                        },
                                                    }}
                                                >
                                                    Add Exercise
                                                </Button>
                                            </Box>
                                        ) : (
                                            <>
                                                {localWorkoutData.categories.map((category, categoryIndex) => (
                                                    <Paper
                                                        key={categoryIndex}
                                                        elevation={1}
                                                        sx={{
                                                            p: 2,
                                                            mb: 2,
                                                            borderRadius: "12px",
                                                            border: "1px solid",
                                                            borderColor: "divider",
                                                            bgcolor: "background.paper",
                                                            transition: "all 0.2s ease",
                                                            "&:hover": {
                                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                            },
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                mb: 2,
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => toggleCategory(categoryIndex)}
                                                        >
                                                            <Typography variant="h6" fontWeight={600}>
                                                                {category.name}
                                                            </Typography>
                                                            {expandedCategory === categoryIndex ? (
                                                                <ExpandLess sx={{ color: "primary.main" }} />
                                                            ) : (
                                                                <ExpandMore sx={{ color: "text.secondary" }} />
                                                            )}
                                                        </Box>

                                                        <Collapse in={expandedCategory === categoryIndex}>
                                                            {category.exercises.map((exercise, exerciseIndex) => (
                                                                <Draggable
                                                                    key={exerciseIndex}
                                                                    draggableId={`exercise-${exerciseIndex}`}
                                                                    index={exerciseIndex}
                                                                >
                                                                    {(provided) => (
                                                                        <Paper
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            elevation={0}
                                                                            sx={{
                                                                                p: 2,
                                                                                mb: 1,
                                                                                borderRadius: "8px",
                                                                                bgcolor: exercise.completed
                                                                                    ? "rgba(46, 125, 50, 0.05)"
                                                                                    : "transparent",
                                                                                border: exercise.completed
                                                                                    ? "1px solid rgba(46, 125, 50, 0.3)"
                                                                                    : "1px solid rgba(0,0,0,0.1)",
                                                                            }}
                                                                        >
                                                                            {editingExercise?.categoryIndex === categoryIndex &&
                                                                            editingExercise?.exerciseIndex === exerciseIndex ? (
                                                                                <Stack spacing={2}>
                                                                                    <TextField
                                                                                        autoFocus
                                                                                        label="Exercise Name"
                                                                                        fullWidth
                                                                                        value={exercise.name}
                                                                                        onChange={(e) =>
                                                                                            handleExerciseChange(
                                                                                                categoryIndex,
                                                                                                exerciseIndex,
                                                                                                "name",
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                        variant="outlined"
                                                                                        size="small"
                                                                                    />
                                                                                    <Box
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            gap: 2,
                                                                                            flexWrap: "wrap",
                                                                                            alignItems: "center",
                                                                                        }}
                                                                                    >
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
                                                                                        />
                                                                                        <Button
                                                                                            onClick={stopEditing}
                                                                                            variant="contained"
                                                                                            startIcon={<Save />}
                                                                                            size="small"
                                                                                        >
                                                                                            Save
                                                                                        </Button>
                                                                                        <Button
                                                                                            onClick={stopEditing}
                                                                                            variant="outlined"
                                                                                            startIcon={<Close />}
                                                                                            size="small"
                                                                                        >
                                                                                            Cancel
                                                                                        </Button>
                                                                                    </Box>
                                                                                </Stack>
                                                                            ) : (
                                                                                <Box
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "flex-start",
                                                                                        gap: 1.5,
                                                                                    }}
                                                                                >
                                                                                    <Box
                                                                                        {...provided.dragHandleProps}
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            cursor: "grab",
                                                                                            color: "text.secondary",
                                                                                            "&:active": {
                                                                                                cursor: "grabbing",
                                                                                            },
                                                                                            mt: 0.5,
                                                                                        }}
                                                                                    >
                                                                                        <DragHandle />
                                                                                    </Box>

                                                                                    <Checkbox
                                                                                        checked={exercise.completed}
                                                                                        onChange={(e) =>
                                                                                            handleExerciseChange(
                                                                                                categoryIndex,
                                                                                                exerciseIndex,
                                                                                                "completed",
                                                                                                e.target.checked
                                                                                            )
                                                                                        }
                                                                                        icon={<RadioButtonUnchecked />}
                                                                                        checkedIcon={<CheckCircle />}
                                                                                        sx={{
                                                                                            p: 0,
                                                                                            color: "text.secondary",
                                                                                            "&.Mui-checked": {
                                                                                                color: "primary.main",
                                                                                            },
                                                                                            mt: 0.5,
                                                                                        }}
                                                                                    />

                                                                                    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                                                                                        <Typography
                                                                                            variant="subtitle1"
                                                                                            sx={{
                                                                                                fontWeight: 600,
                                                                                                textDecoration: exercise.completed
                                                                                                    ? "line-through"
                                                                                                    : "none",
                                                                                                color: exercise.completed
                                                                                                    ? "text.secondary"
                                                                                                    : "text.primary",
                                                                                            }}
                                                                                        >
                                                                                            {exercise.name}
                                                                                        </Typography>
                                                                                        <Box
                                                                                            sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}
                                                                                        >
                                                                                            <Chip
                                                                                                label={`${exercise.sets} sets`}
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                sx={{ fontWeight: 500 }}
                                                                                            />
                                                                                            <Chip
                                                                                                label={`${exercise.reps} reps`}
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                sx={{ fontWeight: 500 }}
                                                                                            />
                                                                                            {exercise.weight > 0 && (
                                                                                                <Chip
                                                                                                    label={`${exercise.weight} kg`}
                                                                                                    size="small"
                                                                                                    color="primary"
                                                                                                    sx={{ fontWeight: 500 }}
                                                                                                />
                                                                                            )}
                                                                                        </Box>
                                                                                    </Box>

                                                                                    <Box
                                                                                        sx={{
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            gap: 1,
                                                                                            flexWrap: "wrap",
                                                                                        }}
                                                                                    >
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            onClick={() => startEditing(categoryIndex, exerciseIndex)}
                                                                                            sx={{ color: "text.secondary" }}
                                                                                        >
                                                                                            <Edit fontSize="small" />
                                                                                        </IconButton>
                                                                                        <IconButton
                                                                                            size="small"
                                                                                            onClick={() =>
                                                                                                handleDeleteExercise(categoryIndex, exerciseIndex)
                                                                                            }
                                                                                            sx={{ color: "text.secondary" }}
                                                                                        >
                                                                                            <Delete fontSize="small" />
                                                                                        </IconButton>
                                                                                    </Box>
                                                                                </Box>
                                                                            )}
                                                                        </Paper>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                        </Collapse>
                                                    </Paper>
                                                ))}

                                                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<Add />}
                                                        onClick={handleCreateExercise}
                                                        sx={{
                                                            borderRadius: "12px",
                                                            textTransform: "none",
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: "0.875rem",
                                                            fontWeight: 600,
                                                            background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                                            boxShadow: "none",
                                                            "&:hover": {
                                                                boxShadow: "0 4px 12px rgba(254, 107, 139, 0.3)",
                                                            },
                                                        }}
                                                    >
                                                        Add Exercise
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={saveWorkoutPlan}
                                                        sx={{
                                                            borderRadius: "12px",
                                                            textTransform: "none",
                                                            px: 3,
                                                            py: 1,
                                                            fontSize: "0.875rem",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Save Workout
                                                    </Button>
                                                </Box>
                                            </>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};
