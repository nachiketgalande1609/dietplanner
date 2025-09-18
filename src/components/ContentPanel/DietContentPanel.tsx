import React, { useState, type ReactElement } from "react";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Chip as MuiChip,
    Stack,
    Avatar,
    useTheme,
    IconButton,
    Collapse,
    useMediaQuery,
    styled,
    type SxProps,
    type Theme,
    Button,
    CircularProgress,
} from "@mui/material";
import {
    Restaurant,
    CheckCircle,
    Circle,
    LocalFireDepartment,
    ExpandMore,
    FitnessCenter,
    Grain,
    SetMeal,
    TrendingUp,
    Check,
    CalendarMonth,
    Edit,
    Delete,
    DragHandle,
    Save,
    Close,
    RadioButtonUnchecked,
    Add,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Styled Chip component
const Chip = styled(MuiChip)(({ theme }) => ({
    "&.MuiChip-sizeSmall": {
        height: 20,
        fontSize: "0.7rem",
    },
    "&.MuiChip-outlined": {
        backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[800],
        borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[600],
    },
    "&.MuiChip-colorSuccess": {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
}));

interface NutritionChipProps {
    icon: ReactElement<{ sx?: SxProps<Theme> }>;
    value: number;
    unit: string;
    color: string;
}

interface DietContentPanelProps {
    showDayContent: boolean;
    isMobile?: boolean;
    dietData?: any;
    completedMeals: Record<string, boolean>;
    onToggleMeal: (mealTime: string) => void;
    selectedDate: any;
    direction: "left" | "right";
    loading: boolean;
}

export const DietContentPanel: React.FC<DietContentPanelProps> = ({
    showDayContent,
    isMobile = false,
    dietData,
    completedMeals,
    onToggleMeal,
    selectedDate,
    direction,
    loading,
}) => {
    const theme = useTheme();
    const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});
    const smallMobile = useMediaQuery(theme.breakpoints.down(400));

    if (!showDayContent && !isMobile) {
        return (
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.palette.text.secondary,
                    background: theme.palette.background.default,
                    borderRadius: 2,
                }}
            >
                <Stack alignItems="center" spacing={1}>
                    <Restaurant sx={{ fontSize: 48, color: theme.palette.text.disabled }} />
                    <Typography variant="h6" color="text.disabled">
                        Select a date to view diet plan
                    </Typography>
                </Stack>
            </Box>
        );
    }

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

    if (!dietData) {
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
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: "1px dashed",
                        borderColor: "divider",
                        maxWidth: 400,
                        width: "100%",
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            bgcolor: theme.palette.action.hover,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <CalendarMonth
                            sx={{
                                fontSize: 40,
                                color: theme.palette.text.secondary,
                            }}
                        />
                    </Box>

                    <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom>
                        No Meal Plan Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        There's no diet plan available for {selectedDate.format("MMMM D, YYYY")}.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                            /* Handle create new plan */
                        }}
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
                        Create Plan
                    </Button>
                </Paper>
            </Box>
        );
    }

    const handleToggleExpand = (mealTime: string) => {
        setExpandedMeals((prev) => ({
            ...prev,
            [mealTime]: !prev[mealTime],
        }));
    };

    const completedCount = Object.values(completedMeals).filter(Boolean).length;
    const totalMeals = dietData.meals?.length || 0;
    const progress = totalMeals > 0 ? Math.round((completedCount / totalMeals) * 100) : 0;

    // Function to check if a meal was missed (not completed but a later meal is completed)
    const isMealMissed = (mealIndex: number) => {
        if (completedMeals[dietData.meals[mealIndex].time]) return false; // Meal is completed

        // Check if any subsequent meal is completed
        for (let i = mealIndex + 1; i < dietData.meals.length; i++) {
            if (completedMeals[dietData.meals[i].time]) {
                return true;
            }
        }
        return false;
    };

    const NutritionChip = ({ icon, value, unit, color }: NutritionChipProps) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
            {React.cloneElement(icon, {
                sx: {
                    fontSize: "0.8rem",
                    color: theme.palette.mode === "light" ? color : theme.palette.getContrastText(theme.palette.background.paper),
                },
            })}
            <Typography variant="caption" color="text.secondary">
                {value}
                {unit}
            </Typography>
        </Stack>
    );

    return (
        <Box
            sx={{
                flexGrow: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                borderRadius: { xs: 0, sm: 4 },
                bgcolor: "background.default",
                borderTop: isMobile ? "none" : "1px solid",
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
                        <DragDropContext onDragEnd={() => {}}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: "100%" }}>
                                        {/* Progress Header */}
                                        {(!isMobile || showDayContent) && (
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    borderRadius: "12px",
                                                    bgcolor: "background.paper",
                                                    border: "1px solid",
                                                    borderColor: "divider",
                                                    borderLeft: `4px solid ${progress === 100 ? theme.palette.success.main : theme.palette.primary.main}`,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: "50%",
                                                                bgcolor: progress === 100 ? "success.light" : "primary.light",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                        >
                                                            {progress === 100 ? (
                                                                <Check fontSize="small" sx={{ color: theme.palette.success.contrastText }} />
                                                            ) : (
                                                                <TrendingUp fontSize="small" sx={{ color: theme.palette.background.default }} />
                                                            )}
                                                        </Box>
                                                        <Box>
                                                            <Typography
                                                                variant="subtitle1"
                                                                fontWeight={600}
                                                                fontSize={smallMobile ? "0.875rem" : "1rem"}
                                                            >
                                                                Daily Progress
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {completedCount} of {totalMeals} meals completed
                                                            </Typography>
                                                        </Box>
                                                    </Stack>

                                                    <Box
                                                        sx={{
                                                            bgcolor: progress === 100 ? "success.50" : "primary.50",
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: "12px",
                                                            minWidth: 60,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            fontWeight={700}
                                                            color={progress === 100 ? "success.dark" : "primary.dark"}
                                                        >
                                                            {progress}%
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Progress Bar */}
                                                <Box
                                                    sx={{ position: "relative", height: 8, borderRadius: 4, bgcolor: "grey.100", overflow: "hidden" }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: 0,
                                                            top: 0,
                                                            height: "100%",
                                                            width: `${progress}%`,
                                                            bgcolor: progress === 100 ? "success.main" : "primary.main",
                                                            borderRadius: 4,
                                                            transition: "width 1s ease-out, background-color 0.5s ease",
                                                        }}
                                                    />
                                                </Box>
                                            </Paper>
                                        )}

                                        {dietData.meals?.length > 0 ? (
                                            dietData.meals.map((meal: any, index: number) => {
                                                const isCompleted = !!completedMeals[meal.time];
                                                const isExpanded = !!expandedMeals[meal.time];
                                                const isMissed = isMealMissed(index);

                                                return (
                                                    <Draggable key={index} draggableId={`meal-${index}`} index={index}>
                                                        {(provided) => (
                                                            <Paper
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                elevation={1}
                                                                sx={{
                                                                    p: 2,
                                                                    mb: 1,
                                                                    borderRadius: "12px",
                                                                    bgcolor: "background.paper",
                                                                    border: "1px solid",
                                                                    borderColor: "divider",
                                                                    borderLeft: `4px solid ${
                                                                        isCompleted
                                                                            ? theme.palette.success.main
                                                                            : isMissed
                                                                              ? theme.palette.error.main
                                                                              : theme.palette.divider
                                                                    }`,
                                                                    opacity: isCompleted ? 0.7 : 1,
                                                                    transition: "all 0.2s ease",
                                                                    "&:hover": {
                                                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                                    },
                                                                }}
                                                            >
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
                                                                        checked={isCompleted}
                                                                        onChange={() => onToggleMeal(meal.time)}
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

                                                                    <Box
                                                                        sx={{
                                                                            flexGrow: 1,
                                                                            overflow: "hidden",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={() => handleToggleExpand(meal.time)}
                                                                    >
                                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                                            <Avatar
                                                                                sx={{
                                                                                    bgcolor: isCompleted
                                                                                        ? "success.dark"
                                                                                        : isMissed
                                                                                          ? "error.dark"
                                                                                          : "primary.light",
                                                                                    width: 32,
                                                                                    height: 32,
                                                                                }}
                                                                            >
                                                                                <Restaurant
                                                                                    fontSize="small"
                                                                                    sx={{ color: theme.palette.common.white }}
                                                                                />
                                                                            </Avatar>
                                                                            <Box sx={{ flex: 1 }}>
                                                                                <Typography
                                                                                    variant="subtitle1"
                                                                                    fontWeight={600}
                                                                                    fontSize={smallMobile ? "0.875rem" : "1rem"}
                                                                                    color={
                                                                                        isMissed || isCompleted ? "text.secondary" : "text.primary"
                                                                                    }
                                                                                >
                                                                                    {meal.time}
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    color={
                                                                                        isMissed || isCompleted ? "text.secondary" : "text.primary"
                                                                                    }
                                                                                    sx={{
                                                                                        fontSize: smallMobile ? "0.75rem" : "0.875rem",
                                                                                    }}
                                                                                >
                                                                                    {meal.meal}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>

                                                                        <Stack
                                                                            direction="row"
                                                                            spacing={1}
                                                                            alignItems="center"
                                                                            flexWrap="wrap"
                                                                            useFlexGap
                                                                            sx={{ mt: 0.5 }}
                                                                        >
                                                                            <Chip
                                                                                label={`${meal.items.length} items`}
                                                                                size="small"
                                                                                variant="outlined"
                                                                            />
                                                                            <NutritionChip
                                                                                icon={<FitnessCenter />}
                                                                                value={meal.total.protein}
                                                                                unit="g"
                                                                                color={
                                                                                    isMissed ? theme.palette.error.main : theme.palette.primary.main
                                                                                }
                                                                            />
                                                                            <NutritionChip
                                                                                icon={<Grain />}
                                                                                value={meal.total.carbs}
                                                                                unit="g"
                                                                                color={
                                                                                    isMissed ? theme.palette.error.main : theme.palette.secondary.main
                                                                                }
                                                                            />
                                                                            <NutritionChip
                                                                                icon={<SetMeal />}
                                                                                value={meal.total.fats}
                                                                                unit="g"
                                                                                color={
                                                                                    isMissed ? theme.palette.error.main : theme.palette.warning.main
                                                                                }
                                                                            />
                                                                            <NutritionChip
                                                                                icon={<LocalFireDepartment />}
                                                                                value={meal.total.calories}
                                                                                unit="kcal"
                                                                                color={isMissed ? theme.palette.error.main : theme.palette.error.main}
                                                                            />
                                                                        </Stack>

                                                                        {isMissed && (
                                                                            <Chip
                                                                                label="Missed"
                                                                                size="small"
                                                                                sx={{
                                                                                    mt: 1,
                                                                                    backgroundColor: theme.palette.error.main,
                                                                                    color: theme.palette.error.contrastText,
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>

                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleToggleExpand(meal.time);
                                                                        }}
                                                                        sx={{
                                                                            color: "text.secondary",
                                                                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                                                            transition: theme.transitions.create("transform", {
                                                                                duration: theme.transitions.duration.shortest,
                                                                            }),
                                                                        }}
                                                                    >
                                                                        <ExpandMore fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                                    <Box
                                                                        sx={{
                                                                            mt: 2,
                                                                            p: 2,
                                                                            backgroundColor: theme.palette.background.default,
                                                                            borderRadius: "8px",
                                                                        }}
                                                                    >
                                                                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                                                            Meal Items
                                                                        </Typography>
                                                                        <List dense sx={{ py: 0 }}>
                                                                            {meal.items.map((item: any, itemIndex: number) => (
                                                                                <ListItem
                                                                                    key={itemIndex}
                                                                                    sx={{
                                                                                        py: 0.5,
                                                                                        px: 0,
                                                                                    }}
                                                                                >
                                                                                    <ListItemText
                                                                                        primary={
                                                                                            <Typography
                                                                                                variant="body2"
                                                                                                fontSize={smallMobile ? "0.8125rem" : "0.875rem"}
                                                                                                color={"text.primary"}
                                                                                            >
                                                                                                {item.name}
                                                                                            </Typography>
                                                                                        }
                                                                                        secondary={
                                                                                            <Stack
                                                                                                direction="row"
                                                                                                spacing={1}
                                                                                                alignItems="center"
                                                                                                flexWrap="wrap"
                                                                                                useFlexGap
                                                                                                sx={{ pt: 0.5 }}
                                                                                            >
                                                                                                <NutritionChip
                                                                                                    icon={<FitnessCenter />}
                                                                                                    value={item.protein}
                                                                                                    unit="g"
                                                                                                    color={
                                                                                                        isMissed
                                                                                                            ? theme.palette.error.main
                                                                                                            : theme.palette.primary.main
                                                                                                    }
                                                                                                />
                                                                                                <NutritionChip
                                                                                                    icon={<Grain />}
                                                                                                    value={item.carbs}
                                                                                                    unit="g"
                                                                                                    color={
                                                                                                        isMissed
                                                                                                            ? theme.palette.error.main
                                                                                                            : theme.palette.secondary.main
                                                                                                    }
                                                                                                />
                                                                                                <NutritionChip
                                                                                                    icon={<SetMeal />}
                                                                                                    value={item.fats}
                                                                                                    unit="g"
                                                                                                    color={
                                                                                                        isMissed
                                                                                                            ? theme.palette.error.main
                                                                                                            : theme.palette.warning.main
                                                                                                    }
                                                                                                />
                                                                                                <NutritionChip
                                                                                                    icon={<LocalFireDepartment />}
                                                                                                    value={item.calories}
                                                                                                    unit="kcal"
                                                                                                    color={
                                                                                                        isMissed
                                                                                                            ? theme.palette.error.main
                                                                                                            : theme.palette.error.main
                                                                                                    }
                                                                                                />
                                                                                            </Stack>
                                                                                        }
                                                                                        secondaryTypographyProps={{
                                                                                            component: "div",
                                                                                        }}
                                                                                    />
                                                                                </ListItem>
                                                                            ))}
                                                                        </List>
                                                                    </Box>
                                                                </Collapse>
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                );
                                            })
                                        ) : (
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
                                                    No meals planned for {selectedDate.format("MMMM D")}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Add />}
                                                    onClick={() => {
                                                        /* Handle add meal */
                                                    }}
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
                                                    Add Meal
                                                </Button>
                                            </Box>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {/* Daily Summary */}
                        {(!isMobile || showDayContent) && dietData.dailyTotal && (
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    mt: 2,
                                    borderRadius: "12px",
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Daily Summary
                                </Typography>
                                <Stack spacing={2}>
                                    {/* Calories */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            borderRadius: "8px",
                                            bgcolor: theme.palette.error.light,
                                            borderLeft: "4px solid",
                                            borderColor: theme.palette.error.main,
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <LocalFireDepartment fontSize="small" sx={{ color: theme.palette.error.dark }} />
                                                <Typography variant="body1" fontWeight={500} sx={{ color: theme.palette.error.dark }}>
                                                    Calories
                                                </Typography>
                                            </Stack>
                                            <Stack alignItems="flex-end" spacing={0.5}>
                                                <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.error.dark }}>
                                                    {dietData.dailyTotal.calories}
                                                    <Box component="span" sx={{ opacity: 0.7, fontSize: "0.9rem" }}>
                                                        / 2400
                                                    </Box>
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: theme.palette.error.dark }}>
                                                    kcal
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Paper>

                                    {/* Macros Row */}
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        {/* Protein */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                flex: 1,
                                                borderRadius: "8px",
                                                bgcolor: theme.palette.primary.light,
                                                borderLeft: "4px solid",
                                                borderColor: theme.palette.primary.main,
                                            }}
                                        >
                                            <Stack direction="column" spacing={0.5}>
                                                <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.primary.dark }}>
                                                    Protein
                                                </Typography>
                                                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.primary.dark }}>
                                                        {dietData.dailyTotal.protein}
                                                    </Typography>
                                                    <Typography variant="body2" fontSize="0.8rem" sx={{ color: theme.palette.primary.dark }}>
                                                        / 190g
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Paper>

                                        {/* Carbs */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                flex: 1,
                                                borderRadius: "8px",
                                                bgcolor: theme.palette.success.light,
                                                borderLeft: "4px solid",
                                                borderColor: theme.palette.success.main,
                                            }}
                                        >
                                            <Stack direction="column" spacing={0.5}>
                                                <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.success.dark }}>
                                                    Carbs
                                                </Typography>
                                                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.success.dark }}>
                                                        {dietData.dailyTotal.carbs}
                                                    </Typography>
                                                    <Typography variant="body2" fontSize="0.8rem" sx={{ color: theme.palette.success.dark }}>
                                                        / 200g
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Paper>

                                        {/* Fats */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                flex: 1,
                                                borderRadius: "8px",
                                                bgcolor: theme.palette.warning.light,
                                                borderLeft: "4px solid",
                                                borderColor: theme.palette.warning.main,
                                            }}
                                        >
                                            <Stack direction="column" spacing={0.5}>
                                                <Typography variant="body2" fontWeight={500} sx={{ color: theme.palette.warning.dark }}>
                                                    Fats
                                                </Typography>
                                                <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                                    <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.warning.dark }}>
                                                        {dietData.dailyTotal.fats}
                                                    </Typography>
                                                    <Typography variant="body2" fontSize="0.8rem" sx={{ color: theme.palette.warning.dark }}>
                                                        / 75g
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                </Stack>
                            </Paper>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};
