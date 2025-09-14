import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, IconButton, InputAdornment, Alert, Fade, useMediaQuery, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Person, Cake, Scale, Height, AccountCircle } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { userRegister, userLogin } from "../api/userAuthApi";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/slices/userSlice";

export const Login: React.FC = () => {
    const dispatch = useAppDispatch();

    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Form state
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        birthDate: "",
        weight: "",
        height: "",
    });

    // Form errors
    const [loginErrors, setLoginErrors] = useState({
        email: "",
        password: "",
    });

    const [registerErrors, setRegisterErrors] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        birthDate: "",
        weight: "",
        height: "",
    });

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateLoginForm = () => {
        let isValid = true;
        const errors = { email: "", password: "" };

        if (!loginForm.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(loginForm.email)) {
            errors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!loginForm.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (loginForm.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        setLoginErrors(errors);
        return isValid;
    };

    const validateRegisterForm = () => {
        let isValid = true;
        const errors = {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            birthDate: "",
            weight: "",
            height: "",
        };

        // First name validation
        if (!registerForm.firstName) {
            errors.firstName = "First name is required";
            isValid = false;
        }

        // Last name validation
        if (!registerForm.lastName) {
            errors.lastName = "Last name is required";
            isValid = false;
        }

        // Username validation
        if (!registerForm.username) {
            errors.username = "Username is required";
            isValid = false;
        } else if (registerForm.username.length < 3) {
            errors.username = "Username must be at least 3 characters";
            isValid = false;
        }

        // Email validation
        if (!registerForm.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!validateEmail(registerForm.email)) {
            errors.email = "Please enter a valid email";
            isValid = false;
        }

        // Password validation
        if (!registerForm.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (registerForm.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        // Confirm password validation
        if (!registerForm.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (registerForm.password !== registerForm.confirmPassword) {
            errors.confirmPassword = "Passwords must match";
            isValid = false;
        }

        // Age validation
        const ageNum = parseInt(registerForm.age);
        if (!registerForm.age) {
            errors.age = "Age is required";
            isValid = false;
        } else if (isNaN(ageNum)) {
            errors.age = "Age must be a number";
            isValid = false;
        } else if (ageNum < 13) {
            errors.age = "You must be at least 13 years old";
            isValid = false;
        } else if (ageNum > 120) {
            errors.age = "Please enter a valid age";
            isValid = false;
        }

        // Birth date validation
        if (!registerForm.birthDate) {
            errors.birthDate = "Birth date is required";
            isValid = false;
        } else if (new Date(registerForm.birthDate) > new Date()) {
            errors.birthDate = "Birth date cannot be in the future";
            isValid = false;
        }

        // Weight validation
        const weightNum = parseFloat(registerForm.weight);
        if (!registerForm.weight) {
            errors.weight = "Weight is required";
            isValid = false;
        } else if (isNaN(weightNum)) {
            errors.weight = "Weight must be a number";
            isValid = false;
        } else if (weightNum < 20) {
            errors.weight = "Weight must be at least 20 kg";
            isValid = false;
        } else if (weightNum > 300) {
            errors.weight = "Weight must be less than 300 kg";
            isValid = false;
        }

        // Height validation
        const heightNum = parseFloat(registerForm.height);
        if (!registerForm.height) {
            errors.height = "Height is required";
            isValid = false;
        } else if (isNaN(heightNum)) {
            errors.height = "Height must be a number";
            isValid = false;
        } else if (heightNum < 100) {
            errors.height = "Height must be at least 100 cm";
            isValid = false;
        } else if (heightNum > 250) {
            errors.height = "Height must be less than 250 cm";
            isValid = false;
        }

        setRegisterErrors(errors);
        return isValid;
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setAuthError(null);
        // Reset forms
        setLoginForm({ email: "", password: "" });
        setRegisterForm({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            birthDate: "",
            weight: "",
            height: "",
        });
        // Reset errors
        setLoginErrors({ email: "", password: "" });
        setRegisterErrors({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            age: "",
            birthDate: "",
            weight: "",
            height: "",
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateLoginForm()) return;

        setIsSubmitting(true);
        setAuthError(null);

        try {
            const response = await userLogin(loginForm.email, loginForm.password);
            console.log("Login successful:", response);
            dispatch(
                setUser({
                    user: response.user,
                    token: response.token,
                })
            );

            setTimeout(() => {
                navigate("/");
            }, 500);
        } catch (error: any) {
            setAuthError(error.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;

        setIsSubmitting(true);
        setAuthError(null);

        try {
            const registerData = {
                email: registerForm.email,
                firstName: registerForm.firstName,
                lastName: registerForm.lastName,
                age: parseInt(registerForm.age),
                birthDate: registerForm.birthDate,
                weight: parseFloat(registerForm.weight),
                height: parseFloat(registerForm.height),
                username: registerForm.username,
                password: registerForm.password,
            };

            await userRegister(registerData);

            // Clear the registration form and switch to login form
            setRegisterForm({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                age: "",
                birthDate: "",
                weight: "",
                height: "",
            });

            setAuthError(null);
            setIsLogin(true);

            setLoginForm({
                email: registerForm.email,
                password: "",
            });
        } catch (error: any) {
            setAuthError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({ ...prev, [name]: value }));

        if (loginErrors[name as keyof typeof loginErrors]) {
            setLoginErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterForm((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (registerErrors[name as keyof typeof registerErrors]) {
            setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const,
            },
        },
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isMobile ? "white" : "linear-gradient(to bottom, #f5f5f5, #e0e0e0)",
                p: isMobile ? 1 : 2,
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%", maxWidth: "450px" }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        width: "100%",
                        maxWidth: "450px",
                        borderRadius: 4,
                        overflow: "hidden",
                        bgcolor: "#ffffff",
                        border: isMobile ? "none" : "1px solid #e0e0e0",
                        boxShadow: isMobile ? "none" : "0 8px 32px rgba(0, 0, 0, 0.08)",
                        mx: "auto", // Center the form
                    }}
                >
                    <Box
                        sx={{
                            p: isMobile ? 2 : 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/* Livo Branding */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ marginBottom: "16px" }}
                        >
                            <Typography
                                variant={isMobile ? "h4" : "h3"}
                                component="h1"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: "-0.5px",
                                    textAlign: "center",
                                    background: "linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Livo
                            </Typography>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {authError && (
                                <Fade in timeout={500}>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            width: "100%",
                                            mb: 2,
                                            borderRadius: 2,
                                            bgcolor: "#f5f5f5",
                                            color: "#d32f2f",
                                            border: "1px solid #ffcdd2",
                                        }}
                                        onClose={() => setAuthError(null)}
                                    >
                                        {authError}
                                    </Alert>
                                </Fade>
                            )}
                        </AnimatePresence>

                        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: "100%" }}>
                            <motion.div variants={itemVariants}>
                                <Typography
                                    variant={isMobile ? "h6" : "h5"}
                                    component="h2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: "#212121",
                                        textAlign: "center",
                                        mb: 1,
                                    }}
                                >
                                    {isLogin ? "Welcome Back" : "Create Account"}
                                </Typography>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Typography variant="body2" sx={{ mb: 3, textAlign: "center", color: "#616161" }}>
                                    {isLogin ? "Sign in to continue your journey" : "Join us to get started on your journey"}
                                </Typography>
                            </motion.div>

                            <Box component="form" onSubmit={isLogin ? handleLogin : handleRegister} sx={{ width: "100%" }}>
                                {!isLogin && (
                                    <>
                                        <motion.div variants={itemVariants}>
                                            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, mb: 2 }}>
                                                <TextField
                                                    name="firstName"
                                                    value={registerForm.firstName}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="First Name"
                                                    error={!!registerErrors.firstName}
                                                    helperText={registerErrors.firstName}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <TextField
                                                    name="lastName"
                                                    value={registerForm.lastName}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="Last Name"
                                                    error={!!registerErrors.lastName}
                                                    helperText={registerErrors.lastName}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <TextField
                                                name="username"
                                                value={registerForm.username}
                                                onChange={handleRegisterChange}
                                                fullWidth
                                                label="Username"
                                                error={!!registerErrors.username}
                                                helperText={registerErrors.username}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    mb: 2,
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                    },
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountCircle sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </motion.div>
                                    </>
                                )}

                                <motion.div variants={itemVariants}>
                                    <TextField
                                        name="email"
                                        value={isLogin ? loginForm.email : registerForm.email}
                                        onChange={isLogin ? handleLoginChange : handleRegisterChange}
                                        fullWidth
                                        label="Email"
                                        type="email"
                                        error={isLogin ? !!loginErrors.email : !!registerErrors.email}
                                        helperText={isLogin ? loginErrors.email : registerErrors.email}
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </motion.div>

                                {!isLogin && (
                                    <>
                                        <motion.div variants={itemVariants}>
                                            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, mb: 2 }}>
                                                <TextField
                                                    name="age"
                                                    value={registerForm.age}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="Age"
                                                    type="number"
                                                    error={!!registerErrors.age}
                                                    helperText={registerErrors.age}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Cake sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <TextField
                                                    name="birthDate"
                                                    value={registerForm.birthDate}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="Birth Date"
                                                    type="date"
                                                    error={!!registerErrors.birthDate}
                                                    helperText={registerErrors.birthDate}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Box>
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, mb: 2 }}>
                                                <TextField
                                                    name="weight"
                                                    value={registerForm.weight}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="Weight (kg)"
                                                    type="number"
                                                    error={!!registerErrors.weight}
                                                    helperText={registerErrors.weight}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Scale sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                                <TextField
                                                    name="height"
                                                    value={registerForm.height}
                                                    onChange={handleRegisterChange}
                                                    fullWidth
                                                    label="Height (cm)"
                                                    type="number"
                                                    error={!!registerErrors.height}
                                                    helperText={registerErrors.height}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            borderRadius: 2,
                                                        },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Height sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Box>
                                        </motion.div>
                                    </>
                                )}

                                <motion.div variants={itemVariants}>
                                    <TextField
                                        name="password"
                                        value={isLogin ? loginForm.password : registerForm.password}
                                        onChange={isLogin ? handleLoginChange : handleRegisterChange}
                                        fullWidth
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        error={isLogin ? !!loginErrors.password : !!registerErrors.password}
                                        helperText={isLogin ? loginErrors.password : registerErrors.password || "At least 8 characters"}
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            mb: 2,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        sx={{ color: "#9e9e9e" }}
                                                        size="medium"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                        ) : (
                                                            <Visibility sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </motion.div>

                                <AnimatePresence>
                                    {!isLogin && (
                                        <motion.div
                                            variants={itemVariants}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TextField
                                                name="confirmPassword"
                                                value={registerForm.confirmPassword}
                                                onChange={handleRegisterChange}
                                                fullWidth
                                                label="Confirm Password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                error={!!registerErrors.confirmPassword}
                                                helperText={registerErrors.confirmPassword}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    mb: 2,
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                    },
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                                sx={{ color: "#9e9e9e" }}
                                                                size="medium"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <VisibilityOff sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                                ) : (
                                                                    <Visibility sx={{ color: "#9e9e9e", fontSize: isMobile ? "20px" : "20px" }} />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {isLogin && (
                                    <motion.div variants={itemVariants}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                mb: 2,
                                            }}
                                        >
                                            <Button
                                                variant="text"
                                                size="small"
                                                sx={{
                                                    textTransform: "none",
                                                    color: "#616161",
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                        color: "#212121",
                                                    },
                                                }}
                                            >
                                                Forgot Password?
                                            </Button>
                                        </Box>
                                    </motion.div>
                                )}

                                <motion.div variants={itemVariants}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size={isMobile ? "medium" : "large"}
                                        disabled={isSubmitting}
                                        sx={{
                                            py: isMobile ? 1 : 1.5,
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            backgroundColor: "#212121",
                                            color: "#ffffff",
                                            mb: 2,
                                            "&:hover": {
                                                backgroundColor: "#424242",
                                                transform: "translateY(-2px)",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            },
                                            "&:disabled": {
                                                backgroundColor: "#9e9e9e",
                                            },
                                            transition: "all 0.2s ease-in-out",
                                        }}
                                    >
                                        {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Sign up"}
                                    </Button>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexWrap: isMobile ? "wrap" : "nowrap",
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ color: "#757575", textAlign: "center" }}>
                                            {isLogin ? "Don't you have an account?" : "Already have an account?"}
                                        </Typography>
                                        <Button
                                            onClick={toggleForm}
                                            sx={{
                                                textTransform: "none",
                                                ml: 0.5,
                                                fontWeight: 600,
                                                color: "#212121",
                                                "&:hover": {
                                                    backgroundColor: "transparent",
                                                    color: "#424242",
                                                },
                                            }}
                                        >
                                            {isLogin ? "Sign up" : "Sign in"}
                                        </Button>
                                    </Box>
                                </motion.div>
                            </Box>
                        </motion.div>
                    </Box>

                    <Box
                        sx={{
                            py: 2,
                            px: 4,
                            bgcolor: isMobile ? "transparent" : "#f5f5f5",
                            textAlign: "center",
                            borderTop: isMobile ? "none" : "1px solid #e0e0e0",
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "#9e9e9e", fontSize: isMobile ? "0.75rem" : "0.875rem" }}>
                            © 2025 Livo. ALL RIGHTS RESERVED
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
