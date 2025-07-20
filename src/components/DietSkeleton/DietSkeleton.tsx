import { Box, Divider, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";

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
                p: { xs: 1, sm: 2 },
            }}
        >
            {/* Daily Progress Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2 },
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
                {[1, 2, 3].map((mealIndex) => (
                    <Paper
                        key={mealIndex}
                        elevation={isMobile ? 0 : 1}
                        sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            borderLeft: `4px solid ${theme.palette.divider}`,
                            bgcolor: "background.paper",
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

                        {/* Meal items skeleton */}
                        <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 } }}>
                            <Divider sx={{ mb: 1.5 }} />
                            {[1, 2].map((itemIndex) => (
                                <ListItem key={itemIndex} sx={{ py: 0.5, px: { xs: 0, sm: 1 } }}>
                                    <ListItemText
                                        primary={<Skeleton variant="text" width="60%" height={20} />}
                                        secondary={
                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
                                                <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 12 }} />
                                                <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 12 }} />
                                            </Stack>
                                        }
                                        secondaryTypographyProps={{ component: "div" }}
                                    />
                                </ListItem>
                            ))}
                        </Box>
                    </Paper>
                ))}
            </List>

            {/* Daily Nutrition Skeleton */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    borderRadius: "12px",
                    bgcolor: "background.paper",
                    border: "none",
                    boxShadow: theme.shadows[2],
                }}
            >
                <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />

                <Stack spacing={2}>
                    {/* Calories Skeleton */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: "10px",
                            bgcolor: theme.palette.error.light,
                            borderLeft: "4px solid",
                            borderColor: theme.palette.error.main,
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Skeleton variant="circular" width={20} height={20} />
                                <Skeleton variant="text" width={60} height={24} />
                            </Stack>
                            <Stack alignItems="flex-end" spacing={0.5}>
                                <Skeleton variant="text" width={100} height={28} />
                                <Skeleton variant="text" width={40} height={16} />
                            </Stack>
                        </Stack>
                    </Paper>

                    {/* Macros Row Skeleton */}
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                        {/* Protein */}
                        <Box sx={{ flex: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    height: "100%",
                                    borderRadius: "10px",
                                    bgcolor: theme.palette.primary.light,
                                    borderLeft: "4px solid",
                                    borderColor: theme.palette.primary.main,
                                }}
                            >
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={50} height={20} />
                                    </Stack>
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                            </Paper>
                        </Box>

                        {/* Carbs */}
                        <Box sx={{ flex: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    height: "100%",
                                    borderRadius: "10px",
                                    bgcolor: theme.palette.success.light,
                                    borderLeft: "4px solid",
                                    borderColor: theme.palette.success.main,
                                }}
                            >
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={50} height={20} />
                                    </Stack>
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                            </Paper>
                        </Box>

                        {/* Fats */}
                        <Box sx={{ flex: 1 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    height: "100%",
                                    borderRadius: "10px",
                                    bgcolor: theme.palette.warning.light,
                                    borderLeft: "4px solid",
                                    borderColor: theme.palette.warning.main,
                                }}
                            >
                                <Stack direction="column" spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width={50} height={20} />
                                    </Stack>
                                    <Skeleton variant="text" width={80} height={24} />
                                </Stack>
                            </Paper>
                        </Box>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};
