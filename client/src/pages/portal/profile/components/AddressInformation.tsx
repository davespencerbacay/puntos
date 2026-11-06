import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import type {
    AddressInformationErrors,
    AddressInformationTouched,
    AddressInformationValues,
} from "models/profile";

import "../Profile.scss";

interface AddressInformationProps {
    isEditing: boolean;
    values: AddressInformationValues;
    touched: AddressInformationTouched;
    errors: AddressInformationErrors;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onChange: (field: keyof AddressInformationValues, value: string) => void;
    onBlur: (field: keyof AddressInformationValues) => void;
}

const countryOptions = ["Philippines", "United States", "Canada", "Australia"];

const AddressInformation = ({
    isEditing,
    values,
    touched,
    errors,
    onEdit,
    onCancel,
    onSave,
    onChange,
    onBlur,
}: AddressInformationProps) => {
    return (
        <Box className="profile-card">
            <Box className="profile-section__header">
                <Box>
                    <Typography className="profile-section__title">Address Information</Typography>
                    <Typography className="profile-section__subtitle">
                        Update your current address details for account verification.
                    </Typography>
                </Box>

                {!isEditing ? (
                    <Button
                        variant="outlined"
                        startIcon={<EditRoundedIcon />}
                        onClick={onEdit}
                        sx={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Edit
                    </Button>
                ) : (
                    <Box className="profile-section__actions">
                        <Button
                            variant="contained"
                            startIcon={<SaveRoundedIcon />}
                            onClick={onSave}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "var(--color-primary)",
                                "&:hover": { backgroundColor: "var(--color-primary-hover)" },
                            }}
                        >
                            Save Changes
                        </Button>
                        <Button
                            variant="text"
                            startIcon={<CloseRoundedIcon />}
                            onClick={onCancel}
                            sx={{
                                color: "var(--color-text-secondary)",
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>

            <Box className="profile-grid">
                <TextField
                    label="Country"
                    select
                    value={values.country}
                    onChange={(event) => onChange("country", event.target.value)}
                    onBlur={() => onBlur("country")}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country ? errors.country : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                >
                    <MenuItem value="">Select country</MenuItem>
                    {countryOptions.map((country) => (
                        <MenuItem key={country} value={country}>
                            {country}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Province / State"
                    value={values.provinceOrState}
                    onChange={(event) => onChange("provinceOrState", event.target.value)}
                    onBlur={() => onBlur("provinceOrState")}
                    error={Boolean(touched.provinceOrState && errors.provinceOrState)}
                    helperText={touched.provinceOrState ? errors.provinceOrState : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="City / Municipality"
                    value={values.cityOrMunicipality}
                    onChange={(event) => onChange("cityOrMunicipality", event.target.value)}
                    onBlur={() => onBlur("cityOrMunicipality")}
                    error={Boolean(touched.cityOrMunicipality && errors.cityOrMunicipality)}
                    helperText={touched.cityOrMunicipality ? errors.cityOrMunicipality : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="Barangay"
                    value={values.barangay}
                    onChange={(event) => onChange("barangay", event.target.value)}
                    onBlur={() => onBlur("barangay")}
                    error={Boolean(touched.barangay && errors.barangay)}
                    helperText={touched.barangay ? errors.barangay : " "}
                    disabled={!isEditing}
                    fullWidth
                />

                <TextField
                    label="Street Address"
                    value={values.streetAddress}
                    onChange={(event) => onChange("streetAddress", event.target.value)}
                    onBlur={() => onBlur("streetAddress")}
                    error={Boolean(touched.streetAddress && errors.streetAddress)}
                    helperText={touched.streetAddress ? errors.streetAddress : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />

                <TextField
                    label="ZIP Code"
                    value={values.zipCode}
                    onChange={(event) => onChange("zipCode", event.target.value)}
                    onBlur={() => onBlur("zipCode")}
                    error={Boolean(touched.zipCode && errors.zipCode)}
                    helperText={touched.zipCode ? errors.zipCode : " "}
                    disabled={!isEditing}
                    required
                    fullWidth
                />
            </Box>
        </Box>
    );
};

export default AddressInformation;
