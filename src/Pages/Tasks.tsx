// Tasks.tsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    Paper,
    IconButton,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Checkbox,
    Chip,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import { CalendarMonth, ChevronLeft, ChevronRight, Add, Delete, Edit, Repeat, DragHandle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";
import CalendarPanel from "../components/CalendarPanel/CalendarPanel";

interface Task {
    id: string;
    title: string;
    description?: string;
    date: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
    repeat?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        endDate?: string;
    };
}

// Helper function to reorder list
const reorder = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const Tasks: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [showCalendar, setShowCalendar] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const loadTasks = () => {
            try {
                const savedTasks = localStorage.getItem("tasks");
                if (savedTasks) {
                    setTasks(JSON.parse(savedTasks));
                }
            } catch (error) {
                console.error("Failed to load tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

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

    const handleOpenDialog = (task?: Task) => {
        if (task) {
            setCurrentTask(task);
            setIsEditing(true);
        } else {
            setCurrentTask({
                id: uuidv4(),
                title: "",
                description: "",
                date: selectedDate.format("YYYY-MM-DD"),
                completed: false,
                priority: "medium",
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentTask(null);
    };

    const handleTaskChange = (field: keyof Task, value: any) => {
        if (currentTask) {
            setCurrentTask({
                ...currentTask,
                [field]: value,
            });
        }
    };

    const handleSaveTask = () => {
        if (!currentTask?.title.trim()) return;

        if (isEditing) {
            setTasks(tasks.map((task) => (task.id === currentTask.id ? currentTask : task)));
        } else {
            setTasks([...tasks, currentTask]);
        }
        handleCloseDialog();
    };

    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const handleToggleComplete = (id: string) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = reorder(tasks, result.source.index, result.destination.index);

        setTasks(items);
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

    const contentVariants: Variants = {
        enter: (direction: "left" | "right") => ({
            x: direction === "left" ? 100 : -100,
            opacity: 0,
        }),
        center: () => ({
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        }),
        exit: (direction: "left" | "right") => ({
            x: direction === "left" ? -100 : 100,
            opacity: 0,
        }),
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
                            onClick={() => handleOpenDialog()}
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
                        bgcolor: "background.default",
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
                                onClick={() => handleOpenDialog()}
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
                                    <DragDropContext onDragEnd={onDragEnd}>
                                        <Droppable droppableId="droppable">
                                            {(provided) => (
                                                <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: "100%" }}>
                                                    {getFilteredTasks().length > 0 ? (
                                                        getFilteredTasks().map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided) => (
                                                                    <Paper
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        elevation={0}
                                                                        sx={{
                                                                            p: 2,
                                                                            mb: 1,
                                                                            borderRadius: "12px",
                                                                            border: "1px solid",
                                                                            borderColor: "divider",
                                                                            bgcolor: "background.paper",
                                                                            opacity: task.completed ? 0.7 : 1,
                                                                            transition: "all 0.2s ease",
                                                                            "&:hover": {
                                                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Box
                                                                            sx={{
                                                                                display: "flex",
                                                                                alignItems: "center",
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
                                                                                }}
                                                                            >
                                                                                <DragHandle />
                                                                            </Box>

                                                                            <Checkbox
                                                                                checked={task.completed}
                                                                                onChange={() => handleToggleComplete(task.id)}
                                                                                sx={{
                                                                                    p: 0,
                                                                                    color: "text.secondary",
                                                                                    "&.Mui-checked": {
                                                                                        color: "primary.main",
                                                                                    },
                                                                                }}
                                                                            />

                                                                            <Box
                                                                                sx={{
                                                                                    flexGrow: 1,
                                                                                    overflow: "hidden",
                                                                                }}
                                                                            >
                                                                                <Typography
                                                                                    variant="subtitle1"
                                                                                    sx={{
                                                                                        fontWeight: 600,
                                                                                        textDecoration: task.completed ? "line-through" : "none",
                                                                                        color: task.completed ? "text.secondary" : "text.primary",
                                                                                    }}
                                                                                >
                                                                                    {task.title}
                                                                                </Typography>
                                                                                {task.description && (
                                                                                    <Typography
                                                                                        variant="body2"
                                                                                        sx={{
                                                                                            mt: 0.5,
                                                                                            color: "text.secondary",
                                                                                        }}
                                                                                    >
                                                                                        {task.description}
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>

                                                                            <Box
                                                                                sx={{
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    gap: 1,
                                                                                }}
                                                                            >
                                                                                {task.repeat && (
                                                                                    <Tooltip
                                                                                        title={`Repeats ${task.repeat.frequency}${
                                                                                            task.repeat.endDate
                                                                                                ? ` until ${dayjs(task.repeat.endDate).format(
                                                                                                      "MMM D, YYYY"
                                                                                                  )}`
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        <Chip
                                                                                            icon={<Repeat fontSize="small" />}
                                                                                            label={task.repeat.frequency}
                                                                                            size="small"
                                                                                            sx={{
                                                                                                fontSize: "0.65rem",
                                                                                                height: 24,
                                                                                            }}
                                                                                        />
                                                                                    </Tooltip>
                                                                                )}

                                                                                <Chip
                                                                                    label={task.priority}
                                                                                    size="small"
                                                                                    color={getPriorityColor(task.priority)}
                                                                                    sx={{
                                                                                        fontSize: "0.65rem",
                                                                                        height: 24,
                                                                                        textTransform: "capitalize",
                                                                                    }}
                                                                                />

                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={() => handleOpenDialog(task)}
                                                                                    sx={{
                                                                                        color: "text.secondary",
                                                                                    }}
                                                                                >
                                                                                    <Edit fontSize="small" />
                                                                                </IconButton>

                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={() => handleDeleteTask(task.id)}
                                                                                    sx={{
                                                                                        color: "text.secondary",
                                                                                    }}
                                                                                >
                                                                                    <Delete fontSize="small" />
                                                                                </IconButton>
                                                                            </Box>
                                                                        </Box>
                                                                    </Paper>
                                                                )}
                                                            </Draggable>
                                                        ))
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
                                                                No tasks for {selectedDate.format("MMMM D")}
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Add />}
                                                                onClick={() => handleOpenDialog()}
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
                                                                Add Task
                                                            </Button>
                                                        </Box>
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Task Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        background: (theme) => (theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF"),
                        boxShadow: (theme) => (theme.palette.mode === "dark" ? "0px 8px 32px rgba(0, 0, 0, 0.5)" : "0px 8px 32px rgba(0, 0, 0, 0.1)"),
                        overflow: "hidden",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: 3,
                        pb: 2,
                        fontSize: "1.5rem",
                        color: "#000000ff",
                    }}
                >
                    {isEditing ? "Edit Task" : "Add New Task"}
                </DialogTitle>

                <DialogContent sx={{ p: 3 }}>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            label="Title"
                            fullWidth
                            value={currentTask?.title || ""}
                            onChange={(e) => handleTaskChange("title", e.target.value)}
                            variant="filled"
                            sx={{
                                "& .MuiFilledInput-root": {
                                    borderRadius: "12px",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                    "&:hover": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                },
                            }}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={currentTask?.description || ""}
                            onChange={(e) => handleTaskChange("description", e.target.value)}
                            variant="filled"
                            sx={{
                                "& .MuiFilledInput-root": {
                                    borderRadius: "12px",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                    "&:hover": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                },
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexDirection: { xs: "column", sm: "row" },
                            }}
                        >
                            <TextField
                                label="Date"
                                type="date"
                                fullWidth
                                value={currentTask?.date || ""}
                                onChange={(e) => handleTaskChange("date", e.target.value)}
                                variant="filled"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                        "&:hover": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                    },
                                }}
                            />

                            <TextField
                                select
                                label="Priority"
                                fullWidth
                                value={currentTask?.priority || "medium"}
                                onChange={(e) => handleTaskChange("priority", e.target.value as "low" | "medium" | "high")}
                                variant="filled"
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                        "&:hover": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                    },
                                }}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                        </Box>

                        <TextField
                            select
                            label="Repeat"
                            fullWidth
                            value={currentTask?.repeat?.frequency || ""}
                            onChange={(e) =>
                                handleTaskChange("repeat", {
                                    frequency: e.target.value as "daily" | "weekly" | "monthly" | "yearly",
                                    endDate: currentTask?.repeat?.endDate,
                                })
                            }
                            variant="filled"
                            sx={{
                                "& .MuiFilledInput-root": {
                                    borderRadius: "12px",
                                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                    "&:hover": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                },
                            }}
                        >
                            <MenuItem value="">Does not repeat</MenuItem>
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                        </TextField>

                        {currentTask?.repeat?.frequency && (
                            <TextField
                                label="Repeat End Date (optional)"
                                type="date"
                                fullWidth
                                value={currentTask?.repeat?.endDate || ""}
                                onChange={(e) =>
                                    handleTaskChange("repeat", {
                                        ...currentTask.repeat,
                                        endDate: e.target.value,
                                    })
                                }
                                variant="filled"
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiFilledInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2D2D2D" : "#F5F5F5"),
                                        "&:hover": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#383838" : "#ECECEC"),
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                    },
                                }}
                            />
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 3,
                        pt: 2,
                        background: (theme) => (theme.palette.mode === "dark" ? "#252525" : "#FAFAFA"),
                    }}
                >
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            px: 3,
                            py: 1,
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: (theme) => (theme.palette.mode === "dark" ? "#FFFFFF" : "#000000"),
                            border: "1px solid",
                            borderColor: (theme) => (theme.palette.mode === "dark" ? "#444444" : "#DDDDDD"),
                            "&:hover": {
                                borderColor: (theme) => (theme.palette.mode === "dark" ? "#FF8E53" : "#FE6B8B"),
                                backgroundColor: (theme) =>
                                    theme.palette.mode === "dark" ? "rgba(255, 142, 83, 0.08)" : "rgba(254, 107, 139, 0.08)",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveTask}
                        variant="contained"
                        disabled={!currentTask?.title.trim()}
                        sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            px: 3,
                            py: 1,
                            fontSize: "1rem",
                            fontWeight: 600,
                            background: (theme) =>
                                theme.palette.mode === "dark"
                                    ? "linear-gradient(90deg, #FF8E53 10%, #FE6B8B 90%)"
                                    : "linear-gradient(90deg, #FF8E53 10%, #FE6B8B 90%)",
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: (theme) =>
                                    theme.palette.mode === "dark" ? "0 4px 16px rgba(254, 107, 139, 0.4)" : "0 4px 16px rgba(254, 107, 139, 0.3)",
                                transform: "translateY(-1px)",
                                transition: "transform 0.2s ease",
                            },
                            "&:active": {
                                transform: "translateY(0)",
                            },
                            "&:disabled": {
                                background: (theme) => (theme.palette.mode === "dark" ? "#3A3A3A" : "#E0E0E0"),
                                color: (theme) => (theme.palette.mode === "dark" ? "#5A5A5A" : "#9E9E9E"),
                            },
                        }}
                    >
                        {isEditing ? "Update Task" : "Create Task"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
