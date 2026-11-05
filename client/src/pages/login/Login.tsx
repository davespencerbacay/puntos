import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import mainLogo from "assets/main-logo.png";
import { APP_NAME, TAG_LINE } from "constants/constants";
import type { LoginFormErrors, LoginFormTouched, LoginFormValues } from "models/login";

const initialValues: LoginFormValues = {
    email: "",
    password: "",
};

const initialTouched: LoginFormTouched = {
    email: false,
    password: false,
};

const initialErrors: LoginFormErrors = {
    email: "",
    password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState<LoginFormValues>(initialValues);
    const [touched, setTouched] = useState<LoginFormTouched>(initialTouched);
    const [errors, setErrors] = useState<LoginFormErrors>(initialErrors);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateField = (name: keyof LoginFormValues, value: string): string => {
        const trimmed = value.trim();

        if (!trimmed) {
            if (name === "email") return "Email Address is required.";
            if (name === "password") return "Password is required.";
        }

        if (name === "email" && !emailPattern.test(trimmed)) {
            return "Please enter a valid email address.";
        }

        if (name === "password" && trimmed.length < 8) {
            return "Password must be at least 8 characters.";
        }

        return "";
    };

    const handleChange = (name: keyof LoginFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (name: keyof LoginFormValues) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors: LoginFormErrors = {
            email: validateField("email", values.email),
            password: validateField("password", values.password),
        };

        setTouched({ email: true, password: true });
        setErrors(nextErrors);

        const isValid = !Object.values(nextErrors).some(Boolean);
        setIsSubmitted(isValid);

        if (isValid) {
            navigate("/portal/dashboard");
        }
    };

    return (
        <Box
            component="section"
            sx={{
                py: { xs: 4, md: 8 },
                minHeight: "calc(100vh - 160px)",
                display: "flex",
                alignItems: "center",
                backgroundColor: "var(--color-background)",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        p: { xs: 3, sm: 4 },
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
                    }}
                >
                    <Stack spacing={3}>
                        <Box sx={{ textAlign: "center" }}>
                            <Box
                                component="img"
                                src={mainLogo}
                                alt={`${APP_NAME} - ${TAG_LINE}`}
                                sx={{
                                    height: { xs: "38px", sm: "46px" },
                                    width: "auto",
                                    maxWidth: "220px",
                                    mb: 2,
                                }}
                            />

                            <Typography variant="h4" sx={{ fontWeight: 700, color: "var(--color-text-primary)" }}>
                                Welcome back
                            </Typography>
                            <Typography sx={{ mt: 1, color: "var(--color-text-secondary)" }}>
                                Sign in to continue to your Puntos dashboard.
                            </Typography>
                        </Box>

                        {isSubmitted && (
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                Login details look good. Redirecting to dashboard...
                            </Alert>
                        )}

                        <Box component="form" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    value={values.email}
                                    onChange={(event) => handleChange("email", event.target.value)}
                                    onBlur={() => handleBlur("email")}
                                    error={Boolean(touched.email && errors.email)}
                                    helperText={touched.email ? errors.email : " "}
                                    required
                                    autoComplete="email"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "var(--color-input-background)",
                                        },
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    value={values.password}
                                    onChange={(event) => handleChange("password", event.target.value)}
                                    onBlur={() => handleBlur("password")}
                                    error={Boolean(touched.password && errors.password)}
                                    helperText={touched.password ? errors.password : "Use at least 8 characters."}
                                    required
                                    autoComplete="current-password"
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        edge="end"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "var(--color-input-background)",
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disableElevation
                                    sx={{
                                        mt: 0.5,
                                        py: 1.4,
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        textTransform: "none",
                                        backgroundColor: "var(--color-primary)",
                                        "&:hover": {
                                            backgroundColor: "var(--color-primary-hover)",
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Stack>
                        </Box>

                        <Typography sx={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
                            Don't have an account?{" "}
                            <Link component={RouterLink} to="/register" sx={{ color: "var(--color-primary)", fontWeight: 700 }}>
                                Create one
                            </Link>
                        </Typography>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
