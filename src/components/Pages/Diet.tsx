import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    Skeleton,
    Paper,
    Stack,
    List,
    ListItem,
    ListItemSecondaryAction,
    Divider,
    ListItemText,
    IconButton,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DayContentPanel } from "../DayContentPanel/DayContentPanel";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth, ChevronLeft, ChevronRight, ErrorOutline } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDietPlan, markMealComplete, markMealIncomplete, updateDietPlan } from "../../api/dietApi";
import { EditDietPlan } from "../EditDietPlan/EditDietPlan";

export const Diet: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [showDayContent, setShowDayContent] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [dietData, setDietData] = useState<any>(null);
    const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.format("YYYY-MM-DD");
            const data = await fetchDietPlan(dateStr);
            setDietData(data);

            // Initialize completed meals state
            const completed: Record<string, boolean> = {};
            if (data?.completedMeals) {
                data.completedMeals.forEach((mealTime: string) => {
                    completed[mealTime] = true;
                });
            }
            setCompletedMeals(completed);

            setShowDayContent(true);
        } catch (err) {
            console.error("Failed to fetch diet plan:", err);
            setError("Failed to load diet plan. Please try again.");
            setDietData(null);
            setShowDayContent(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const newDirection = date.isAfter(selectedDate) ? "right" : "left";
            setDirection(newDirection);
            setSelectedDate(date);
            if (isMobile) setShowCalendar(false);
        }
    };

    const handleToggleMeal = async (mealTime: string) => {
        const dateStr = selectedDate.format("YYYY-MM-DD");
        const isCurrentlyCompleted = completedMeals[mealTime];

        try {
            setCompletedMeals((prev) => ({
                ...prev,
                [mealTime]: !isCurrentlyCompleted,
            }));

            if (isCurrentlyCompleted) {
                await markMealIncomplete(dateStr, mealTime);
            } else {
                await markMealComplete(dateStr, mealTime);
            }
        } catch (error) {
            console.error("Error toggling meal status:", error);

            setCompletedMeals((prev) => ({
                ...prev,
                [mealTime]: isCurrentlyCompleted,
            }));
        }
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleSaveEditedPlan = async (updatedData: any) => {
        try {
            const response = await updateDietPlan(updatedData);

            if (!response.success) {
                throw new Error(response.error || "Failed to save diet plan");
            }

            setDietData(updatedData);
            setEditMode(false);
            alert("Diet plan saved successfully!");
        } catch (error) {
            console.error("Failed to save diet plan:", error);
            alert("Failed to save diet plan. Please try again.");
        }
    };

    // Animation variants
    const dateHeaderVariants = {
        enter: (direction: "left" | "right") => ({
            x: direction === "right" ? 100 : -100,
            opacity: 0,
        }),
        center: () => ({
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        }),
        exit: (direction: "left" | "right") => ({
            x: direction === "right" ? -100 : 100,
            opacity: 0,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        }),
    };

    const contentVariants = {
        enter: (direction: "left" | "right") => ({
            x: direction === "right" ? 50 : -50,
            opacity: 0,
        }),
        center: () => ({
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
            },
        }),
        exit: (direction: "left" | "right") => ({
            x: direction === "right" ? -50 : 50,
            opacity: 0,
            transition: {
                x: { type: "spring" as const, stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
            },
        }),
    };

    const LoadingSkeleton = () => {
        const theme = useTheme();
        const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    minHeight: "100%",
                    bgcolor: "background.default",
                    gap: 2,
                    p: { xs: 1, sm: 2 },
                }}
            >
                {/* Daily Progress Skeleton */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Skeleton variant="text" width={100} height={24} />
                            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                        </Stack>
                        <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 12 }} />
                    </Stack>
                    <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 5 }} />
                </Paper>

                {/* Meals List Skeleton */}
                <List sx={{ width: "100%", flex: 1, py: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[1, 2, 3].map((mealIndex) => (
                        <Paper
                            key={mealIndex}
                            elevation={isMobile ? 0 : 1}
                            sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                                borderLeft: `4px solid ${theme.palette.divider}`,
                                bgcolor: "background.paper",
                            }}
                        >
                            <ListItem
                                sx={{
                                    pr: { xs: 8, sm: 10 },
                                    py: { xs: 1.5, sm: 2 },
                                }}
                            >
                                <ListItemSecondaryAction sx={{ right: { xs: 36, sm: 48 } }}>
                                    <Skeleton variant="circular" width={24} height={24} />
                                </ListItemSecondaryAction>

                                <ListItemSecondaryAction>
                                    <Skeleton variant="circular" width={32} height={32} />
                                </ListItemSecondaryAction>

                                <Box sx={{ flex: 1 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Skeleton variant="circular" width={32} height={32} sx={{ display: { xs: "none", sm: "block" } }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                <Skeleton variant="text" width={80} height={24} />
                                                <Skeleton variant="text" width={120} height={20} />
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                                {!isSmallMobile && (
                                                    <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />
                                                )}
                                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Box>
                            </ListItem>

                            {/* Meal items skeleton */}
                            <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 } }}>
                                <Divider sx={{ mb: 1.5 }} />
                                {[1, 2].map((itemIndex) => (
                                    <ListItem key={itemIndex} sx={{ py: 0.5, px: { xs: 0, sm: 1 } }}>
                                        <ListItemText
                                            primary={<Skeleton variant="text" width="60%" height={20} />}
                                            secondary={
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
                                                    <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                    <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                    <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                    <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 12 }} />
                                                </Stack>
                                            }
                                            secondaryTypographyProps={{ component: "div" }}
                                        />
                                    </ListItem>
                                ))}
                            </Box>
                        </Paper>
                    ))}
                </List>

                {/* Daily Nutrition Skeleton */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 1.5, sm: 2.5 },
                        borderRadius: "12px",
                        bgcolor: "background.paper",
                        border: "none",
                        boxShadow: theme.shadows[2],
                    }}
                >
                    <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />

                    <Stack spacing={2}>
                        {/* Calories Skeleton */}
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
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton variant="text" width={60} height={24} />
                                </Stack>
                                <Stack alignItems="flex-end" spacing={0.5}>
                                    <Skeleton variant="text" width={100} height={28} />
                                    <Skeleton variant="text" width={40} height={16} />
                                </Stack>
                            </Stack>
                        </Paper>

                        {/* Macros Row Skeleton */}
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
                                    <Stack direction="column" spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Skeleton variant="circular" width={20} height={20} />
                                            <Skeleton variant="text" width={50} height={20} />
                                        </Stack>
                                        <Skeleton variant="text" width={80} height={24} />
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
                                    <Stack direction="column" spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Skeleton variant="circular" width={20} height={20} />
                                            <Skeleton variant="text" width={50} height={20} />
                                        </Stack>
                                        <Skeleton variant="text" width={80} height={24} />
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
                                    <Stack direction="column" spacing={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Skeleton variant="circular" width={20} height={20} />
                                            <Skeleton variant="text" width={50} height={20} />
                                        </Stack>
                                        <Skeleton variant="text" width={80} height={24} />
                                    </Stack>
                                </Paper>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                p: { xs: 1, sm: 2, md: 3 },
                borderRadius: { xs: 0, sm: 4 },
                minHeight: { xs: "100vh", sm: "calc(100vh - 120px)" },
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.Box",
                overflow: "hidden",
                boxShadow: { xs: "none", sm: "0px 4px 20px rgba(0, 0, 0, 0.08)" },
            }}
        >
            {/* Header - only shown on mobile */}
            {isMobile && (
                <Box
                    sx={{
                        mb: 1,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        bgcolor: "background.Box",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                            onClick={() => handleDateChange(selectedDate.subtract(1, "day"))}
                            size="small"
                            sx={{
                                color: "text.primary",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {selectedDate.format("MMM D, YYYY")}
                        </Typography>
                        <IconButton
                            onClick={() => handleDateChange(selectedDate.add(1, "day"))}
                            size="small"
                            sx={{
                                color: "text.primary",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        onClick={toggleCalendar}
                        startIcon={<CalendarMonth />}
                        sx={{
                            borderRadius: "20px",
                            textTransform: "none",
                            px: 2,
                            py: 1,
                            fontSize: "0.75rem",
                            minWidth: "auto",
                        }}
                    >
                        {showCalendar ? "Hide" : "Calendar"}
                    </Button>
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: { xs: 1, md: 3 },
                    flexGrow: 1,
                    overflow: "hidden",
                }}
            >
                {/* Calendar Section */}
                <AnimatePresence>
                    {(showCalendar || !isMobile) && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: isMobile ? "100%" : 350,
                                flexShrink: 0,
                                minHeight: isMobile ? "auto" : "100%",
                                zIndex: isMobile ? 5 : 1,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: isMobile ? "auto" : "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    p: { xs: 1, md: 2 },
                                    borderRadius: { xs: 0, sm: 3 },
                                    bgcolor: "background.default",
                                    border: isMobile ? "none" : "1px solid",
                                    borderColor: "divider",
                                    boxShadow: isMobile ? "0px 4px 10px rgba(0, 0, 0, 0.1)" : "none",
                                }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        sx={{
                                            width: "100%",
                                            "& .Mui-selected": {
                                                backgroundColor: "primary.main",
                                                color: "primary.contrastText",
                                                fontWeight: "bold",
                                                "&:hover": {
                                                    backgroundColor: "primary.dark",
                                                },
                                            },
                                            "& .MuiPickersDay-root": {
                                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                                                width: { xs: 36, md: 40 },
                                                height: { xs: 36, md: 40 },
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                },
                                            },
                                            "& .MuiTypography-caption": {
                                                color: "text.secondary",
                                                fontWeight: "500",
                                                fontSize: { xs: "0.75rem", md: "0.875rem" },
                                            },
                                            "& .MuiPickersCalendarHeader-label": {
                                                color: "text.primary",
                                                fontWeight: "600",
                                                fontSize: { xs: "0.875rem", md: "1rem" },
                                            },
                                        }}
                                        showDaysOutsideCurrentMonth
                                    />
                                </LocalizationProvider>
                            </Box>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Panel */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: { xs: 0, sm: 3 },
                        bgcolor: "background.default",
                        border: isMobile ? "none" : "1px solid",
                        borderColor: "divider",
                        position: "relative",
                        minHeight: isMobile ? "calc(100vh - 120px)" : "auto",
                    }}
                >
                    {!isMobile && (
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={selectedDate.toString()}
                                    custom={direction}
                                    variants={dateHeaderVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    <Typography variant="h6" fontWeight="600">
                                        {selectedDate.format("dddd, MMMM D, YYYY")}
                                    </Typography>
                                </motion.div>
                            </AnimatePresence>

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <IconButton
                                    onClick={() => handleDateChange(selectedDate.subtract(1, "day"))}
                                    sx={{
                                        color: "primary.contrastText",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDateChange(selectedDate.add(1, "day"))}
                                    sx={{
                                        color: "primary.contrastText",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </Box>
                        </Box>
                    )}

                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            p: { xs: 1, sm: 2, md: 3 },
                            position: "relative",
                            overflowX: "hidden",
                        }}
                    >
                        {loading ? (
                            <LoadingSkeleton />
                        ) : error ? (
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
                                        p: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 2,
                                        borderRadius: 3,
                                        bgcolor: "background.paper",
                                        border: `1px solid ${theme.palette.error.light}`,
                                        maxWidth: 400,
                                        width: "100%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            bgcolor: theme.palette.error.light,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: theme.palette.error.main,
                                            mb: 1,
                                        }}
                                    >
                                        <ErrorOutline sx={{ fontSize: 32, color: theme.palette.background.default }} />
                                    </Box>

                                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                                        Failed to Load Diet Plan
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {error}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={fetchData}
                                        sx={{
                                            mt: 2,
                                            px: 4,
                                            py: 1,
                                            borderRadius: "20px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            bgcolor: theme.palette.error.main,
                                            "&:hover": {
                                                bgcolor: theme.palette.error.dark,
                                            },
                                        }}
                                    >
                                        Try Again
                                    </Button>
                                </Paper>
                            </Box>
                        ) : editMode ? (
                            <EditDietPlan dietData={dietData} onSave={handleSaveEditedPlan} onCancel={() => setEditMode(false)} />
                        ) : (
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={selectedDate.toString()}
                                    custom={direction}
                                    variants={contentVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    style={{ height: "100%" }}
                                >
                                    <DayContentPanel
                                        showDayContent={showDayContent || isMobile}
                                        isMobile={isMobile}
                                        dietData={dietData}
                                        completedMeals={completedMeals}
                                        onToggleMeal={handleToggleMeal}
                                        onEdit={() => setEditMode(true)}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
