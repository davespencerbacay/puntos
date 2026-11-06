import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DashboardPeriod, PointsActivityItem } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface PointsAnalyticsProps {
    period: DashboardPeriod;
    onChangePeriod: (period: DashboardPeriod) => void;
    data: PointsActivityItem[];
}

const periodOptions: Array<{ label: string; value: DashboardPeriod }> = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 6 Months", value: "6m" },
    { label: "This Year", value: "1y" },
];

const PointsAnalytics = ({ period, onChangePeriod, data }: PointsAnalyticsProps) => {
    return (
        <Box className="dashboard-card dashboard-chart">
            <Box className="dashboard-chart__header">
                <Box>
                    <Typography className="dashboard-section__title">Points Analytics</Typography>
                    <Typography className="dashboard-section__subtitle">
                        Monthly earned and redeemed points trend.
                    </Typography>
                </Box>

                <TextField
                    size="small"
                    select
                    value={period}
                    onChange={(event) => onChangePeriod(event.target.value as DashboardPeriod)}
                    sx={{ minWidth: 170 }}
                >
                    {periodOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box className="dashboard-chart__canvas">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 6, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="var(--color-text-muted)" />
                        <YAxis stroke="var(--color-text-muted)" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: 12,
                                border: "1px solid var(--color-border)",
                                background: "var(--color-surface)",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="earned"
                            stroke="var(--color-primary)"
                            strokeWidth={3}
                            dot={false}
                            name="Points Earned"
                        />
                        <Line
                            type="monotone"
                            dataKey="redeemed"
                            stroke="var(--color-accent)"
                            strokeWidth={3}
                            dot={false}
                            name="Points Redeemed"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default PointsAnalytics;
