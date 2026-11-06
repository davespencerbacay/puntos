import { Box, LinearProgress, Typography } from "@mui/material";

import type { RewardMilestone } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface RewardsOverviewProps {
    rewards: RewardMilestone[];
}

const RewardsOverview = ({ rewards }: RewardsOverviewProps) => {
    return (
        <Box className="dashboard-card dashboard-rewards">
            <Typography className="dashboard-section__title">Rewards & Achievements</Typography>
            <Typography className="dashboard-section__subtitle">
                Placeholder values shown for UI preview until backend reward rules are connected.
            </Typography>

            <Box className="dashboard-rewards__list">
                {rewards.map((reward) => {
                    const progress = reward.target > 0 ? Math.min((reward.current / reward.target) * 100, 100) : 0;

                    return (
                        <Box className="dashboard-rewards__item" key={reward.id}>
                            <Box className="dashboard-rewards__item-head">
                                <Typography className="dashboard-rewards__item-title">{reward.title}</Typography>
                                <Typography className="dashboard-rewards__item-value">
                                    {reward.current.toLocaleString()} / {reward.target.toLocaleString()}
                                </Typography>
                            </Box>

                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 99,
                                    backgroundColor: "var(--color-surface-hover)",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: reward.category === "Reward" ? "var(--color-accent)" : "var(--color-primary)",
                                    },
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default RewardsOverview;
