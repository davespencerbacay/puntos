
import { Box, MenuItem, TextField, Typography } from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import PuntosButton from "components/button/PuntosButton";

import type {
    PersonalInformationErrors,
    PersonalInformationTouched,
    PersonalInformationValues,
} from "models/profile";

import "../Profile.scss";

interface PersonalInformationProps {
    isEditing: boolean;
    values: PersonalInformationValues;
    touched: PersonalInformationTouched;
    errors: PersonalInformationErrors;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onChange: (field: keyof PersonalInformationValues, value: string) => void;
    onBlur: (field: keyof PersonalInformationValues) => void;
}

const genderOptions = ["", "Female", "Male", "Non-binary", "Prefer not to say"];

const PersonalInformation = ({
    isEditing,
    values,
    touched,
    errors,
    onEdit,
    onCancel,
    onSave,
    onChange,
    onBlur,
}: PersonalInformationProps) => {
    return (
        <Box className="profile-card">
            <Box className="profile-section__header">
                <Box>
                    <Typography className="profile-section__title">
                        Personal Information
                    </Typography>
                    <Typography className="profile-section__subtitle">
                        Keep your account details accurate and up to date.
                    </Typography>
                </Box>

                {!isEditing ? (
                    <PuntosButton
                        colorType="white"
                        variant="outlined"
                        startIcon={<EditRoundedIcon />}
                        onClick={onEdit}
                    >
                        Edit
                    </PuntosButton>
                ) : (
                    <Box className="profile-section__actions">
                        <PuntosButton
                            colorType="violet"
                            startIcon={<SaveRoundedIcon />}
                            onClick={onSave}
                        >
                            Save Changes
                        </PuntosButton>

                        <PuntosButton
                            colorType="white"
                            variant="outlined"
                            startIcon={<CloseRoundedIcon />}
                            onClick={onCancel}
                        >
                            Cancel
                        </PuntosButton>
                    </Box>
                )}
            </Box>

            <Box className="profile-grid">
                <TextField
                    label="First Name"
                    value={values.firstName}
                    onChange={(event) => onChange("firstName", event.target.value)}
                    onBlur={() => onBlur("firstName")}
                    error={Boolean(touched.firstName && errors.firstName)}
                    helperText={touched.firstName ? errors.firstName : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Last Name"
                    value={values.lastName}
                    onChange={(event) => onChange("lastName", event.target.value)}
                    onBlur={() => onBlur("lastName")}
                    error={Boolean(touched.lastName && errors.lastName)}
                    helperText={touched.lastName ? errors.lastName : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Display Name"
                    value={values.displayName}
                    onChange={(event) => onChange("displayName", event.target.value)}
                    onBlur={() => onBlur("displayName")}
                    error={Boolean(touched.displayName && errors.displayName)}
                    helperText={touched.displayName ? errors.displayName : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Email Address"
                    type="email"
                    value={values.emailAddress}
                    onChange={(event) => onChange("emailAddress", event.target.value)}
                    onBlur={() => onBlur("emailAddress")}
                    error={Boolean(touched.emailAddress && errors.emailAddress)}
                    helperText={touched.emailAddress ? errors.emailAddress : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Phone Number"
                    value={values.phoneNumber}
                    onChange={(event) => onChange("phoneNumber", event.target.value)}
                    onBlur={() => onBlur("phoneNumber")}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber ? errors.phoneNumber : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Date of Birth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={(event) => onChange("dateOfBirth", event.target.value)}
                    onBlur={() => onBlur("dateOfBirth")}
                    error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                    helperText={touched.dateOfBirth ? errors.dateOfBirth : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: { shrink: true },
                    }}
                />

                <TextField
                    label="Gender"
                    select
                    value={values.gender}
                    onChange={(event) => onChange("gender", event.target.value)}
                    onBlur={() => onBlur("gender")}
                    error={Boolean(touched.gender && errors.gender)}
                    helperText={touched.gender ? errors.gender : " "}
                    disabled={!isEditing}
                    fullWidth
                >
                    {genderOptions.map((option) => (
                        <MenuItem key={option || "empty"} value={option}>
                            {option || "Select gender"}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </Box>
    );
};

export default PersonalInformation;
