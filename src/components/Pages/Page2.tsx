import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export const Page2: React.FC = () => {
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
                Users
            </Typography>
            <Typography variant="body1" color="text.secondary">
                User management page. Display user data here.
            </Typography>
        </Paper>
    );
};
