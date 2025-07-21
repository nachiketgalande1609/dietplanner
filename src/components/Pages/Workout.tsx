import React, { useEffect, useState } from "react";
import { Box, Typography, Button, useMediaQuery, Paper, IconButton } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutContentPanel } from "../ContentPanel/WorkoutContentPanel";
import CalendarPanel from "../CalendarPanel/CalendarPanel";
import { fetchWorkoutPlan } from "../../api/workoutApi";

// Workout data structure
type Workout = {
    name: string;
    completed: boolean;
    sets: number;
    reps: number;
    weight: number;
    notes: string;
};

export const Workout: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [workoutData, setWorkoutData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.format("YYYY-MM-DD");
            const data = await fetchWorkoutPlan(dateStr);
            setWorkoutData(data);
        } catch (err) {
            console.error("Failed to fetch workout plan:", err);
            setError("Failed to load workout plan. Please try again.");
            setWorkoutData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            const newDirection = date.isAfter(selectedDate) ? "right" : "left";
            setDirection(newDirection);
            setSelectedDate(date);
            if (isMobile) setShowCalendar(false);
        }
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
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
            {/* Modern Mobile Header */}
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
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(8px)",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton
                            onClick={() => handleDateChange(selectedDate.subtract(1, "day"))}
                            size="small"
                            sx={{
                                color: "text.primary",
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                                borderRadius: "10px",
                                p: 1,
                            }}
                        >
                            <ChevronLeft fontSize="small" />
                        </IconButton>

                        <Paper
                            elevation={0}
                            sx={{
                                px: 2,
                                py: 1,
                                borderRadius: "12px",
                                bgcolor: "background.default",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                minWidth: 120,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600,
                                    color: "text.secondary",
                                    lineHeight: 1,
                                    mb: 0.5,
                                }}
                            >
                                {selectedDate.format("ddd").toUpperCase()}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    lineHeight: 1,
                                }}
                            >
                                {selectedDate.format("D MMM")}
                            </Typography>
                        </Paper>

                        <IconButton
                            onClick={() => handleDateChange(selectedDate.add(1, "day"))}
                            size="small"
                            sx={{
                                color: "text.primary",
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                                },
                                borderRadius: "10px",
                                p: 1,
                            }}
                        >
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </Box>

                    <Button
                        onClick={toggleCalendar}
                        startIcon={<CalendarMonth sx={{ fontSize: "1rem" }} />}
                        sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            px: 1.5,
                            py: 0.5,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            color: "text.primary",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.05)",
                            },
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
                <CalendarPanel isMobile={isMobile} showCalendar={showCalendar} selectedDate={selectedDate} handleDateChange={handleDateChange} />

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
                    {/* Modern Desktop Header */}
                    {!isMobile && (
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "background.paper",
                                borderBottom: "1px solid",
                                borderColor: "divider",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <IconButton
                                    onClick={() => handleDateChange(selectedDate.subtract(1, "day"))}
                                    sx={{
                                        color: "text.primary",
                                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                                        },
                                        borderRadius: "10px",
                                        p: 1,
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        px: 2.5,
                                        py: 1.5,
                                        borderRadius: "14px",
                                        bgcolor: "background.default",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            width: "120px",
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontWeight: 600,
                                                color: "text.secondary",
                                                lineHeight: 1,
                                            }}
                                        >
                                            {selectedDate.format("dddd").toUpperCase()}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "text.primary",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {selectedDate.format("MMMM D")}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: "1px",
                                            height: 30,
                                            bgcolor: "divider",
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 500,
                                            color: "text.secondary",
                                        }}
                                    >
                                        {selectedDate.format("YYYY")}
                                    </Typography>
                                </Paper>

                                <IconButton
                                    onClick={() => handleDateChange(selectedDate.add(1, "day"))}
                                    sx={{
                                        color: "text.primary",
                                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.08)",
                                        },
                                        borderRadius: "10px",
                                        p: 1,
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </Box>

                            <Button
                                variant="contained"
                                onClick={() => {}}
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
                                Edit Plan
                            </Button>
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
                                <WorkoutContentPanel
                                    selectedDate={selectedDate}
                                    workoutData={workoutData}
                                    loading={loading}
                                    error={error}
                                    onRefresh={fetchData}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
