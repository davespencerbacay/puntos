export type DashboardPeriod = "7d" | "30d" | "6m" | "1y";

export interface WalletOverview {
    currentBalance: number;
    lifetimeEarned: number;
    totalRedeemed: number;
    pendingPoints: number;
}

export interface GrowthMetric {
    value: number;
    unit: "%" | "count";
    trend: "up" | "down" | "neutral";
    label: string;
}

export interface NetworkMetric {
    key: "businesses" | "partners" | "customers" | "successfulReferrals";
    label: string;
    total: number;
    description: string;
    growth?: GrowthMetric;
    route?: string;
}

export interface PointsActivityItem {
    month: string;
    earned: number;
    redeemed: number;
}

export interface ReferralPerformanceData {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    activeBusinesses: number;
    conversionRate: number | null;
}

export interface RecentTransaction {
    id: string;
    description: string;
    type: "Earned" | "Redeemed" | "Bonus";
    date: string;
    points: number;
    status: "Completed" | "Pending" | "Failed";
}

export interface RewardMilestone {
    id: string;
    title: string;
    current: number;
    target: number;
    category: "Reward" | "Achievement";
}

export interface DashboardQuickAction {
    id: string;
    title: string;
    description: string;
    route?: string;
}

export interface DashboardData {
    firstName: string;
    greetingMessage: string;
    wallet: WalletOverview;
    networkMetrics: NetworkMetric[];
    analytics: PointsActivityItem[];
    referralPerformance: ReferralPerformanceData;
    recentTransactions: RecentTransaction[];
    rewards: RewardMilestone[];
    quickActions: DashboardQuickAction[];
}

export const dashboardMockData: DashboardData = {
    firstName: "Dave",
    greetingMessage: "Here's an overview of your Puntos activity and network performance.",
    wallet: {
        currentBalance: 12450,
        lifetimeEarned: 28760,
        totalRedeemed: 15230,
        pendingPoints: 980,
    },
    networkMetrics: [
        {
            key: "businesses",
            label: "Recruited Businesses",
            total: 28,
            description: "Active business accounts in your network",
            growth: { value: 12, unit: "%", trend: "up", label: "vs last month" },
        },
        {
            key: "partners",
            label: "Recruited Partners",
            total: 43,
            description: "Partners invited through your referrals",
            growth: { value: 5, unit: "%", trend: "up", label: "vs last month" },
        },
        {
            key: "customers",
            label: "Recruited Customers",
            total: 196,
            description: "Customers added by your network",
            growth: { value: 17, unit: "%", trend: "up", label: "vs last month" },
        },
        {
            key: "successfulReferrals",
            label: "Total Successful Referrals",
            total: 112,
            description: "Qualified referrals accepted by Puntos",
            growth: { value: 8, unit: "count", trend: "up", label: "from last month" },
        },
    ],
    analytics: [
        { month: "Jan", earned: 2400, redeemed: 1300 },
        { month: "Feb", earned: 2900, redeemed: 1500 },
        { month: "Mar", earned: 2600, redeemed: 1400 },
        { month: "Apr", earned: 3200, redeemed: 1900 },
        { month: "May", earned: 3600, redeemed: 1800 },
        { month: "Jun", earned: 4100, redeemed: 2200 },
    ],
    referralPerformance: {
        totalReferrals: 145,
        successfulReferrals: 112,
        pendingReferrals: 21,
        activeBusinesses: 28,
        conversionRate: 77,
    },
    recentTransactions: [
        {
            id: "TXN-001245",
            description: "Business referral reward",
            type: "Earned",
            date: "Nov 04, 2026",
            points: 650,
            status: "Completed",
        },
        {
            id: "TXN-001246",
            description: "Partner invitation reward",
            type: "Earned",
            date: "Nov 03, 2026",
            points: 300,
            status: "Completed",
        },
        {
            id: "TXN-001247",
            description: "Points redemption",
            type: "Redeemed",
            date: "Nov 02, 2026",
            points: -1200,
            status: "Completed",
        },
        {
            id: "TXN-001248",
            description: "Promotional bonus",
            type: "Bonus",
            date: "Nov 01, 2026",
            points: 450,
            status: "Pending",
        },
    ],
    rewards: [
        {
            id: "rw-1",
            title: "Quarterly Rewards Tier",
            current: 12450,
            target: 20000,
            category: "Reward",
        },
        {
            id: "rw-2",
            title: "Referral Milestone: 150 successful referrals",
            current: 112,
            target: 150,
            category: "Achievement",
        },
        {
            id: "rw-3",
            title: "Partner Growth Milestone",
            current: 43,
            target: 60,
            category: "Achievement",
        },
    ],
    quickActions: [
        {
            id: "qa-1",
            title: "Refer a Business",
            description: "Share your referral link with a business owner.",
        },
        {
            id: "qa-2",
            title: "Invite a Partner",
            description: "Bring in a new partner to expand your network.",
        },
        {
            id: "qa-3",
            title: "Invite a Customer",
            description: "Invite loyal customers into your points ecosystem.",
        },
        {
            id: "qa-4",
            title: "Redeem Points",
            description: "Use available points for rewards and benefits.",
        },
    ],
};
