import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Snackbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "pages/portal/dashboard/components/DashboardHeader";
import PuntosWalletCard from "pages/portal/dashboard/components/PuntosWalletCard";
import NetworkOverview from "pages/portal/dashboard/components/NetworkOverview";
import PointsAnalytics from "pages/portal/dashboard/components/PointsAnalytics";
import ReferralPerformance from "pages/portal/dashboard/components/ReferralPerformance";
import RecentTransactions from "pages/portal/dashboard/components/RecentTransactions";
import RewardsOverview from "pages/portal/dashboard/components/RewardsOverview";
import QuickActions from "pages/portal/dashboard/components/QuickActions";

import type {
    DashboardData,
    DashboardPeriod,
    DashboardQuickAction,
    NetworkMetric,
} from "pages/portal/dashboard/models/dashboard";
import { getDashboardData } from "services/dashboardService";

import "./Dashboard.scss";

const Dashboard = () => {
    const navigate = useNavigate();

    const [period, setPeriod] = useState<DashboardPeriod>("6m");
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "info" }>({
        open: false,
        message: "",
        severity: "info",
    });

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getDashboardData(period);
                if (!mounted) return;
                setData(response);
            } catch {
                if (!mounted) return;
                setError("Unable to load dashboard data. Please try again.");
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [period]);

    const formattedDate = useMemo(
        () =>
            new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }).format(new Date()),
        []
    );

    const showInfo = (message: string, severity: "success" | "info" = "info") => {
        setNotification({ open: true, message, severity });
    };

    const closeNotification = () => {
        setNotification((previous) => ({ ...previous, open: false }));
    };

    const handleInviteMembers = () => {
        showInfo("Invite workflow will be connected once referral APIs are ready.");
    };

    const handleViewWallet = () => {
        showInfo("Wallet page is not available yet in this build.");
    };

    const handleOpenMetric = (metric: NetworkMetric) => {
        if (!metric.route) return;
        navigate(metric.route);
    };

    const handleViewAllTransactions = () => {
        showInfo("Transaction history page is not available yet in this build.");
    };

    const handleQuickAction = (action: DashboardQuickAction) => {
        if (action.route) {
            navigate(action.route);
            return;
        }

        showInfo(`${action.title} workflow is available as a placeholder in this release.`);
    };

    if (isLoading) {
        return (
            <Box className="dashboard-card dashboard-state">
                <CircularProgress sx={{ color: "var(--color-primary)" }} />
                <Typography className="dashboard-state__subtitle">Loading dashboard...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="dashboard-card dashboard-state">
                <Typography className="dashboard-state__title">Dashboard unavailable</Typography>
                <Typography className="dashboard-state__subtitle">{error}</Typography>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box className="dashboard-card dashboard-state">
                <Typography className="dashboard-state__title">No dashboard data</Typography>
                <Typography className="dashboard-state__subtitle">No activity data is available yet.</Typography>
            </Box>
        );
    }

    return (
        <Box className="dashboard-page">
            <DashboardHeader
                firstName={data.firstName}
                greetingMessage={data.greetingMessage}
                currentDate={formattedDate}
                onInvite={handleInviteMembers}
            />

            <PuntosWalletCard wallet={data.wallet} onViewWallet={handleViewWallet} />

            <NetworkOverview metrics={data.networkMetrics} onOpenMetric={handleOpenMetric} />

            <Box className="dashboard-analytics-layout">
                <PointsAnalytics period={period} onChangePeriod={setPeriod} data={data.analytics} />
                <ReferralPerformance data={data.referralPerformance} />
            </Box>

            <RecentTransactions transactions={data.recentTransactions} onViewAll={handleViewAllTransactions} />

            <RewardsOverview rewards={data.rewards} />

            <QuickActions actions={data.quickActions} onRunAction={handleQuickAction} />

            <Snackbar
                open={notification.open}
                autoHideDuration={3200}
                onClose={closeNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={closeNotification} severity={notification.severity} variant="filled" sx={{ width: "100%" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;
