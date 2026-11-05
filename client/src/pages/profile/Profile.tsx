import { useMemo, useState } from "react";
import { Alert, Box, Breadcrumbs, Snackbar, Typography } from "@mui/material";

import type {
    AccountInformationValues,
    AddressInformationErrors,
    AddressInformationTouched,
    AddressInformationValues,
    PersonalInformationErrors,
    PersonalInformationTouched,
    PersonalInformationValues,
    ProfileOverviewData,
} from "models/profile";

import AccountInformation from "pages/profile/components/AccountInformation";
import AddressInformation from "pages/profile/components/AddressInformation";
import PersonalInformation from "pages/profile/components/PersonalInformation";
import ProfileOverview from "pages/profile/components/ProfileOverview";

import "./Profile.scss";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9()\-\s]{7,20}$/;
const zipCodePattern = /^[A-Za-z0-9\-\s]{3,10}$/;

const initialOverviewData: ProfileOverviewData = {
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    firstName: "Dave",
    lastName: "Spencer",
    emailAddress: "dave.spencer@example.com",
    memberId: "PNT-102948",
    membershipType: "Premium",
    accountStatus: "Active",
};

const initialPersonalValues: PersonalInformationValues = {
    firstName: "Dave",
    lastName: "Spencer",
    displayName: "Dave Spencer",
    emailAddress: "dave.spencer@example.com",
    phoneNumber: "+63 917 555 1111",
    dateOfBirth: "1993-04-16",
    gender: "Male",
};

const initialAddressValues: AddressInformationValues = {
    country: "Philippines",
    provinceOrState: "Metro Manila",
    cityOrMunicipality: "Taguig",
    barangay: "Fort Bonifacio",
    streetAddress: "26th Street, BGC",
    zipCode: "1634",
};

const accountValues: AccountInformationValues = {
    memberId: "PNT-102948",
    accountRole: "Partner",
    membershipType: "Premium",
    accountStatus: "Active",
    registrationDate: "March 12, 2025",
    organization: "Puntos Partner Network",
};

const initialPersonalTouched: PersonalInformationTouched = {
    firstName: false,
    lastName: false,
    displayName: false,
    emailAddress: false,
    phoneNumber: false,
    dateOfBirth: false,
    gender: false,
};

const initialAddressTouched: AddressInformationTouched = {
    country: false,
    provinceOrState: false,
    cityOrMunicipality: false,
    barangay: false,
    streetAddress: false,
    zipCode: false,
};

const initialPersonalErrors: PersonalInformationErrors = {
    firstName: "",
    lastName: "",
    displayName: "",
    emailAddress: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
};

const initialAddressErrors: AddressInformationErrors = {
    country: "",
    provinceOrState: "",
    cityOrMunicipality: "",
    barangay: "",
    streetAddress: "",
    zipCode: "",
};

