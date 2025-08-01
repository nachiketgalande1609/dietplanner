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
    Divider,
    Chip as MuiChip,
    LinearProgress,
    Stack,
    Avatar,
    useTheme,
    IconButton,
    Collapse,
    useMediaQuery,
    styled,
} from "@mui/material";
import { Restaurant, CheckCircle, Circle, LocalFireDepartment, ExpandMore, FitnessCenter, Grain, SetMeal } from "@mui/icons-material";
import dietPlan from "../../diet.json";

// Styled Chip component that properly respects theme
const Chip = styled(MuiChip)(({ theme }) => ({
    // Small size adjustments
    "&.MuiChip-sizeSmall": {
        height: 20,
        fontSize: "0.7rem",
    },
    // Outline variant adjustments
    "&.MuiChip-outlined": {
        backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[800],
        borderColor: theme.palette.mode === "light" ? theme.palette.grey[300] : theme.palette.grey[600],
    },
    // Success state
    "&.MuiChip-colorSuccess": {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },
}));

interface NutritionChipProps {
    icon: ReactElement;
    value: number;
    unit: string;
    color: string;
}

interface DayContentPanelProps {
    showDayContent: boolean;
    isMobile?: boolean;
}

export const DayContentPanel: React.FC<DayContentPanelProps> = ({ showDayContent, isMobile = false }) => {
    const theme = useTheme();
    const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
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

    const handleToggleMeal = (mealTime: string) => {
        setCompletedMeals((prev) => ({
            ...prev,
            [mealTime]: !prev[mealTime],
        }));
    };

    const handleToggleExpand = (mealTime: string) => {
        setExpandedMeals((prev) => ({
            ...prev,
            [mealTime]: !prev[mealTime],
        }));
    };

    const completedCount = Object.values(completedMeals).filter(Boolean).length;
    const totalMeals = dietPlan.meals.length;
    const progress = Math.round((completedCount / totalMeals) * 100);

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
                display: "flex",
                flexDirection: "column",
                height: "auto",
                minHeight: "100%",
                bgcolor: "background.default",
            }}
        >
            {(!isMobile || showDayContent) && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1, sm: 3 },
                        mb: { xs: 1, sm: 2 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1" fontWeight={600} fontSize={smallMobile ? "0.875rem" : "1rem"}>
                                Daily Progress
                            </Typography>
                            <Chip label={`${completedCount}/${totalMeals} meals`} size="small" variant="outlined" color="default" />
                        </Stack>
                        <Chip
                            label={`${progress}%`}
                            color={progress === 100 ? "success" : "primary"}
                            variant={progress === 100 ? "filled" : "outlined"}
                            sx={{
                                fontWeight: 600,
                                fontSize: smallMobile ? "0.75rem" : "0.875rem",
                            }}
                        />
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        color={progress === 100 ? "success" : "primary"}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 5,
                            },
                        }}
                    />
                </Paper>
            )}

            <List sx={{ width: "100%", flex: 1, py: 0 }}>
                {dietPlan.meals.map((meal, index) => {
                    const isCompleted = !!completedMeals[meal.time];
                    const isExpanded = !!expandedMeals[meal.time];

                    return (
                        <React.Fragment key={index}>
                            <Paper
                                elevation={isMobile ? 0 : 1}
                                sx={{
                                    mb: { xs: 1, sm: 2 },
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    borderLeft: `4px solid ${isCompleted ? theme.palette.success.main : theme.palette.divider}`,
                                    bgcolor: "background.paper",
                                }}
                            >
                                <ListItem
                                    sx={{
                                        backgroundColor: isCompleted ? theme.palette.success.light : "inherit",
                                        pr: { xs: 8, sm: 10 },
                                        py: { xs: 1, sm: 1.5 },
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleToggleExpand(meal.time)}
                                >
                                    <ListItemSecondaryAction sx={{ right: { xs: 36, sm: 48 } }}>
                                        <Checkbox
                                            edge="end"
                                            checked={isCompleted}
                                            onChange={() => handleToggleMeal(meal.time)}
                                            icon={<Circle fontSize="small" />}
                                            checkedIcon={<CheckCircle color="success" fontSize="small" />}
                                            size={smallMobile ? "small" : "medium"}
                                        />
                                    </ListItemSecondaryAction>

                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            size={smallMobile ? "small" : "medium"}
                                            sx={{
                                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: theme.transitions.create("transform", {
                                                    duration: theme.transitions.duration.shortest,
                                                }),
                                            }}
                                        >
                                            <ExpandMore fontSize={smallMobile ? "small" : "medium"} />
                                        </IconButton>
                                    </ListItemSecondaryAction>

                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: isCompleted ? "success.light" : "primary.light",
                                                    color: isCompleted ? "success.dark" : "primary.dark",
                                                    width: { xs: 28, sm: 32 },
                                                    height: { xs: 28, sm: 32 },
                                                    display: { xs: "none", sm: "flex" },
                                                }}
                                            >
                                                <Restaurant fontSize="small" />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                                    <Typography variant="subtitle1" fontWeight={600} fontSize={smallMobile ? "0.875rem" : "1rem"}>
                                                        {meal.time}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color={isCompleted ? "success.dark" : "text.secondary"}
                                                        sx={{
                                                            fontStyle: isCompleted ? "italic" : "normal",
                                                            fontSize: smallMobile ? "0.75rem" : "0.875rem",
                                                        }}
                                                    >
                                                        {meal.meal}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                                                    {!smallMobile && <Chip label={`${meal.items.length} items`} size="small" variant="outlined" />}
                                                    <NutritionChip
                                                        icon={<FitnessCenter />}
                                                        value={meal.total.protein}
                                                        unit="g"
                                                        color={theme.palette.primary.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<Grain />}
                                                        value={meal.total.carbs}
                                                        unit="g"
                                                        color={theme.palette.secondary.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<SetMeal />}
                                                        value={meal.total.fats}
                                                        unit="g"
                                                        color={theme.palette.warning.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<LocalFireDepartment />}
                                                        value={meal.total.calories}
                                                        unit="kcal"
                                                        color={theme.palette.error.main}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </ListItem>

                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <Box sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 1, sm: 2 } }}>
                                        <Divider />
                                        <List dense sx={{ py: 0 }}>
                                            {meal.items.map((item, itemIndex) => (
                                                <ListItem
                                                    key={itemIndex}
                                                    sx={{
                                                        py: 0.5,
                                                        px: { xs: 0, sm: 1 },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2" fontSize={smallMobile ? "0.8125rem" : "0.875rem"}>
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
                                                                    color={theme.palette.primary.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<Grain />}
                                                                    value={item.carbs}
                                                                    unit="g"
                                                                    color={theme.palette.secondary.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<SetMeal />}
                                                                    value={item.fats}
                                                                    unit="g"
                                                                    color={theme.palette.warning.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<LocalFireDepartment />}
                                                                    value={item.calories}
                                                                    unit="kcal"
                                                                    color={theme.palette.error.main}
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
                        </React.Fragment>
                    );
                })}
            </List>

            {(!isMobile || showDayContent) && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 2.5 },
                        mt: { xs: 1, sm: 2 },
                        borderRadius: "12px",
                        bgcolor: "background.paper",
                        border: "none",
                        boxShadow: theme.shadows[2],
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: smallMobile ? "1.05rem" : "1.3rem",
                            letterSpacing: "-0.2px",
                        }}
                    >
                        Daily Nutrition
                    </Typography>

                    <Stack spacing={2}>
                        {/* Calories */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: "10px",
                                bgcolor: theme.palette.error.light,
                                borderLeft: "4px solid",
                                borderColor: theme.palette.error.main,
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <LocalFireDepartment fontSize="small" sx={{ color: theme.palette.error.main }} />
                                    <Typography variant="body1" fontWeight={500} fontSize={smallMobile ? "0.9rem" : "1rem"}>
                                        Calories
                                    </Typography>
                                </Stack>
                                <Stack alignItems="flex-end" spacing={0.5}>
                                    <Typography variant="h6" fontWeight={600} fontSize={smallMobile ? "1.1rem" : "1.3rem"}>
                                        {dietPlan.dailyTotal.calories}
                                        <Box component="span" sx={{ opacity: 0.7, fontSize: "0.9rem" }}>
                                            / 2400
                                        </Box>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                        kcal
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>

                        {/* Macros Row */}
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            {/* Protein */}
                            <Box sx={{ flex: 1 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        height: "100%",
                                        borderRadius: "10px",
                                        bgcolor: theme.palette.primary.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.primary.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <FitnessCenter fontSize="small" sx={{ color: theme.palette.primary.main }} />
                                            <Typography variant="body2" fontWeight={500} fontSize={smallMobile ? "0.8rem" : "0.9rem"}>
                                                Protein
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography variant="h6" fontWeight={600} fontSize={smallMobile ? "1rem" : "1.1rem"}>
                                                {dietPlan.dailyTotal.protein}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontSize={smallMobile ? "0.75rem" : "0.8rem"}>
                                                / 190g
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Box>

                            {/* Carbs */}
                            <Box sx={{ flex: 1 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        height: "100%",
                                        borderRadius: "10px",
                                        bgcolor: theme.palette.success.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.success.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Grain fontSize="small" sx={{ color: theme.palette.success.main }} />
                                            <Typography variant="body2" fontWeight={500} fontSize={smallMobile ? "0.8rem" : "0.9rem"}>
                                                Carbs
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography variant="h6" fontWeight={600} fontSize={smallMobile ? "1rem" : "1.1rem"}>
                                                {dietPlan.dailyTotal.carbs}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontSize={smallMobile ? "0.75rem" : "0.8rem"}>
                                                / 200g
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Box>

                            {/* Fats */}
                            <Box sx={{ flex: 1 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        height: "100%",
                                        borderRadius: "10px",
                                        bgcolor: theme.palette.warning.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.warning.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <SetMeal fontSize="small" sx={{ color: theme.palette.warning.main }} />
                                            <Typography variant="body2" fontWeight={500} fontSize={smallMobile ? "0.8rem" : "0.9rem"}>
                                                Fats
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography variant="h6" fontWeight={600} fontSize={smallMobile ? "1rem" : "1.1rem"}>
                                                {dietPlan.dailyTotal.fats}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontSize={smallMobile ? "0.75rem" : "0.8rem"}>
                                                / 75g
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
};
