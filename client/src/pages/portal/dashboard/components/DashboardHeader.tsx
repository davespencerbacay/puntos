import { Box, Typography } from "@mui/material";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";

import Breadcrumbs from "components/breadcrumbs/Breadcrumbs";
import PuntosButton from "components/button/PuntosButton";

import "../Dashboard.scss";

interface DashboardHeaderProps {
    firstName: string;
    greetingMessage: string;
    currentDate: string;
    onInvite: () => void;
}

const DashboardHeader = ({ firstName, greetingMessage, currentDate, onInvite }: DashboardHeaderProps) => {
    return (
        <Box className="dashboard-card dashboard-header">
            <Box>
                <Breadcrumbs
                    items={[{ label: "Dashboard" }]}
                    homeHref="/portal/dashboard"
                />

                <Typography className="dashboard-header__title">
                    Good morning, {firstName}!
                </Typography>
                <Typography className="dashboard-header__subtitle">
                    {greetingMessage}
                </Typography>
                <Typography className="dashboard-header__date">{currentDate}</Typography>
            </Box>

            <PuntosButton
                colorType="violet"
                startIcon={<CampaignRoundedIcon />}
                onClick={onInvite}
            >
                Invite Members
            </PuntosButton>
        </Box>
    );
};

export default DashboardHeader;
