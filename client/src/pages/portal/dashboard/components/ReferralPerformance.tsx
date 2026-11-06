import { Box, LinearProgress, Typography } from "@mui/material";

import type { ReferralPerformanceData } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface ReferralPerformanceProps {
    data: ReferralPerformanceData;
}

const ReferralPerformance = ({ data }: ReferralPerformanceProps) => {
    const conversion = data.conversionRate ?? 0;

    return (
        <Box className="dashboard-card dashboard-referrals">
            <Typography className="dashboard-section__title">Referral Performance</Typography>
            <Typography className="dashboard-section__subtitle">
                Understand referral quality and completion status.
            </Typography>

            <Box className="dashboard-referrals__grid">
                <Box className="dashboard-referrals__item">
                    <Typography className="dashboard-referrals__label">Total Referrals</Typography>
                    <Typography className="dashboard-referrals__value">{data.totalReferrals.toLocaleString()}</Typography>
                </Box>
                <Box className="dashboard-referrals__item">
                    <Typography className="dashboard-referrals__label">Successful Referrals</Typography>
                    <Typography className="dashboard-referrals__value">{data.successfulReferrals.toLocaleString()}</Typography>
                </Box>
                <Box className="dashboard-referrals__item">
                    <Typography className="dashboard-referrals__label">Pending Referrals</Typography>
                    <Typography className="dashboard-referrals__value">{data.pendingReferrals.toLocaleString()}</Typography>
                </Box>
                <Box className="dashboard-referrals__item">
                    <Typography className="dashboard-referrals__label">Active Businesses</Typography>
                    <Typography className="dashboard-referrals__value">{data.activeBusinesses.toLocaleString()}</Typography>
                </Box>
            </Box>

            <Box className="dashboard-referrals__conversion">
                <Box className="dashboard-referrals__conversion-head">
                    <Typography className="dashboard-referrals__label">Conversion Rate</Typography>
                    <Typography className="dashboard-referrals__value">{data.conversionRate !== null ? `${conversion}%` : "N/A"}</Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={data.conversionRate !== null ? conversion : 0}
                    sx={{
                        height: 8,
                        borderRadius: 99,
                        backgroundColor: "var(--color-surface-hover)",
                        "& .MuiLinearProgress-bar": {
                            backgroundColor: "var(--color-primary)",
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default ReferralPerformance;
