import { Box, Typography } from "@mui/material";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";
import type { ReactNode } from "react";

import PuntosButton from "components/button/PuntosButton";
import type { DashboardQuickAction } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface QuickActionsProps {
    actions: DashboardQuickAction[];
    onRunAction: (action: DashboardQuickAction) => void;
}

const iconMap: Record<string, ReactNode> = {
    "qa-1": <StorefrontRoundedIcon />,
    "qa-2": <GroupAddRoundedIcon />,
    "qa-3": <PersonAddAltRoundedIcon />,
    "qa-4": <RedeemRoundedIcon />,
};

const QuickActions = ({ actions, onRunAction }: QuickActionsProps) => {
    return (
        <Box className="dashboard-card dashboard-actions">
            <Typography className="dashboard-section__title">Quick Actions</Typography>
            <Typography className="dashboard-section__subtitle">
                Access common referral and rewards workflows.
            </Typography>

            <Box className="dashboard-actions__grid">
                {actions.map((action) => (
                    <Box className="dashboard-actions__item" key={action.id}>
                        <Box className="dashboard-actions__item-icon">{iconMap[action.id]}</Box>
                        <Typography className="dashboard-actions__item-title">{action.title}</Typography>
                        <Typography className="dashboard-actions__item-description">{action.description}</Typography>

                        <PuntosButton variant="outlined" colorType="white" onClick={() => onRunAction(action)}>
                            Open
                        </PuntosButton>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default QuickActions;