const Profile = () => {
    const [overview, setOverview] = useState<ProfileOverviewData>(initialOverviewData);

    const [personalValues, setPersonalValues] = useState<PersonalInformationValues>(initialPersonalValues);
    const [personalDraft, setPersonalDraft] = useState<PersonalInformationValues>(initialPersonalValues);
    const [personalTouched, setPersonalTouched] = useState<PersonalInformationTouched>(initialPersonalTouched);
    const [personalErrors, setPersonalErrors] = useState<PersonalInformationErrors>(initialPersonalErrors);
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);

    const [addressValues, setAddressValues] = useState<AddressInformationValues>(initialAddressValues);
    const [addressDraft, setAddressDraft] = useState<AddressInformationValues>(initialAddressValues);
    const [addressTouched, setAddressTouched] = useState<AddressInformationTouched>(initialAddressTouched);
    const [addressErrors, setAddressErrors] = useState<AddressInformationErrors>(initialAddressErrors);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const personalSectionId = useMemo(() => "profile-personal-info", []);

    const showNotification = (message: string, severity: "success" | "error") => {
        setNotification({ open: true, message, severity });
    };

    const closeNotification = () => {
        setNotification((previous) => ({ ...previous, open: false }));
    };

    const validatePersonalField = (field: keyof PersonalInformationValues, value: string) => {
        const trimmed = value.trim();

        if (["firstName", "lastName", "displayName", "emailAddress", "phoneNumber", "dateOfBirth"].includes(field) && !trimmed) {
            if (field === "emailAddress") return "Email Address is required.";
            if (field === "phoneNumber") return "Phone Number is required.";
            if (field === "dateOfBirth") return "Date of Birth is required.";
            if (field === "displayName") return "Display Name is required.";
            if (field === "firstName") return "First Name is required.";
            if (field === "lastName") return "Last Name is required.";
        }

        if (field === "emailAddress" && trimmed && !emailPattern.test(trimmed)) {
            return "Please enter a valid email address.";
        }

        if (field === "phoneNumber" && trimmed) {
            const digitsCount = trimmed.replace(/\D/g, "").length;
            if (!phonePattern.test(trimmed) || digitsCount < 7) {
                return "Please enter a valid phone number.";
            }
        }

        return "";
    };

    const validateAddressField = (field: keyof AddressInformationValues, value: string) => {
        const trimmed = value.trim();

        if (["country", "provinceOrState", "cityOrMunicipality", "streetAddress", "zipCode"].includes(field) && !trimmed) {
            if (field === "country") return "Country is required.";
            if (field === "provinceOrState") return "Province / State is required.";
            if (field === "cityOrMunicipality") return "City / Municipality is required.";
            if (field === "streetAddress") return "Street Address is required.";
            if (field === "zipCode") return "ZIP Code is required.";
        }

        if (field === "zipCode" && trimmed && !zipCodePattern.test(trimmed)) {
            return "Please enter a valid ZIP Code.";
        }

        return "";
    };

    const beginEditPersonal = () => {
        setIsEditingPersonal(true);
        setPersonalDraft(personalValues);
        setPersonalTouched(initialPersonalTouched);
        setPersonalErrors(initialPersonalErrors);
    };

    const beginEditAddress = () => {
        setIsEditingAddress(true);
        setAddressDraft(addressValues);
        setAddressTouched(initialAddressTouched);
        setAddressErrors(initialAddressErrors);
    };

    const cancelEditPersonal = () => {
        setIsEditingPersonal(false);
        setPersonalDraft(personalValues);
        setPersonalTouched(initialPersonalTouched);
        setPersonalErrors(initialPersonalErrors);
    };

    const cancelEditAddress = () => {
        setIsEditingAddress(false);
        setAddressDraft(addressValues);
        setAddressTouched(initialAddressTouched);
        setAddressErrors(initialAddressErrors);
    };

    const handlePersonalChange = (field: keyof PersonalInformationValues, value: string) => {
        setPersonalDraft((previous) => ({ ...previous, [field]: value }));

        if (personalTouched[field]) {
            setPersonalErrors((previous) => ({
                ...previous,
                [field]: validatePersonalField(field, value),
            }));
        }
    };

    const handleAddressChange = (field: keyof AddressInformationValues, value: string) => {
        setAddressDraft((previous) => ({ ...previous, [field]: value }));

        if (addressTouched[field]) {
            setAddressErrors((previous) => ({
                ...previous,
                [field]: validateAddressField(field, value),
            }));
        }
    };

    const handlePersonalBlur = (field: keyof PersonalInformationValues) => {
        setPersonalTouched((previous) => ({ ...previous, [field]: true }));
        setPersonalErrors((previous) => ({
            ...previous,
            [field]: validatePersonalField(field, personalDraft[field]),
        }));
    };

    const handleAddressBlur = (field: keyof AddressInformationValues) => {
        setAddressTouched((previous) => ({ ...previous, [field]: true }));
        setAddressErrors((previous) => ({
            ...previous,
            [field]: validateAddressField(field, addressDraft[field]),
        }));
    };

    const savePersonalChanges = () => {
        const nextErrors: PersonalInformationErrors = {
            firstName: validatePersonalField("firstName", personalDraft.firstName),
            lastName: validatePersonalField("lastName", personalDraft.lastName),
            displayName: validatePersonalField("displayName", personalDraft.displayName),
            emailAddress: validatePersonalField("emailAddress", personalDraft.emailAddress),
            phoneNumber: validatePersonalField("phoneNumber", personalDraft.phoneNumber),
            dateOfBirth: validatePersonalField("dateOfBirth", personalDraft.dateOfBirth),
            gender: validatePersonalField("gender", personalDraft.gender),
        };

        setPersonalTouched({
            firstName: true,
            lastName: true,
            displayName: true,
            emailAddress: true,
            phoneNumber: true,
            dateOfBirth: true,
            gender: true,
        });
        setPersonalErrors(nextErrors);

        if (Object.values(nextErrors).some(Boolean)) {
            showNotification("Please fix highlighted personal information fields.", "error");
            return;
        }

        setPersonalValues(personalDraft);
        setOverview((previous) => ({
            ...previous,
            firstName: personalDraft.firstName,
            lastName: personalDraft.lastName,
            emailAddress: personalDraft.emailAddress,
        }));
        setIsEditingPersonal(false);

        showNotification("Personal information updated locally. Connect API to persist changes.", "success");
    };

    const saveAddressChanges = () => {
        const nextErrors: AddressInformationErrors = {
            country: validateAddressField("country", addressDraft.country),
            provinceOrState: validateAddressField("provinceOrState", addressDraft.provinceOrState),
            cityOrMunicipality: validateAddressField("cityOrMunicipality", addressDraft.cityOrMunicipality),
            barangay: validateAddressField("barangay", addressDraft.barangay),
            streetAddress: validateAddressField("streetAddress", addressDraft.streetAddress),
            zipCode: validateAddressField("zipCode", addressDraft.zipCode),
        };

        setAddressTouched({
            country: true,
            provinceOrState: true,
            cityOrMunicipality: true,
            barangay: true,
            streetAddress: true,
            zipCode: true,
        });
        setAddressErrors(nextErrors);

        if (Object.values(nextErrors).some(Boolean)) {
            showNotification("Please fix highlighted address fields.", "error");
            return;
        }

        setAddressValues(addressDraft);
        setIsEditingAddress(false);

        showNotification("Address information updated locally. Connect API to persist changes.", "success");
    };

    const openPersonalEditorFromOverview = () => {
        if (!isEditingPersonal) {
            beginEditPersonal();
        }

        const target = document.getElementById(personalSectionId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <Box className="profile-page">
            <Box className="profile-page__header">
                <Breadcrumbs separator="/" aria-label="Portal breadcrumb" className="profile-breadcrumb">
                    <Typography component="span" sx={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                        Portal
                    </Typography>
                    <Typography component="span" sx={{ color: "var(--color-text-primary)", fontSize: "0.85rem", fontWeight: 700 }}>
                        My Profile
                    </Typography>
                </Breadcrumbs>

                <Typography className="profile-page__title">My Profile</Typography>
                <Typography className="profile-page__subtitle">
                    Manage your personal information and account details.
                </Typography>
            </Box>

            <ProfileOverview profile={overview} onEditProfile={openPersonalEditorFromOverview} />

            <Box className="profile-layout" id={personalSectionId}>
                <PersonalInformation
                    isEditing={isEditingPersonal}
                    values={personalDraft}
                    touched={personalTouched}
                    errors={personalErrors}
                    onEdit={beginEditPersonal}
                    onCancel={cancelEditPersonal}
                    onSave={savePersonalChanges}
                    onChange={handlePersonalChange}
                    onBlur={handlePersonalBlur}
                />

                <AddressInformation
                    isEditing={isEditingAddress}
                    values={addressDraft}
                    touched={addressTouched}
                    errors={addressErrors}
                    onEdit={beginEditAddress}
                    onCancel={cancelEditAddress}
                    onSave={saveAddressChanges}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                />

                <AccountInformation account={accountValues} />
            </Box>

            <Snackbar
                open={notification.open}
                autoHideDuration={3200}
                onClose={closeNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={closeNotification} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;
