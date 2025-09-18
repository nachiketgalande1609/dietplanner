import React from "react";
import { Box, Typography, Button, Paper, IconButton, Stack, TextField, MenuItem, Chip, Checkbox, CircularProgress } from "@mui/material";
import { Edit, Delete, Repeat, DragHandle, Save, Close, CheckCircle, RadioButtonUnchecked, Add } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { type Task as ApiTask } from "../../api/tasksApi";

interface TasksContentPanelProps {
    isMobile: boolean;
    loading: boolean;
    direction: "left" | "right";
    selectedDate: any;
    filteredTasks: ApiTask[];
    newTask: Partial<ApiTask> | null;
    editingTaskId: string | null;
    tasks: ApiTask[];
    setTasks: React.Dispatch<React.SetStateAction<ApiTask[]>>;
    setNewTask: (task: Partial<ApiTask> | null) => void;
    handleSaveNewTask: () => void;
    handleCancelCreate: () => void;
    handleToggleComplete: (id: string) => void;
    handleEditTask: (task: ApiTask) => void;
    handleSaveTask: (task: ApiTask) => void;
    handleCancelEdit: () => void;
    handleDeleteTask: (id: string) => void;
    onDragEnd: (result: any) => void;
    getPriorityColor: (priority: "low" | "medium" | "high") => any;
    handleCreateTask: () => void;
}

export const TasksContentPanel: React.FC<TasksContentPanelProps> = ({
    isMobile,
    loading,
    direction,
    selectedDate,
    filteredTasks,
    newTask,
    editingTaskId,
    tasks,
    setNewTask,
    handleSaveNewTask,
    handleCancelCreate,
    handleToggleComplete,
    handleEditTask,
    handleSaveTask,
    handleCancelEdit,
    handleDeleteTask,
    onDragEnd,
    getPriorityColor,
    handleCreateTask,
    setTasks,
}) => {
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
            {/* Tasks Content */}
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
                            initial={{ x: direction === "left" ? 100 : -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction === "left" ? -100 : 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ height: "100%" }}
                        >
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppable">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ height: "100%" }}>
                                            {/* New Task Form */}
                                            {newTask && (
                                                <Paper
                                                    elevation={2}
                                                    sx={{
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: "12px",
                                                        border: "2px solid",
                                                        borderColor: "primary.main",
                                                        bgcolor: "background.paper",
                                                    }}
                                                >
                                                    <Stack spacing={2}>
                                                        <TextField
                                                            autoFocus
                                                            label="Title"
                                                            fullWidth
                                                            value={newTask.title || ""}
                                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                        <TextField
                                                            label="Description"
                                                            fullWidth
                                                            multiline
                                                            rows={2}
                                                            value={newTask.description || ""}
                                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                                                            <TextField
                                                                label="Priority"
                                                                select
                                                                value={newTask.priority || "medium"}
                                                                onChange={(e) =>
                                                                    setNewTask({
                                                                        ...newTask,
                                                                        priority: e.target.value as "low" | "medium" | "high",
                                                                    })
                                                                }
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{ minWidth: 120 }}
                                                            >
                                                                <MenuItem value="low">Low</MenuItem>
                                                                <MenuItem value="medium">Medium</MenuItem>
                                                                <MenuItem value="high">High</MenuItem>
                                                            </TextField>
                                                            <Button
                                                                onClick={handleSaveNewTask}
                                                                variant="contained"
                                                                startIcon={<Save />}
                                                                disabled={!newTask.title?.trim()}
                                                                size="small"
                                                            >
                                                                Save
                                                            </Button>
                                                            <Button
                                                                onClick={handleCancelCreate}
                                                                variant="outlined"
                                                                startIcon={<Close />}
                                                                size="small"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Box>
                                                    </Stack>
                                                </Paper>
                                            )}

                                            {filteredTasks.length > 0 ? (
                                                filteredTasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided) => (
                                                            <Paper
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                elevation={1}
                                                                sx={{
                                                                    p: 2,
                                                                    mb: 1,
                                                                    borderRadius: "32px",
                                                                    border: editingTaskId === task.id ? "2px solid" : "1px solid",
                                                                    borderColor: editingTaskId === task.id ? "primary.main" : "divider",
                                                                    bgcolor: "background.paper",
                                                                    opacity: task.completed ? 0.7 : 1,
                                                                    transition: "all 0.2s ease",
                                                                    "&:hover": {
                                                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                                    },
                                                                }}
                                                            >
                                                                {editingTaskId === task.id ? (
                                                                    <Stack spacing={2}>
                                                                        <TextField
                                                                            autoFocus
                                                                            label="Title"
                                                                            fullWidth
                                                                            value={task.title}
                                                                            onChange={(e) => {
                                                                                const updatedTasks = tasks.map((t) =>
                                                                                    t.id === task.id ? { ...t, title: e.target.value } : t
                                                                                );
                                                                                setTasks(updatedTasks);
                                                                            }}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                        <TextField
                                                                            label="Description"
                                                                            fullWidth
                                                                            multiline
                                                                            rows={2}
                                                                            value={task.description || ""}
                                                                            onChange={(e) => {
                                                                                const updatedTasks = tasks.map((t) =>
                                                                                    t.id === task.id ? { ...t, description: e.target.value } : t
                                                                                );
                                                                                setTasks(updatedTasks);
                                                                            }}
                                                                            variant="outlined"
                                                                            size="small"
                                                                        />
                                                                        <Box
                                                                            sx={{
                                                                                display: "flex",
                                                                                gap: 2,
                                                                                flexWrap: "wrap",
                                                                                alignItems: "center",
                                                                            }}
                                                                        >
                                                                            <TextField
                                                                                label="Priority"
                                                                                select
                                                                                value={task.priority}
                                                                                onChange={(e) => {
                                                                                    const updatedTasks = tasks.map((t) =>
                                                                                        t.id === task.id
                                                                                            ? {
                                                                                                  ...t,
                                                                                                  priority: e.target.value as
                                                                                                      | "low"
                                                                                                      | "medium"
                                                                                                      | "high",
                                                                                              }
                                                                                            : t
                                                                                    );
                                                                                    setTasks(updatedTasks);
                                                                                }}
                                                                                variant="outlined"
                                                                                size="small"
                                                                                sx={{ minWidth: 120 }}
                                                                            >
                                                                                <MenuItem value="low">Low</MenuItem>
                                                                                <MenuItem value="medium">Medium</MenuItem>
                                                                                <MenuItem value="high">High</MenuItem>
                                                                            </TextField>
                                                                            <Button
                                                                                onClick={() => handleSaveTask(task)}
                                                                                variant="contained"
                                                                                startIcon={<Save />}
                                                                                size="small"
                                                                            >
                                                                                Save
                                                                            </Button>
                                                                            <Button
                                                                                onClick={handleCancelEdit}
                                                                                variant="outlined"
                                                                                startIcon={<Close />}
                                                                                size="small"
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </Box>
                                                                    </Stack>
                                                                ) : (
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
                                                                            checked={task.completed}
                                                                            onChange={() => handleToggleComplete(task.id)}
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
                                                                                flexWrap: "wrap",
                                                                            }}
                                                                        >
                                                                            {task.repeat && (
                                                                                <Chip
                                                                                    icon={<Repeat fontSize="small" />}
                                                                                    label={task.repeat.frequency}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        fontSize: "0.65rem",
                                                                                        height: 24,
                                                                                    }}
                                                                                />
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
                                                                                onClick={() => handleEditTask(task)}
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
                                                                )}
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
    );
};
