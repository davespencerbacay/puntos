import type { DashboardData, DashboardPeriod } from "pages/portal/dashboard/models/dashboard";
import { dashboardMockData } from "pages/portal/dashboard/models/dashboard";

const periodMultiplier: Record<DashboardPeriod, number> = {
    "7d": 0.3,
    "30d": 0.55,
    "6m": 1,
    "1y": 1.6,
};

export const getDashboardData = async (period: DashboardPeriod): Promise<DashboardData> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const multiplier = periodMultiplier[period];

    return {
        ...dashboardMockData,
        analytics: dashboardMockData.analytics.map((item) => ({
            ...item,
            earned: Math.round(item.earned * multiplier),
            redeemed: Math.round(item.redeemed * multiplier),
        })),
    };
};
