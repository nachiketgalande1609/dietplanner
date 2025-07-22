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
} from "@mui/icons-material";

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
}

export const DietContentPanel: React.FC<DietContentPanelProps> = ({
    showDayContent,
    isMobile = false,
    dietData,
    completedMeals,
    onToggleMeal,
    selectedDate,
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
                        p: { xs: "20px", sm: "24px" },
                        mb: { xs: 2, sm: 3 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        overflow: "hidden",
                        position: "relative",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                                    animation: "pulse 2s infinite",
                                    "@keyframes pulse": {
                                        "0%": {
                                            boxShadow: `0 0 0 0 ${progress === 100 ? theme.palette.success.light : theme.palette.primary.light}`,
                                        },
                                        "70%": {
                                            boxShadow: `0 0 0 8px ${
                                                progress === 100 ? theme.palette.success.light + "00" : theme.palette.primary.light + "00"
                                            }`,
                                        },
                                        "100%": {
                                            boxShadow: `0 0 0 0 ${
                                                progress === 100 ? theme.palette.success.light + "00" : theme.palette.primary.light + "00"
                                            }`,
                                        },
                                    },
                                }}
                            >
                                {progress === 100 ? (
                                    <Check fontSize="small" sx={{ color: theme.palette.success.contrastText }} />
                                ) : (
                                    <TrendingUp fontSize="small" sx={{ color: theme.palette.background.default }} />
                                )}
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={600} fontSize={smallMobile ? "0.875rem" : "1rem"}>
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
                                animation: "fadeIn 0.5s ease",
                                "@keyframes fadeIn": {
                                    "0%": { opacity: 0, transform: "translateY(5px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700} color={progress === 100 ? "success.dark" : "primary.dark"}>
                                {progress}%
                            </Typography>
                        </Box>
                    </Box>

                    {/* Animated Progress Bar */}
                    <Box sx={{ position: "relative", height: 8, borderRadius: 4, bgcolor: "grey.100", overflow: "hidden" }}>
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
                                "&:after": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundImage:
                                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)",
                                    animation: "shimmer 2s infinite",
                                    "@keyframes shimmer": {
                                        "0%": { transform: "translateX(-100%)" },
                                        "100%": { transform: "translateX(100%)" },
                                    },
                                },
                            }}
                        />
                    </Box>
                </Paper>
            )}

            <List sx={{ width: "100%", flex: 1, py: 0 }}>
                {dietData.meals?.map((meal: any, index: number) => {
                    const isCompleted = !!completedMeals[meal.time];
                    const isExpanded = !!expandedMeals[meal.time];
                    const isMissed = isMealMissed(index);

                    return (
                        <React.Fragment key={index}>
                            <Paper
                                elevation={isMobile ? 0 : 1}
                                sx={{
                                    mb: { xs: 2, sm: 2 },
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderLeft: `4px solid ${
                                        isCompleted ? theme.palette.success.main : isMissed ? theme.palette.error.main : theme.palette.divider
                                    }`,
                                    bgcolor: "background.paper",
                                    width: "100%",
                                    boxShadow: "none",
                                    backgroundColor: isCompleted
                                        ? theme.palette.success.light
                                        : isMissed
                                          ? theme.palette.error.light
                                          : "background.paper",
                                }}
                            >
                                <ListItem
                                    sx={{
                                        pr: { xs: 8, sm: 10 },
                                        py: { xs: 2, sm: 2 },
                                        cursor: "pointer",
                                        width: "100%",
                                    }}
                                    onClick={() => handleToggleExpand(meal.time)}
                                >
                                    <ListItemSecondaryAction sx={{ right: { xs: 48, sm: 48 } }}>
                                        <Checkbox
                                            edge="end"
                                            checked={isCompleted}
                                            onChange={() => onToggleMeal(meal.time)}
                                            onClick={(e) => e.stopPropagation()}
                                            icon={<Circle fontSize="small" />}
                                            checkedIcon={<CheckCircle sx={{ color: theme.palette.success.dark, fontSize: "1.5rem" }} />}
                                            size={smallMobile ? "small" : "medium"}
                                            sx={{
                                                ":hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                        />
                                    </ListItemSecondaryAction>

                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            size={smallMobile ? "small" : "medium"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleExpand(meal.time);
                                            }}
                                            sx={{
                                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: theme.transitions.create("transform", {
                                                    duration: theme.transitions.duration.shortest,
                                                }),
                                                ":hover": {
                                                    backgroundColor: "transparent",
                                                },
                                            }}
                                        >
                                            <ExpandMore fontSize={smallMobile ? "small" : "medium"} />
                                        </IconButton>
                                    </ListItemSecondaryAction>

                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: isCompleted ? "success.dark" : isMissed ? "error.dark" : "primary.light",
                                                    width: { xs: 28, sm: 32 },
                                                    height: { xs: 28, sm: 32 },
                                                    display: { xs: "none", sm: "flex" },
                                                }}
                                            >
                                                <Restaurant fontSize="small" sx={{ color: theme.palette.common.white }} />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                        fontSize={smallMobile ? "0.875rem" : "1rem"}
                                                        color={isMissed || isCompleted ? theme.palette.background.default : "text.primary"}
                                                    >
                                                        {meal.time}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color={isMissed || isCompleted ? theme.palette.background.default : "text.primary"}
                                                        sx={{
                                                            fontSize: smallMobile ? "0.75rem" : "0.875rem",
                                                        }}
                                                    >
                                                        {meal.meal}
                                                    </Typography>
                                                    {isMissed && (
                                                        <Chip
                                                            label="Missed"
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: theme.palette.error.main,
                                                                color: theme.palette.error.contrastText,
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                                                    {!smallMobile && <Chip label={`${meal.items.length} items`} size="small" variant="outlined" />}
                                                    <NutritionChip
                                                        icon={<FitnessCenter />}
                                                        value={meal.total.protein}
                                                        unit="g"
                                                        color={isMissed ? theme.palette.error.main : theme.palette.primary.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<Grain />}
                                                        value={meal.total.carbs}
                                                        unit="g"
                                                        color={isMissed ? theme.palette.error.main : theme.palette.secondary.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<SetMeal />}
                                                        value={meal.total.fats}
                                                        unit="g"
                                                        color={isMissed ? theme.palette.error.main : theme.palette.warning.main}
                                                    />
                                                    <NutritionChip
                                                        icon={<LocalFireDepartment />}
                                                        value={meal.total.calories}
                                                        unit="kcal"
                                                        color={isMissed ? theme.palette.error.main : theme.palette.error.main}
                                                    />
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </ListItem>

                                <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ borderRadius: 2, padding: "0 4px 0 0" }}>
                                    <Box
                                        sx={{
                                            px: { xs: 1, sm: 2 },
                                            pb: { xs: 1, sm: 2 },
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 3,
                                        }}
                                    >
                                        <List dense sx={{ py: 0 }}>
                                            {meal.items.map((item: any, itemIndex: number) => (
                                                <ListItem
                                                    key={itemIndex}
                                                    sx={{
                                                        py: 0.5,
                                                        px: { xs: 1, sm: 1 },
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
                                                                    color={isMissed ? theme.palette.error.main : theme.palette.primary.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<Grain />}
                                                                    value={item.carbs}
                                                                    unit="g"
                                                                    color={isMissed ? theme.palette.error.main : theme.palette.secondary.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<SetMeal />}
                                                                    value={item.fats}
                                                                    unit="g"
                                                                    color={isMissed ? theme.palette.error.main : theme.palette.warning.main}
                                                                />
                                                                <NutritionChip
                                                                    icon={<LocalFireDepartment />}
                                                                    value={item.calories}
                                                                    unit="kcal"
                                                                    color={isMissed ? theme.palette.error.main : theme.palette.error.main}
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

            {(!isMobile || showDayContent) && dietData.dailyTotal && (
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        mt: { xs: 1, sm: 2 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
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
                        Summary
                    </Typography>

                    <Stack spacing={2}>
                        {/* Calories */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: "12px 24px",
                                borderRadius: 3,
                                bgcolor: theme.palette.error.light,
                                borderLeft: "4px solid",
                                borderColor: theme.palette.error.main,
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <LocalFireDepartment fontSize="small" sx={{ color: theme.palette.error.dark }} />
                                    <Typography
                                        variant="body1"
                                        fontWeight={500}
                                        fontSize={smallMobile ? "0.9rem" : "1rem"}
                                        sx={{ color: theme.palette.background.default }}
                                    >
                                        Calories
                                    </Typography>
                                </Stack>
                                <Stack alignItems="flex-end" spacing={0.5}>
                                    <Typography
                                        variant="h6"
                                        fontWeight={600}
                                        fontSize={smallMobile ? "1.1rem" : "1.3rem"}
                                        sx={{ color: theme.palette.background.default }}
                                    >
                                        {dietData.dailyTotal.calories}
                                        <Box component="span" sx={{ opacity: 0.7, fontSize: "0.9rem" }}>
                                            / 2400
                                        </Box>
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ lineHeight: 1, color: theme.palette.background.default }}
                                    >
                                        kcal
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Paper>

                        {/* Macros Row */}
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {/* Protein */}
                            <Box sx={{ flex: 1 }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        padding: isMobile ? "12px" : "12px 24px",
                                        display: "flex",
                                        justifyContent: isMobile ? "center" : "flex-start",
                                        alignItems: "center",
                                        height: "100%",
                                        borderRadius: 3,
                                        bgcolor: theme.palette.primary.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.primary.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                fontSize={smallMobile ? "0.8rem" : "0.9rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                Protein
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={smallMobile ? "1rem" : "1.1rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                {dietData.dailyTotal.protein}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={smallMobile ? "0.75rem" : "0.8rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
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
                                        padding: isMobile ? "12px" : "12px 24px",
                                        display: "flex",
                                        justifyContent: isMobile ? "center" : "flex-start",
                                        alignItems: "center",
                                        height: "100%",
                                        borderRadius: 3,
                                        bgcolor: theme.palette.success.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.success.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                fontSize={smallMobile ? "0.8rem" : "0.9rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                Carbs
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={smallMobile ? "1rem" : "1.1rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                {dietData.dailyTotal.carbs}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={smallMobile ? "0.75rem" : "0.8rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
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
                                        padding: isMobile ? "12px" : "12px 24px",
                                        display: "flex",
                                        justifyContent: isMobile ? "center" : "flex-start",
                                        alignItems: "center",
                                        height: "100%",
                                        borderRadius: 3,
                                        bgcolor: theme.palette.warning.light,
                                        borderLeft: "4px solid",
                                        borderColor: theme.palette.warning.main,
                                    }}
                                >
                                    <Stack direction="column" spacing={0.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                fontSize={smallMobile ? "0.8rem" : "0.9rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                Fats
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                fontSize={smallMobile ? "1rem" : "1.1rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
                                                {dietData.dailyTotal.fats}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={smallMobile ? "0.75rem" : "0.8rem"}
                                                sx={{ color: theme.palette.background.default }}
                                            >
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
