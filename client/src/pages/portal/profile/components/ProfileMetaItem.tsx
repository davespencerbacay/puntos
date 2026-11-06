import { Box, Typography } from "@mui/material";

interface ProfileMetaItemProps {
    label: string;
    value: string | number;
}

const ProfileMetaItem = ({ label, value }: ProfileMetaItemProps) => {
    return (
        <Box component="div" className="profile-overview__meta-item">
            <Typography
                component="dt"
                className="profile-overview__meta-label"
            >
                {label}
            </Typography>

            <Typography
                component="dd"
                className="profile-overview__meta-value"
            >
                {value || "—"}
            </Typography>
        </Box>
    );
};

export default ProfileMetaItem;