import React from "react";
import { Typography, Paper } from "@mui/material";

export const Page3: React.FC = () => {
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                height: "calc(100vh - 120px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                Messages
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Message center. View and manage your messages here.
            </Typography>
        </Paper>
    );
};
