import { Box, Chip, Typography } from "@mui/material";

import type { AccountInformationValues, AccountStatus } from "models/profile";

import "../Profile.scss";

interface AccountInformationProps {
    account: AccountInformationValues;
}

const getStatusColor = (status: AccountStatus) => {
    if (status === "Active") return "var(--color-success)";
    if (status === "Pending") return "var(--color-warning)";
    return "var(--color-error)";
};

const AccountInformation = ({ account }: AccountInformationProps) => {
    return (
        <Box className="profile-card">
            <Box className="profile-section__header">
                <Box>
                    <Typography className="profile-section__title">Account Information</Typography>
                    <Typography className="profile-section__subtitle">
                        System-managed details are shown here as read-only.
                    </Typography>
                </Box>
            </Box>

            <Box className="profile-account-grid">
                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Member ID</Typography>
                    <Typography className="profile-account-value">{account.memberId}</Typography>
                </Box>

                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Account Role</Typography>
                    <Typography className="profile-account-value">{account.accountRole}</Typography>
                </Box>

                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Membership Type</Typography>
                    <Chip
                        label={account.membershipType}
                        size="small"
                        sx={{
                            borderRadius: 999,
                            backgroundColor: "var(--color-surface-hover)",
                            color: "var(--color-text-primary)",
                            border: "1px solid var(--color-border)",
                            fontWeight: 700,
                        }}
                    />
                </Box>

                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Account Status</Typography>
                    <Chip
                        label={account.accountStatus}
                        size="small"
                        sx={{
                            borderRadius: 999,
                            backgroundColor: "var(--color-surface-hover)",
                            color: getStatusColor(account.accountStatus),
                            border: "1px solid var(--color-border)",
                            fontWeight: 700,
                        }}
                    />
                </Box>

                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Registration Date</Typography>
                    <Typography className="profile-account-value">{account.registrationDate}</Typography>
                </Box>

                <Box className="profile-account-item">
                    <Typography className="profile-account-label">Associated Business / Organization</Typography>
                    <Typography className="profile-account-value">{account.organization}</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default AccountInformation;
