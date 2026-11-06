import { Avatar, Box, Typography } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import type { ProfileOverviewData } from "models/profile";

import "../Profile.scss";
import PuntosButton from "components/button/PuntosButton";

interface ProfileOverviewProps {
    profile: ProfileOverviewData;
    onEditProfile: () => void;
}
const ProfileOverview = ({ profile, onEditProfile }: ProfileOverviewProps) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    return (
        <Box className="profile-card profile-overview">
            <Box className="profile-overview__top">
                <Box className="profile-overview__identity">
                    <Avatar
                        src={profile.avatarUrl}
                        alt={fullName}
                        sx={{
                            width: { xs: 72, sm: 86 },
                            height: { xs: 72, sm: 86 },
                            border: "2px solid var(--color-border)",
                        }}
                    />

                    <Box>
                        <Typography variant="h5" sx={{ color: "var(--color-text-primary)", fontWeight: 700 }}>
                            {fullName}
                        </Typography>
                        <Typography sx={{ color: "var(--color-text-secondary)", mt: 0.5 }}>
                            {profile.emailAddress}
                        </Typography>
                    </Box>
                </Box>
                <PuntosButton
                    variant="contained"
                    startIcon={<EditRoundedIcon />}
                    onClick={onEditProfile}
                    colorType="violet"
                >
                    Edit Profile
                </PuntosButton>
            </Box>
        </Box>
    );
};

export default ProfileOverview;
