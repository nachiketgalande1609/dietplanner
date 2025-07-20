import React, { useState } from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { WorkoutDayPanel } from "../ContentPanel/WorkoutContentPanel";
import CalendarPanel from "../CalendarPanel/CalendarPanel";

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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedDate.format("MMM D, YYYY")}
                    </Typography>
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
                    {!isMobile && (
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                position: "relative",
                                overflow: "hidden",
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
                                <WorkoutDayPanel selectedDate={selectedDate} />
                            </motion.div>
                        </AnimatePresence>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
