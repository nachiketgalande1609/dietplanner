import React, { useState, useEffect } from "react";
import { Box, Typography, Button, useMediaQuery, Paper, IconButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { DietContentPanel } from "../ContentPanel/DietContentPanel";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth, ChevronLeft, ChevronRight, ErrorOutline } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDietPlan, markMealComplete, markMealIncomplete, updateDietPlan } from "../../api/dietApi";
import { EditDietPlan } from "../EditDietPlan/EditDietPlan";
import { DietSkeleton } from "../DietSkeleton/DietSkeleton";
import CalendarPanel from "../CalendarPanel/CalendarPanel";

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
            const { success, error } = response.data; // <-- extract from response.data

            if (!success) {
                throw new Error(error || "Failed to save diet plan");
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

    return (
        <Box
            sx={{
                p: { xs: 0, sm: 2, md: 3 },
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
                <CalendarPanel isMobile={isMobile} showCalendar={showCalendar} selectedDate={selectedDate} handleDateChange={handleDateChange} />

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
                            p: { xs: 0, sm: 2, md: 3 },
                            position: "relative",
                            overflowX: "hidden",
                        }}
                    >
                        {loading ? (
                            <DietSkeleton isMobile={isMobile} />
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
                                    <DietContentPanel
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
