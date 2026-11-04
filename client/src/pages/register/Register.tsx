import { useMemo, useState } from "react";
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
import { Link as RouterLink } from "react-router-dom";

import mainLogo from "assets/main-logo.png";
import { APP_NAME, TAG_LINE } from "constants/constants";
import UserInformationCard from "../../components/user-information/UserInformationCard";

type RegisterFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
};

type RegisterFormTouched = Record<keyof RegisterFormValues, boolean>;
type RegisterFormErrors = Record<keyof RegisterFormValues, string>;

const initialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
};

const initialTouched: RegisterFormTouched = {
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
};

const initialErrors: RegisterFormErrors = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9()\-\s]{7,20}$/;

const Register = () => {
    const [values, setValues] = useState<RegisterFormValues>(initialValues);
    const [touched, setTouched] = useState<RegisterFormTouched>(initialTouched);
    const [errors, setErrors] = useState<RegisterFormErrors>(initialErrors);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateField = (name: keyof RegisterFormValues, value: string): string => {
        const trimmed = value.trim();

        if (!trimmed) {
            switch (name) {
                case "firstName":
                    return "First Name is required.";
                case "lastName":
                    return "Last Name is required.";
                case "email":
                    return "Email Address is required.";
                case "phone":
                    return "Phone Number is required.";
                case "password":
                    return "Password is required.";
                default:
                    return "This field is required.";
            }
        }

        if (name === "email" && !emailPattern.test(trimmed)) {
            return "Please enter a valid email address.";
        }

        if (name === "phone") {
            const digitsCount = trimmed.replace(/\D/g, "").length;

            if (!phonePattern.test(trimmed) || digitsCount < 7) {
                return "Please enter a valid phone number.";
            }
        }

        if (name === "password" && trimmed.length < 8) {
            return "Password must be at least 8 characters.";
        }

        return "";
    };

    const validateAll = (formValues: RegisterFormValues): RegisterFormErrors => {
        return {
            firstName: validateField("firstName", formValues.firstName),
            lastName: validateField("lastName", formValues.lastName),
            email: validateField("email", formValues.email),
            phone: validateField("phone", formValues.phone),
            password: validateField("password", formValues.password),
        };
    };

    const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

    const handleChange = (name: keyof RegisterFormValues, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleBlur = (name: keyof RegisterFormValues) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, values[name]) }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = validateAll(values);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            password: true,
        });
        setErrors(nextErrors);

        const isValid = !Object.values(nextErrors).some(Boolean);

        setIsSubmitted(isValid);
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
                                Create your account
                            </Typography>
                            <Typography sx={{ mt: 1, color: "var(--color-text-secondary)" }}>
                                Reward loyalty and grow with Puntos.
                            </Typography>
                        </Box>

                        {isSubmitted && !hasErrors && (
                            <Alert severity="success" sx={{ borderRadius: 2 }}>
                                Registration details look good. You can continue to the next step.
                            </Alert>
                        )}
                        <UserInformationCard
                            user={{
                                firstName: "Dave",
                                lastName: "Johnson",
                                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                                id: "DAVE1"
                            }}
                            title="Account information"
                            subtitle="You're registering with the following account."
                        />
                        <Box component="form" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={values.firstName}
                                        onChange={(event) => handleChange("firstName", event.target.value)}
                                        onBlur={() => handleBlur("firstName")}
                                        error={Boolean(touched.firstName && errors.firstName)}
                                        helperText={touched.firstName ? errors.firstName : " "}
                                        required
                                        autoComplete="given-name"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "var(--color-input-background)",
                                            },
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={values.lastName}
                                        onChange={(event) => handleChange("lastName", event.target.value)}
                                        onBlur={() => handleBlur("lastName")}
                                        error={Boolean(touched.lastName && errors.lastName)}
                                        helperText={touched.lastName ? errors.lastName : " "}
                                        required
                                        autoComplete="family-name"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                backgroundColor: "var(--color-input-background)",
                                            },
                                        }}
                                    />
                                </Stack>

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
                                    label="Phone Number"
                                    value={values.phone}
                                    onChange={(event) => handleChange("phone", event.target.value)}
                                    onBlur={() => handleBlur("phone")}
                                    error={Boolean(touched.phone && errors.phone)}
                                    helperText={touched.phone ? errors.phone : " "}
                                    required
                                    autoComplete="tel"
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
                                    autoComplete="new-password"
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
                                    Create Account
                                </Button>
                            </Stack>
                        </Box>

                        <Typography sx={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
                            Already have an account?{" "}
                            <Link component={RouterLink} to="/portal/dashboard" sx={{ color: "var(--color-primary)", fontWeight: 700 }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default Register;
