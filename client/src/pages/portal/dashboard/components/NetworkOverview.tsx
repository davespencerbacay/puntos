import { Box, Typography } from "@mui/material";

import type { NetworkMetric } from "pages/portal/dashboard/models/dashboard";
import NetworkMetricCard from "pages/portal/dashboard/components/NetworkMetricCard";

import "../Dashboard.scss";

interface NetworkOverviewProps {
    metrics: NetworkMetric[];
    onOpenMetric: (metric: NetworkMetric) => void;
}

const NetworkOverview = ({ metrics, onOpenMetric }: NetworkOverviewProps) => {
    return (
        <Box className="dashboard-section">
            <Typography className="dashboard-section__title">Network Overview</Typography>
            <Typography className="dashboard-section__subtitle">
                Track recruited network growth and referral outcomes.
            </Typography>

            <Box className="dashboard-metrics-grid">
                {metrics.map((metric) => (
                    <NetworkMetricCard
                        key={metric.key}
                        metric={metric}
                        clickable={Boolean(metric.route)}
                        onClick={() => onOpenMetric(metric)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default NetworkOverview;
