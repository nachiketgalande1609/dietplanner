import { Box } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";

interface CalendarPanelProps {
    isMobile: boolean;
    showCalendar: boolean;
    selectedDate: Dayjs;
    handleDateChange: (date: Dayjs | null) => void;
}

export default function CalendarPanel({ isMobile, showCalendar, selectedDate, handleDateChange }: CalendarPanelProps) {
    return (
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
                            borderRadius: { xs: 0, sm: 3 },
                            bgcolor: "background.default",
                            borderColor: "divider",
                            overflow: "hidden", // Add this to prevent scrollbar
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={selectedDate}
                                onChange={handleDateChange}
                                sx={{
                                    width: "100%",
                                    maxHeight: 360, // Fixed height to prevent overflow
                                    borderRadius: { xs: 0, sm: 3 },
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    py: 1,
                                    px: 2,
                                    overflow: "hidden", // Hide any potential overflow
                                    "& .MuiPickersCalendarHeader-root": {
                                        mt: 0.5,
                                        mb: 1,
                                    },
                                    "& .MuiDayCalendar-header": {
                                        mb: 0.5,
                                    },
                                    "& .MuiDayCalendar-slideTransition": {
                                        minHeight: 240, // Fixed height for the days container
                                    },
                                    "& .Mui-selected": {
                                        background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                        color: "white",
                                        fontWeight: "bold",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        "&:hover": {
                                            backgroundColor: "primary.dark",
                                        },
                                    },
                                    "& .MuiPickersDay-root": {
                                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                                        width: { xs: 36, md: 42 },
                                        height: { xs: 36, md: 42 },
                                        borderRadius: "8px",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            transform: "scale(1.05)",
                                        },
                                        "&.Mui-selected:hover": {
                                            transform: "scale(1.05)",
                                        },
                                    },
                                    "& .MuiTypography-caption": {
                                        color: "text.secondary",
                                        fontWeight: "600",
                                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                                    },
                                    "& .MuiPickersCalendarHeader-label": {
                                        color: "text.primary",
                                        fontWeight: "700",
                                        fontSize: { xs: "0.95rem", md: "1.1rem" },
                                        letterSpacing: "0.5px",
                                    },
                                    "& .MuiPickersCalendarHeader-switchViewButton": {
                                        color: "text.secondary",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                            color: "primary.main",
                                        },
                                    },
                                    "& .MuiPickersArrowSwitcher-button": {
                                        color: "text.secondary",
                                        "&:hover": {
                                            backgroundColor: "transparent",
                                            color: "primary.main",
                                        },
                                    },
                                    "& .MuiDayCalendar-weekDayLabel": {
                                        height: { xs: 36, md: 42 },
                                    },
                                    "& .MuiPickersDay-today": {
                                        border: "2px solid",
                                        borderColor: "#FF8E53",
                                    },
                                }}
                                showDaysOutsideCurrentMonth
                            />
                        </LocalizationProvider>
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
