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
    );
}
