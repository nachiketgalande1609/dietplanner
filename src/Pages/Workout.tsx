import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    Paper,
    IconButton,
    Snackbar,
    Alert,
    SwipeableDrawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth, ChevronLeft, ChevronRight, Add } from "@mui/icons-material";
import { WorkoutContentPanel } from "../components/ContentPanel/WorkoutContentPanel";
import CalendarPanel from "../components/CalendarPanel/CalendarPanel";
import { fetchWorkoutPlan } from "../api/workoutApi";

export const Workout: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [workoutData, setWorkoutData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "info" | "error" });
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const dateStr = selectedDate.format("YYYY-MM-DD");
            const data = await fetchWorkoutPlan(dateStr);
            setWorkoutData(data);
            setSnackbar({ open: true, message: "Workout plan loaded successfully", severity: "success" });
        } catch (err) {
            console.error("Failed to fetch workout plan:", err);
            setError("Failed to load workout plan. Please try again.");
            setWorkoutData(null);
            setSnackbar({ open: true, message: "Failed to load workout plan", severity: "error" });
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

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const handleCreateWorkout = () => {
        // Handle create new workout logic
        setSnackbar({ open: true, message: "Create workout functionality", severity: "info" });
    };

    return (
        <Box
            sx={{
                borderRadius: { xs: 0, sm: 4 },
                minHeight: { xs: "100vh", sm: "calc(100vh - 120px)" },
                display: "flex",
                flexDirection: "column",
                bgcolor: "background.Box",
                overflow: "hidden",
            }}
        >
            {/* Mobile Header */}
            {isMobile && (
                <Box
                    sx={{
                        mb: 2,
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "16px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton
                            onClick={() => handleDateChange(selectedDate.subtract(1, "day"))}
                            size="small"
                            sx={{
                                color: "text.primary",
                                bgcolor: "background.default",
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
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                minWidth: 80,
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
                                borderRadius: "10px",
                                p: 1,
                            }}
                        >
                            <ChevronRight fontSize="small" />
                        </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <IconButton
                            onClick={toggleCalendar}
                            size="small"
                            sx={{
                                color: showCalendar ? "primary.main" : "text.primary",
                                backgroundColor: showCalendar ? "rgba(25, 118, 210, 0.08)" : "background.default",
                                "&:hover": {
                                    backgroundColor: showCalendar ? "rgba(25, 118, 210, 0.12)" : "rgba(0, 0, 0, 0.08)",
                                },
                                borderRadius: "10px",
                                p: 1,
                            }}
                        >
                            <CalendarMonth fontSize="small" />
                        </IconButton>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreateWorkout}
                            sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                px: 1.5,
                                py: 0.5,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(254, 107, 139, 0.3)",
                                },
                            }}
                        >
                            New
                        </Button>
                    </Box>
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
                        borderRadius: { xs: 0, sm: 4 },
                        bgcolor: "background.paper",
                        border: isMobile ? "none" : "1px solid",
                        borderColor: "divider",
                        position: "relative",
                        minHeight: isMobile ? "calc(100vh - 120px)" : "auto",
                    }}
                >
                    {/* Desktop Header */}
                    {!isMobile && (
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "background.paper",
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
                                        borderRadius: "16px",
                                        p: 1,
                                    }}
                                >
                                    <ChevronLeft />
                                </IconButton>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: "16px",
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
                                            padding: "0 70px",
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
                                                textWrap: "nowrap",
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
                                        borderRadius: "16px",
                                        p: 1,
                                    }}
                                >
                                    <ChevronRight />
                                </IconButton>
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleCreateWorkout}
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
                                New Workout
                            </Button>
                        </Box>
                    )}

                    {/* Workout Content */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: "auto",
                            position: "relative",
                            overflowX: "hidden",
                        }}
                    >
                        <WorkoutContentPanel
                            isMobile={isMobile}
                            selectedDate={selectedDate}
                            workoutData={workoutData}
                            loading={loading}
                            error={error}
                            onRefresh={fetchData}
                            direction={direction}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Mobile Bottom Navigation */}
            {isMobile && (
                <SwipeableDrawer
                    anchor="bottom"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    onOpen={() => setMobileDrawerOpen(true)}
                    sx={{
                        "& .MuiDrawer-paper": {
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            maxHeight: "40vh",
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Actions
                        </Typography>
                        <List>
                            <ListItemButton onClick={handleCreateWorkout}>
                                <ListItemIcon>
                                    <Add />
                                </ListItemIcon>
                                <ListItemText primary="Add New Workout" />
                            </ListItemButton>
                            <ListItemButton onClick={toggleCalendar}>
                                <ListItemIcon>
                                    <CalendarMonth />
                                </ListItemIcon>
                                <ListItemText primary={showCalendar ? "Hide Calendar" : "Show Calendar"} />
                            </ListItemButton>
                        </List>
                    </Box>
                </SwipeableDrawer>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
