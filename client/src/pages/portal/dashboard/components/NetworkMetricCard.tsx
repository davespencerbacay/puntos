import { Box, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import type { ReactNode } from "react";

import type { NetworkMetric } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface NetworkMetricCardProps {
    metric: NetworkMetric;
    clickable?: boolean;
    onClick?: () => void;
}

const iconMap: Record<NetworkMetric["key"], ReactNode> = {
    businesses: <BusinessRoundedIcon />,
    partners: <GroupRoundedIcon />,
    customers: <PeopleRoundedIcon />,
    successfulReferrals: <VerifiedRoundedIcon />,
};

const NetworkMetricCard = ({ metric, clickable, onClick }: NetworkMetricCardProps) => {
    const growth = metric.growth;

    return (
        <Box
            className={`dashboard-card dashboard-metric ${clickable ? "dashboard-metric--clickable" : ""}`}
            onClick={clickable ? onClick : undefined}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={(event) => {
                if (clickable && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    onClick?.();
                }
            }}
            aria-label={clickable ? `Open ${metric.label}` : undefined}
        >
            <Box className="dashboard-metric__header">
                <Box className="dashboard-metric__icon">{iconMap[metric.key]}</Box>
                {growth && (
                    <Box className={`dashboard-metric__growth dashboard-metric__growth--${growth.trend}`}>
                        {growth.trend === "up" ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
                        <Typography component="span">
                            {growth.value}{growth.unit} {growth.label}
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography className="dashboard-metric__value">{metric.total.toLocaleString()}</Typography>
            <Typography className="dashboard-metric__label">{metric.label}</Typography>
            <Typography className="dashboard-metric__description">{metric.description}</Typography>
        </Box>
    );
};

export default NetworkMetricCard;
