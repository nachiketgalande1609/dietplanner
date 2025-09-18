// Tasks.tsx (updated imports and state management)
import React, { useState, useEffect } from "react";
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

// Import API functions
import { fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion, reorderTasks, type Task as ApiTask } from "../api/tasksApi";

import CalendarPanel from "../components/CalendarPanel/CalendarPanel";
import { TasksContentPanel } from "../components/ContentPanel/TasksContentPanel";

// Helper function to reorder list
const reorder = (list: ApiTask[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const Tasks: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [tasks, setTasks] = useState<ApiTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [newTask, setNewTask] = useState<Partial<ApiTask> | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Load tasks from backend on component mount
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                const tasksData = await fetchTasks();
                setTasks(tasksData);
            } catch (error) {
                console.error("Failed to load tasks:", error);
                setSnackbar({ open: true, message: "Failed to load tasks", severity: "error" });
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

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

    const handleCreateTask = () => {
        setNewTask({
            title: "",
            description: "",
            date: selectedDate.format("YYYY-MM-DD"),
            completed: false,
            priority: "medium",
        });
    };

    const handleCancelCreate = () => {
        setNewTask(null);
    };

    const handleSaveNewTask = async () => {
        if (!newTask?.title?.trim()) return;

        try {
            const createdTask = await createTask(newTask as Omit<ApiTask, "id">);
            setTasks([...tasks, createdTask]);
            setNewTask(null);
            setSnackbar({ open: true, message: "Task created successfully", severity: "success" });
        } catch (error) {
            console.error("Failed to create task:", error);
            setSnackbar({ open: true, message: "Failed to create task", severity: "error" });
        }
    };

    const handleEditTask = (task: ApiTask) => {
        setEditingTaskId(task.id);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
    };

    const handleSaveTask = async (task: ApiTask) => {
        try {
            const updatedTask = await updateTask(task.id, task);
            setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
            setEditingTaskId(null);
            setSnackbar({ open: true, message: "Task updated successfully", severity: "success" });
        } catch (error) {
            console.error("Failed to update task:", error);
            setSnackbar({ open: true, message: "Failed to update task", severity: "error" });
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter((task) => task.id !== id));
            setSnackbar({ open: true, message: "Task deleted successfully", severity: "success" });
        } catch (error) {
            console.error("Failed to delete task:", error);
            setSnackbar({ open: true, message: "Failed to delete task", severity: "error" });
        }
    };

    const handleToggleComplete = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        try {
            const updatedTask = await toggleTaskCompletion(id, !task.completed);
            setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
        } catch (error) {
            console.error("Failed to update task:", error);
            setSnackbar({ open: true, message: "Failed to update task", severity: "error" });
        }
    };

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = reorder(tasks, result.source.index, result.destination.index);
        setTasks(items);

        // Send reorder to backend
        try {
            await reorderTasks(result.draggableId, result.destination.index);
        } catch (error) {
            console.error("Failed to reorder tasks:", error);
            // Revert UI if backend call fails
            setTasks(tasks);
        }
    };

    const getFilteredTasks = () => {
        const dateStr = selectedDate.format("YYYY-MM-DD");
        return tasks
            .filter((task) => task.date === dateStr)
            .sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
            });
    };

    const getPriorityColor = (priority: "low" | "medium" | "high") => {
        switch (priority) {
            case "high":
                return "error";
            case "medium":
                return "warning";
            case "low":
                return "success";
            default:
                return "default";
        }
    };

    const filteredTasks = getFilteredTasks();

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
                            onClick={handleCreateTask}
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
                                // borderBottom: "1px solid",
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
                                onClick={handleCreateTask}
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
                                New Task
                            </Button>
                        </Box>
                    )}

                    {/* Tasks Content */}
                    <TasksContentPanel
                        isMobile={isMobile}
                        loading={loading}
                        direction={direction}
                        selectedDate={selectedDate}
                        filteredTasks={filteredTasks}
                        newTask={newTask}
                        editingTaskId={editingTaskId}
                        tasks={tasks}
                        setNewTask={setNewTask}
                        handleSaveNewTask={handleSaveNewTask}
                        handleCancelCreate={handleCancelCreate}
                        handleToggleComplete={handleToggleComplete}
                        handleEditTask={handleEditTask}
                        handleSaveTask={handleSaveTask}
                        handleCancelEdit={handleCancelEdit}
                        handleDeleteTask={handleDeleteTask}
                        onDragEnd={onDragEnd}
                        getPriorityColor={getPriorityColor}
                        handleCreateTask={handleCreateTask}
                        setTasks={setTasks}
                    />
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
                            <ListItemButton onClick={handleCreateTask}>
                                <ListItemIcon>
                                    <Add />
                                </ListItemIcon>
                                <ListItemText primary="Add New Task" />
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
