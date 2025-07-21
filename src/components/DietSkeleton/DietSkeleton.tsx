import { Box, List, ListItem, ListItemSecondaryAction, Paper, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";

type LoadingSkeletonProps = {
    isMobile: boolean;
};

export const DietSkeleton = ({ isMobile }: LoadingSkeletonProps) => {
    const theme = useTheme();
    const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "auto",
                minHeight: "100%",
                bgcolor: "background.default",
                gap: 2,
            }}
        >
            {/* Daily Progress Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Skeleton variant="text" width={100} height={24} />
                        <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                    </Stack>
                    <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 12 }} />
                </Stack>
                <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 5 }} />
            </Paper>

            {/* Meals List Skeleton */}
            <List sx={{ width: "100%", flex: 1, py: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[1, 2, 3, 4, 5].map((mealIndex) => (
                    <Paper
                        key={mealIndex}
                        elevation={isMobile ? 0 : 1}
                        sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            border: isMobile ? "none" : "1px solid",
                            borderColor: "divider",
                            borderLeft: `4px solid ${theme.palette.divider}`,
                            bgcolor: "background.paper",
                            boxShadow: "none",
                        }}
                    >
                        <ListItem
                            sx={{
                                pr: { xs: 8, sm: 10 },
                                py: { xs: 1.5, sm: 2 },
                            }}
                        >
                            <ListItemSecondaryAction sx={{ right: { xs: 36, sm: 48 } }}>
                                <Skeleton variant="circular" width={24} height={24} />
                            </ListItemSecondaryAction>

                            <ListItemSecondaryAction>
                                <Skeleton variant="circular" width={32} height={32} />
                            </ListItemSecondaryAction>

                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Skeleton variant="circular" width={32} height={32} sx={{ display: { xs: "none", sm: "block" } }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                            <Skeleton variant="text" width={80} height={24} />
                                            <Skeleton variant="text" width={120} height={20} />
                                        </Stack>
                                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                            {!isSmallMobile && <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />}
                                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                                            <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
};
