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
    MenuItem,
    InputAdornment,
    Chip,
    Tooltip,
    useTheme,
    useMediaQuery,
    Divider,
    Grid,
} from "@mui/material";
import { Add, Delete, Edit, Check, Close, DragHandle, LocalFireDepartment, FitnessCenter, Grain, SetMeal } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
    onSave: (updatedData: DietPlan) => void;
    onCancel: () => void;
}

export const EditDietPlan: React.FC<EditDietPlanProps> = ({ dietData, onSave, onCancel }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [meals, setMeals] = useState<Meal[]>(dietData.meals);
    const [editingItem, setEditingItem] = useState<{ mealTime: string; itemName: string } | null>(null);
    const [newMealDialogOpen, setNewMealDialogOpen] = useState(false);
    const [newMealTime, setNewMealTime] = useState("");
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

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same meal
            const mealIndex = meals.findIndex((m) => m.time === source.droppableId);
            if (mealIndex === -1) return;

            const newItems = Array.from(meals[mealIndex].items);
            const [removed] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, removed);

            const updatedMeals = [...meals];
            updatedMeals[mealIndex] = {
                ...updatedMeals[mealIndex],
                items: newItems,
                total: calculateMealTotals(newItems),
            };

            setMeals(updatedMeals);
        } else {
            // Move between meals
            const sourceMealIndex = meals.findIndex((m) => m.time === source.droppableId);
            const destMealIndex = meals.findIndex((m) => m.time === destination.droppableId);
            if (sourceMealIndex === -1 || destMealIndex === -1) return;

            const sourceItems = Array.from(meals[sourceMealIndex].items);
            const destItems = Array.from(meals[destMealIndex].items);
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);

            const updatedMeals = [...meals];
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

            setMeals(updatedMeals);
        }
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

        setMeals(updatedMeals);
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

        setMeals(updatedMeals);
    };

    const addNewMeal = () => {
        if (!newMealTime || !newMealName) return;

        const newMeal: Meal = {
            time: newMealTime,
            meal: newMealName,
            items: [],
            total: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        };

        setMeals([...meals, newMeal]);
        setNewMealTime("");
        setNewMealName("");
        setNewMealDialogOpen(false);
    };

    const deleteMeal = (mealTime: string) => {
        setMeals(meals.filter((m) => m.time !== mealTime));
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

        setMeals(updatedMeals);
        setNewItemDialogOpen(false);
    };

    const handleSave = () => {
        const updatedData: DietPlan = {
            ...dietData,
            meals: meals,
            dailyTotal: meals.reduce(
                (acc, meal) => ({
                    calories: acc.calories + meal.total.calories,
                    protein: acc.protein + meal.total.protein,
                    carbs: acc.carbs + meal.total.carbs,
                    fats: acc.fats + meal.total.fats,
                }),
                { calories: 0, protein: 0, carbs: 0, fats: 0 }
            ),
        };

        onSave(updatedData);
    };

    return (
        <Box sx={{ p: isMobile ? 1 : 3 }}>
            <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="flex-start" spacing={2} mb={3}>
                <Typography variant="h5" fontWeight="bold" gutterBottom={isMobile}>
                    Edit Diet Plan
                </Typography>
                <Stack direction="row" spacing={1} width={isMobile ? "100%" : "auto"}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                        startIcon={<Close />}
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        startIcon={<Check />}
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                    >
                        Save
                    </Button>
                </Stack>
            </Stack>

            <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setNewMealDialogOpen(true)}
                sx={{ mb: 3 }}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
            >
                Add New Meal
            </Button>

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
                                <Chip
                                    icon={<FitnessCenter />}
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
                                    icon={<Grain />}
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
                                    icon={<SetMeal />}
                                    label={`${meal.total.fats}g fats`}
                                    size="small"
                                    sx={{
                                        bgcolor: "warning.light",
                                        color: "warning.contrastText",
                                        flex: { xs: "1 1 48%", sm: "unset" },
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
                                                                        setMeals(updatedMeals);
                                                                    }}
                                                                    fullWidth
                                                                    margin="dense"
                                                                />
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={12} sm={6} md={3}>
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
                                                                                setMeals(updatedMeals);
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
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
                                                                                setMeals(updatedMeals);
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
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
                                                                                setMeals(updatedMeals);
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6} md={3}>
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
                                                                                setMeals(updatedMeals);
                                                                            }}
                                                                            fullWidth
                                                                            margin="dense"
                                                                            InputProps={{
                                                                                endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
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
            <Dialog open={newMealDialogOpen} onClose={() => setNewMealDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Meal</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Meal Time"
                            value={newMealTime}
                            onChange={(e) => setNewMealTime(e.target.value)}
                            fullWidth
                            select
                            margin="normal"
                        >
                            {["Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner", "Evening Snack"].map((time) => (
                                <MenuItem key={time} value={time}>
                                    {time}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Meal Name" value={newMealName} onChange={(e) => setNewMealName(e.target.value)} fullWidth margin="normal" />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setNewMealDialogOpen(false)} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={addNewMeal} variant="contained" disabled={!newMealTime || !newMealName}>
                        Add Meal
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
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                        </Grid>
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
