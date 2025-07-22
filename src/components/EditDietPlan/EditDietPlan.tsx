// EditDietPlan.tsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    TextField,
    Paper,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Chip,
    Tooltip,
    useTheme,
    useMediaQuery,
    Divider,
} from "@mui/material";
import { Add, Delete, Edit, DragHandle, LocalFireDepartment, AccessTime, LocalDining as NutritionIcon, LocalDining } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface NutritionValues {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

interface MealItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

interface Meal {
    time: string;
    meal: string;
    items: MealItem[];
    total: NutritionValues;
}

interface DietPlan {
    date: string;
    meals: Meal[];
    dailyTotal: NutritionValues;
}

interface EditDietPlanProps {
    dietData: DietPlan;
    onChange: (updatedData: DietPlan) => void;
}

export const EditDietPlan: React.FC<EditDietPlanProps> = ({ dietData, onChange }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [editingItem, setEditingItem] = useState<{ mealTime: string; itemName: string } | null>(null);
    const [newMealDialogOpen, setNewMealDialogOpen] = useState(false);
    const [newMealTime, setNewMealTime] = useState<string>("");
    const [newMealName, setNewMealName] = useState("");
    const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
    const [newItemData, setNewItemData] = useState<MealItem>({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
    });
    const [currentMealForNewItem, setCurrentMealForNewItem] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
    const [newMealItems, setNewMealItems] = useState<MealItem[]>([]);

    const sortMealsByTime = (meals: Meal[]): Meal[] => {
        return [...meals].sort((a, b) => {
            const parseTime = (time: string) => {
                // Handle "HH:mm AM/PM" format
                if (time.includes("AM") || time.includes("PM")) {
                    const [timePart, period] = time.split(" ");
                    const [hours, minutes] = timePart.split(":");
                    let hourNum = parseInt(hours, 10);
                    if (period === "PM" && hourNum !== 12) hourNum += 12;
                    if (period === "AM" && hourNum === 12) hourNum = 0;
                    return hourNum * 60 + parseInt(minutes, 10);
                }
                // Handle "HH:mm" format
                const [hours, minutes] = time.split(":");
                return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
            };

            return parseTime(a.time) - parseTime(b.time);
        });
    };

    const standardizeTimeFormat = (time: string): string => {
        if (time.includes("AM") || time.includes("PM")) return time;

        const [hours, minutes] = time.split(":");
        const hourNum = parseInt(hours, 10);
        const period = hourNum >= 12 ? "PM" : "AM";
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minutes} ${period}`;
    };

    const [meals, setMeals] = useState<Meal[]>(
        sortMealsByTime(
            dietData.meals.map((meal) => ({
                ...meal,
                time: standardizeTimeFormat(meal.time),
            }))
        )
    );

    const calculateMealTotals = (items: MealItem[]): NutritionValues => {
        return items.reduce(
            (acc, item) => ({
                calories: acc.calories + item.calories,
                protein: acc.protein + item.protein,
                carbs: acc.carbs + item.carbs,
                fats: acc.fats + item.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const { source, destination } = result;
        let updatedMeals = [...meals];

        if (source.droppableId === destination.droppableId) {
            const mealIndex = meals.findIndex((m) => m.time === source.droppableId);
            if (mealIndex === -1) return;

            const newItems = Array.from(meals[mealIndex].items);
            const [removed] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, removed);

            updatedMeals[mealIndex] = {
                ...updatedMeals[mealIndex],
                items: newItems,
                total: calculateMealTotals(newItems),
            };
        } else {
            const sourceMealIndex = meals.findIndex((m) => m.time === source.droppableId);
            const destMealIndex = meals.findIndex((m) => m.time === destination.droppableId);
            if (sourceMealIndex === -1 || destMealIndex === -1) return;

            const sourceItems = Array.from(meals[sourceMealIndex].items);
            const destItems = Array.from(meals[destMealIndex].items);
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            updatedMeals[sourceMealIndex] = {
                ...updatedMeals[sourceMealIndex],
                items: sourceItems,
                total: calculateMealTotals(sourceItems),
            };
            updatedMeals[destMealIndex] = {
                ...updatedMeals[destMealIndex],
                items: destItems,
                total: calculateMealTotals(destItems),
            };
        }

        setMeals(sortMealsByTime(updatedMeals));

        // Calculate new daily total
        const newDailyTotal = updatedMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.total.calories,
                protein: acc.protein + meal.total.protein,
                carbs: acc.carbs + meal.total.carbs,
                fats: acc.fats + meal.total.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        // Notify parent of the change
        onChange({
            ...dietData,
            meals: updatedMeals,
            dailyTotal: newDailyTotal,
        });
    };

    const startEditItem = (mealTime: string, itemName: string) => {
        setEditingItem({ mealTime, itemName });
    };

    const saveEditItem = (mealTime: string, originalItemName: string, updatedItem: MealItem) => {
        const mealIndex = meals.findIndex((m) => m.time === mealTime);
        if (mealIndex === -1) return;

        const itemIndex = meals[mealIndex].items.findIndex((i) => i.name === originalItemName);
        if (itemIndex === -1) return;

        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items[itemIndex] = updatedItem;
        updatedMeals[mealIndex].total = calculateMealTotals(updatedMeals[mealIndex].items);

        setMeals(sortMealsByTime(updatedMeals));

        // Calculate new daily total
        const newDailyTotal = updatedMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.total.calories,
                protein: acc.protein + meal.total.protein,
                carbs: acc.carbs + meal.total.carbs,
                fats: acc.fats + meal.total.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        // Notify parent of the change
        onChange({
            ...dietData,
            meals: updatedMeals,
            dailyTotal: newDailyTotal,
        });

        setEditingItem(null);
    };

    const deleteItem = (mealTime: string, itemName: string) => {
        const mealIndex = meals.findIndex((m) => m.time === mealTime);
        if (mealIndex === -1) return;

        const updatedItems = meals[mealIndex].items.filter((i) => i.name !== itemName);
        const updatedMeals = [...meals];
        updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            items: updatedItems,
            total: calculateMealTotals(updatedItems),
        };

        setMeals(sortMealsByTime(updatedMeals));

        // Calculate new daily total
        const newDailyTotal = updatedMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.total.calories,
                protein: acc.protein + meal.total.protein,
                carbs: acc.carbs + meal.total.carbs,
                fats: acc.fats + meal.total.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        // Notify parent of the change
        onChange({
            ...dietData,
            meals: updatedMeals,
            dailyTotal: newDailyTotal,
        });
    };

    const deleteMeal = (mealTime: string) => {
        const updatedMeals = meals.filter((m) => m.time !== mealTime);
        setMeals(sortMealsByTime(updatedMeals));

        const newDailyTotal = updatedMeals.reduce(
            (acc, meal) => ({
                calories: acc.calories + meal.total.calories,
                protein: acc.protein + meal.total.protein,
                carbs: acc.carbs + meal.total.carbs,
                fats: acc.fats + meal.total.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        onChange({
            ...dietData,
            meals: updatedMeals,
            dailyTotal: newDailyTotal,
        });
    };

    const openAddItemDialog = (mealTime: string) => {
        setCurrentMealForNewItem(mealTime);
        setNewItemData({
            name: "",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
        });
        setNewItemDialogOpen(true);
    };

    const addNewItem = () => {
        if (!currentMealForNewItem || !newItemData.name) return;

        const mealIndex = meals.findIndex((m) => m.time === currentMealForNewItem);
        if (mealIndex === -1) return;

        const newItem: MealItem = {
            name: newItemData.name,
            calories: newItemData.calories,
            protein: newItemData.protein,
            carbs: newItemData.carbs,
            fats: newItemData.fats,
        };

        const updatedItems = [...meals[mealIndex].items, newItem];
        const updatedMeals = [...meals];
        updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            items: updatedItems,
            total: calculateMealTotals(updatedItems),
        };

        setMeals(sortMealsByTime(updatedMeals));
        setNewItemDialogOpen(false);
    };

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    position: "relative",
                    px: 1.5,
                    py: 1,
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                        color: theme.palette.text.primary,
                        letterSpacing: "-0.5px",
                    }}
                >
                    Edit Meal Plan
                </Typography>

                <Tooltip title="Add meal" placement="top" arrow>
                    <IconButton
                        onClick={() => setNewMealDialogOpen(true)}
                        sx={{
                            backgroundColor: "background.paper",
                            color: theme.palette.text.primary,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: "12px",
                            "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.dark,
                            },
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                        }}
                        size="medium"
                        disableRipple
                    >
                        <Add fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <DragDropContext onDragEnd={handleDragEnd}>
                {meals.map((meal) => (
                    <Paper
                        key={meal.time}
                        elevation={2}
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            overflow: "hidden",
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "primary.main",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Stack>
                                <Typography variant="subtitle1" fontWeight="bold" color="white">
                                    {meal.time}
                                </Typography>
                                <Typography variant="body2" color="white">
                                    {meal.meal}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Add food item">
                                    <IconButton size="small" onClick={() => openAddItemDialog(meal.time)} sx={{ color: "white" }}>
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete meal">
                                    <IconButton size="small" onClick={() => deleteMeal(meal.time)} sx={{ color: "white" }}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>

                        <Box sx={{ p: isMobile ? 1 : 2 }}>
                            <Stack direction="row" spacing={1} alignItems={isMobile ? "flex-start" : "center"} flexWrap="wrap" useFlexGap mb={2}>
                                <Chip
                                    label={`${meal.total.protein}g protein`}
                                    size="small"
                                    sx={{
                                        bgcolor: "primary.light",
                                        color: "primary.contrastText",
                                        flex: { xs: "1 1 48%", sm: "unset" },
                                        mb: { xs: 1, sm: 0 },
                                    }}
                                />
                                <Chip
                                    label={`${meal.total.carbs}g carbs`}
                                    size="small"
                                    sx={{
                                        bgcolor: "success.light",
                                        color: "success.contrastText",
                                        flex: { xs: "1 1 48%", sm: "unset" },
                                        mb: { xs: 1, sm: 0 },
                                    }}
                                />
                                <Chip
                                    label={`${meal.total.fats}g fats`}
                                    size="small"
                                    sx={{
                                        bgcolor: "warning.light",
                                        color: "warning.contrastText",
                                        flex: { xs: "1 1 48%", sm: "unset" },
                                    }}
                                />
                                <Chip
                                    icon={<LocalFireDepartment />}
                                    label={`${meal.total.calories} kcal`}
                                    size="small"
                                    sx={{
                                        bgcolor: "error.light",
                                        color: "error.contrastText",
                                        flex: { xs: "1 1 48%", sm: "unset" },
                                        mb: { xs: 1, sm: 0 },
                                    }}
                                />
                            </Stack>

                            <Droppable droppableId={meal.time}>
                                {(provided: any) => (
                                    <List
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        dense
                                        sx={{
                                            bgcolor: "background.paper",
                                            p: 0,
                                        }}
                                    >
                                        {meal.items.map((item, index) => (
                                            <Draggable key={item.name} draggableId={item.name} index={index}>
                                                {(provided: any) => (
                                                    <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        sx={{
                                                            p: 1,
                                                            mb: 1,
                                                            borderRadius: 1,
                                                            bgcolor: "background.default",
                                                            border: `1px solid ${theme.palette.divider}`,
                                                        }}
                                                    >
                                                        <Box {...provided.dragHandleProps} sx={{ mr: 1 }}>
                                                            <DragHandle />
                                                        </Box>

                                                        {editingItem?.mealTime === meal.time && editingItem?.itemName === item.name ? (
                                                            <Stack spacing={1} sx={{ flex: 1 }}>
                                                                <TextField
                                                                    size="small"
                                                                    value={item.name}
                                                                    onChange={(e) => {
                                                                        const updatedItem = {
                                                                            ...item,
                                                                            name: e.target.value,
                                                                        };
                                                                        const mealIndex = meals.findIndex((m) => m.time === meal.time);
                                                                        const itemIndex = meals[mealIndex].items.findIndex(
                                                                            (i) => i.name === item.name
                                                                        );
                                                                        const updatedMeals = [...meals];
                                                                        updatedMeals[mealIndex].items[itemIndex] = updatedItem;
                                                                        setMeals(sortMealsByTime(updatedMeals));
                                                                    }}
                                                                    fullWidth
                                                                    margin="dense"
                                                                />
                                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                                    <Box sx={{ flex: 1, minWidth: 120 }}>
                                                                        <TextField
                                                                            size="small"
                                                                            label="Calories"
                                                                            type="number"
                                                                            value={item.calories}
                                                                            onChange={(e) => {
                                                                                const updatedItem = {
                                                                                    ...item,
                                                                                    calories: Number(e.target.value),
                                                                                };
                                                                                const mealIndex = meals.findIndex((m) => m.time === meal.time);
                                                                                const itemIndex = meals[mealIndex].items.findIndex(
                                                                                    (i) => i.name === item.name
                                                                                );
                                                                                const updatedMeals = [...meals];
                                                                                updatedMeals[mealIndex].items[itemIndex] = updatedItem;
                                                                                updatedMeals[mealIndex].total = calculateMealTotals(
                                                                                    updatedMeals[mealIndex].items
                                                                                );
                                                                                setMeals(sortMealsByTime(updatedMeals));
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{ flex: 1, minWidth: 120 }}>
                                                                        <TextField
                                                                            size="small"
                                                                            label="Protein"
                                                                            type="number"
                                                                            value={item.protein}
                                                                            onChange={(e) => {
                                                                                const updatedItem = {
                                                                                    ...item,
                                                                                    protein: Number(e.target.value),
                                                                                };
                                                                                const mealIndex = meals.findIndex((m) => m.time === meal.time);
                                                                                const itemIndex = meals[mealIndex].items.findIndex(
                                                                                    (i) => i.name === item.name
                                                                                );
                                                                                const updatedMeals = [...meals];
                                                                                updatedMeals[mealIndex].items[itemIndex] = updatedItem;
                                                                                updatedMeals[mealIndex].total = calculateMealTotals(
                                                                                    updatedMeals[mealIndex].items
                                                                                );
                                                                                setMeals(sortMealsByTime(updatedMeals));
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{ flex: 1, minWidth: 120 }}>
                                                                        <TextField
                                                                            size="small"
                                                                            label="Carbs"
                                                                            type="number"
                                                                            value={item.carbs}
                                                                            onChange={(e) => {
                                                                                const updatedItem = {
                                                                                    ...item,
                                                                                    carbs: Number(e.target.value),
                                                                                };
                                                                                const mealIndex = meals.findIndex((m) => m.time === meal.time);
                                                                                const itemIndex = meals[mealIndex].items.findIndex(
                                                                                    (i) => i.name === item.name
                                                                                );
                                                                                const updatedMeals = [...meals];
                                                                                updatedMeals[mealIndex].items[itemIndex] = updatedItem;
                                                                                updatedMeals[mealIndex].total = calculateMealTotals(
                                                                                    updatedMeals[mealIndex].items
                                                                                );
                                                                                setMeals(sortMealsByTime(updatedMeals));
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Box sx={{ flex: 1, minWidth: 120 }}>
                                                                        <TextField
                                                                            size="small"
                                                                            label="Fats"
                                                                            type="number"
                                                                            value={item.fats}
                                                                            onChange={(e) => {
                                                                                const updatedItem = {
                                                                                    ...item,
                                                                                    fats: Number(e.target.value),
                                                                                };
                                                                                const mealIndex = meals.findIndex((m) => m.time === meal.time);
                                                                                const itemIndex = meals[mealIndex].items.findIndex(
                                                                                    (i) => i.name === item.name
                                                                                );
                                                                                const updatedMeals = [...meals];
                                                                                updatedMeals[mealIndex].items[itemIndex] = updatedItem;
                                                                                updatedMeals[mealIndex].total = calculateMealTotals(
                                                                                    updatedMeals[mealIndex].items
                                                                                );
                                                                                setMeals(sortMealsByTime(updatedMeals));
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                                    <Button
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={() => setEditingItem(null)}
                                                                        sx={{ minWidth: 80 }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        size="small"
                                                                        variant="contained"
                                                                        onClick={() => saveEditItem(meal.time, item.name, item)}
                                                                        sx={{ minWidth: 80 }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </Stack>
                                                            </Stack>
                                                        ) : (
                                                            <>
                                                                <ListItemText
                                                                    primary={item.name}
                                                                    secondary={
                                                                        <Stack
                                                                            direction={isMobile ? "column" : "row"}
                                                                            spacing={isMobile ? 0.5 : 2}
                                                                            mt={0.5}
                                                                            divider={isMobile ? null : <Divider orientation="vertical" flexItem />}
                                                                        >
                                                                            <Typography variant="caption">{item.calories} kcal</Typography>
                                                                            <Typography variant="caption">{item.protein}g protein</Typography>
                                                                            <Typography variant="caption">{item.carbs}g carbs</Typography>
                                                                            <Typography variant="caption">{item.fats}g fats</Typography>
                                                                        </Stack>
                                                                    }
                                                                    sx={{ flex: 1, mr: 1 }}
                                                                />
                                                                <ListItemSecondaryAction>
                                                                    <Stack direction="row" spacing={0.5}>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => startEditItem(meal.time, item.name)}
                                                                            sx={{ color: "text.secondary" }}
                                                                        >
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => deleteItem(meal.time, item.name)}
                                                                            sx={{ color: "error.main" }}
                                                                        >
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Stack>
                                                                </ListItemSecondaryAction>
                                                            </>
                                                        )}
                                                    </ListItem>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </List>
                                )}
                            </Droppable>
                        </Box>
                    </Paper>
                ))}
            </DragDropContext>
            {/* Add New Meal Dialog */}
            // Updated Add New Meal Dialog with inline food item editing
            <Dialog
                open={newMealDialogOpen}
                onClose={() => {
                    setNewMealDialogOpen(false);
                    setNewMealItems([]);
                }}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "visible",
                        background: theme.palette.background.paper,
                        boxShadow: theme.shadows[10],
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        position: "relative",
                        pt: 4,
                        px: 3,
                        pb: 2,
                        textAlign: "center",
                        "&:after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "80%",
                            height: "1px",
                            background: `linear-gradient(90deg, transparent, ${theme.palette.divider}, transparent)`,
                        },
                    }}
                >
                    <Typography variant="h6" component="div" fontWeight={600}>
                        Create New Meal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Add meal time and food items
                    </Typography>
                </Box>

                <DialogContent sx={{ px: 4, py: 3 }}>
                    <Stack spacing={3}>
                        {/* Basic Meal Info */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.default,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={600} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                                <AccessTime fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Meal Details
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            label="Meal Time *"
                                            value={selectedTime}
                                            onChange={(newValue) => {
                                                if (newValue && dayjs.isDayjs(newValue)) {
                                                    setSelectedTime(newValue);
                                                    const hours = newValue.hour();
                                                    const minutes = newValue.minute();
                                                    const period = hours >= 12 ? "PM" : "AM";
                                                    const displayHour = hours % 12 || 12;
                                                    setNewMealTime(`${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`);
                                                } else {
                                                    setSelectedTime(null);
                                                    setNewMealTime("");
                                                }
                                            }}
                                            ampm={true}
                                            minutesStep={1}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    variant: "outlined",
                                                    size: "small",
                                                    sx: {
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                            background: theme.palette.background.paper,
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        label="Meal Name *"
                                        value={newMealName}
                                        onChange={(e) => setNewMealName(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder="e.g. Breakfast, Lunch, Snack"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                                background: theme.palette.background.paper,
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>

                        {/* Food Items Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.default,
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ display: "flex", alignItems: "center" }}>
                                    <LocalDining fontSize="small" sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                    Food Items
                                </Typography>
                            </Box>

                            {/* Add New Item Form */}
                            <Paper elevation={0} sx={{ p: 2, mb: 2, border: `1px dashed ${theme.palette.divider}`, borderRadius: 1 }}>
                                <Stack spacing={2}>
                                    <TextField
                                        label="Food Name"
                                        value={newItemData.name}
                                        onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                                        fullWidth
                                        size="small"
                                    />
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                                        <Box sx={{ flex: 1, minWidth: 120 }}>
                                            <TextField
                                                label="Calories"
                                                type="number"
                                                value={newItemData.calories}
                                                onChange={(e) => setNewItemData({ ...newItemData, calories: Number(e.target.value) })}
                                                fullWidth
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 120 }}>
                                            <TextField
                                                label="Protein"
                                                type="number"
                                                value={newItemData.protein}
                                                onChange={(e) => setNewItemData({ ...newItemData, protein: Number(e.target.value) })}
                                                fullWidth
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 120 }}>
                                            <TextField
                                                label="Carbs"
                                                type="number"
                                                value={newItemData.carbs}
                                                onChange={(e) => setNewItemData({ ...newItemData, carbs: Number(e.target.value) })}
                                                fullWidth
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                }}
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 120 }}>
                                            <TextField
                                                label="Fats"
                                                type="number"
                                                value={newItemData.fats}
                                                onChange={(e) => setNewItemData({ ...newItemData, fats: Number(e.target.value) })}
                                                fullWidth
                                                size="small"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (newItemData.name) {
                                                    setNewMealItems([...newMealItems, newItemData]);
                                                    setNewItemData({
                                                        name: "",
                                                        calories: 0,
                                                        protein: 0,
                                                        carbs: 0,
                                                        fats: 0,
                                                    });
                                                }
                                            }}
                                            disabled={!newItemData.name}
                                            size="small"
                                            sx={{ minWidth: 120 }}
                                        >
                                            Add Item
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Food Items List */}
                            {newMealItems.length > 0 ? (
                                <List dense sx={{ bgcolor: "background.paper", p: 0 }}>
                                    {newMealItems.map((item, index) => (
                                        <ListItem
                                            key={index}
                                            sx={{
                                                p: 1,
                                                mb: 1,
                                                borderRadius: 1,
                                                bgcolor: "background.default",
                                                border: `1px solid ${theme.palette.divider}`,
                                            }}
                                        >
                                            <ListItemText
                                                primary={item.name}
                                                secondary={
                                                    <Stack
                                                        direction={isMobile ? "column" : "row"}
                                                        spacing={isMobile ? 0.5 : 2}
                                                        mt={0.5}
                                                        divider={isMobile ? null : <Divider orientation="vertical" flexItem />}
                                                    >
                                                        <Typography variant="caption">{item.calories} kcal</Typography>
                                                        <Typography variant="caption">{item.protein}g protein</Typography>
                                                        <Typography variant="caption">{item.carbs}g carbs</Typography>
                                                        <Typography variant="caption">{item.fats}g fats</Typography>
                                                    </Stack>
                                                }
                                                sx={{ flex: 1, mr: 1 }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setNewMealItems(newMealItems.filter((_, i) => i !== index));
                                                    }}
                                                    sx={{ color: "error.main" }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                        border: `1px dashed ${theme.palette.divider}`,
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No food items added yet
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Nutrition Summary */}
                        {newMealItems.length > 0 && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    background: theme.palette.background.default,
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={600} mb={1} sx={{ display: "flex", alignItems: "center" }}>
                                    <NutritionIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
                                    Meal Nutrition Summary
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                    <Chip
                                        label={`${newMealItems.reduce((sum, item) => sum + item.protein, 0)}g protein`}
                                        size="small"
                                        sx={{
                                            bgcolor: "primary.light",
                                            color: "primary.contrastText",
                                        }}
                                    />
                                    <Chip
                                        label={`${newMealItems.reduce((sum, item) => sum + item.carbs, 0)}g carbs`}
                                        size="small"
                                        sx={{
                                            bgcolor: "success.light",
                                            color: "success.contrastText",
                                        }}
                                    />
                                    <Chip
                                        label={`${newMealItems.reduce((sum, item) => sum + item.fats, 0)}g fats`}
                                        size="small"
                                        sx={{
                                            bgcolor: "warning.light",
                                            color: "warning.contrastText",
                                        }}
                                    />
                                    <Chip
                                        icon={<LocalFireDepartment />}
                                        label={`${newMealItems.reduce((sum, item) => sum + item.calories, 0)} kcal`}
                                        size="small"
                                        sx={{
                                            bgcolor: "error.light",
                                            color: "error.contrastText",
                                        }}
                                    />
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Button
                        onClick={() => {
                            setNewMealDialogOpen(false);
                            setNewMealItems([]);
                        }}
                        variant="text"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            color: theme.palette.text.secondary,
                            "&:hover": {
                                bgcolor: theme.palette.action.hover,
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // Add the new meal sorting and saving code here
                            const standardizedTime = standardizeTimeFormat(newMealTime);

                            const newMeal: Meal = {
                                time: standardizedTime,
                                meal: newMealName,
                                items: newMealItems,
                                total: calculateMealTotals(newMealItems),
                            };

                            const updatedMeals = sortMealsByTime([...meals, newMeal]);
                            setMeals(updatedMeals);

                            setNewMealTime("");
                            setNewMealName("");
                            setNewMealItems([]);
                            setNewMealDialogOpen(false);

                            const newDailyTotal = updatedMeals.reduce(
                                (acc, meal) => ({
                                    calories: acc.calories + meal.total.calories,
                                    protein: acc.protein + meal.total.protein,
                                    carbs: acc.carbs + meal.total.carbs,
                                    fats: acc.fats + meal.total.fats,
                                }),
                                { calories: 0, protein: 0, carbs: 0, fats: 0 }
                            );

                            onChange({
                                ...dietData,
                                meals: updatedMeals,
                                dailyTotal: newDailyTotal,
                            });
                        }}
                        variant="contained"
                        disabled={!newMealTime || !newMealName || newMealItems.length === 0}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            boxShadow: "none",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                            },
                        }}
                        startIcon={<Add />}
                    >
                        Add Meal
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Add Food Item Dialog */}
            <Dialog open={newItemDialogOpen} onClose={() => setNewItemDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Food Item</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Food Name *"
                            value={newItemData.name}
                            onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Calories *"
                                    type="number"
                                    value={newItemData.calories}
                                    onChange={(e) => setNewItemData({ ...newItemData, calories: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Protein *"
                                    type="number"
                                    value={newItemData.protein}
                                    onChange={(e) => setNewItemData({ ...newItemData, protein: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Carbs *"
                                    type="number"
                                    value={newItemData.carbs}
                                    onChange={(e) => setNewItemData({ ...newItemData, carbs: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Fats *"
                                    type="number"
                                    value={newItemData.fats}
                                    onChange={(e) => setNewItemData({ ...newItemData, fats: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setNewItemDialogOpen(false)} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            setNewMealItems([...newMealItems, newItemData]);
                            setNewItemData({
                                name: "",
                                calories: 0,
                                protein: 0,
                                carbs: 0,
                                fats: 0,
                            });
                            setNewItemDialogOpen(false);
                        }}
                        variant="contained"
                        disabled={!newItemData.name || !newItemData.calories}
                    >
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Add New Item Dialog */}
            <Dialog open={newItemDialogOpen} onClose={() => setNewItemDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Food Item</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Food Name"
                            value={newItemData.name}
                            onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Calories"
                                    type="number"
                                    value={newItemData.calories}
                                    onChange={(e) => setNewItemData({ ...newItemData, calories: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Protein"
                                    type="number"
                                    value={newItemData.protein}
                                    onChange={(e) => setNewItemData({ ...newItemData, protein: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Carbohydrates"
                                    type="number"
                                    value={newItemData.carbs}
                                    onChange={(e) => setNewItemData({ ...newItemData, carbs: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 120 }}>
                                <TextField
                                    label="Fats"
                                    type="number"
                                    value={newItemData.fats}
                                    onChange={(e) => setNewItemData({ ...newItemData, fats: Number(e.target.value) })}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setNewItemDialogOpen(false)} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={addNewItem} variant="contained" disabled={!newItemData.name}>
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
