
export type PricingPlanId = "pro" | "premium" | "enterprise";

export interface PricingPlan {
    id: PricingPlanId;
    name: string;
    description: string;
    price: string;
    billing: string;
    features: string[];
    highlighted?: boolean;
    cta: string;
}

export const pricingPlans: PricingPlan[] = [
    {
        id: "pro",
        name: "Pro",
        description: "Everything you need to start growing your network and earning more points.",
        price: "₱199",
        billing: "/ month",
        cta: "Get Started",
        features: [
            "Recruit partners and earn more points",
            "Access to Content Hub",
            "Manage 1 business",
            "Basic CRM access",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        description: "Powerful tools to manage your business, team, customers, and growth.",
        price: "₱499",
        billing: "/ month",
        cta: "Upgrade to Premium",
        highlighted: true,
        features: [
            "Everything in Pro",
            "Manage up to 3 businesses",
            "Team management",
            "Create and manage appointments",
            "Create and manage events",
            "Full CRM access",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "Flexible solutions and personalized capabilities for growing organizations.",
        price: "Custom",
        billing: "Let's talk about your needs",
        cta: "Contact Sales",
        features: [
            "Everything in Premium",
            "Full CRM access",
            "Custom feature requests",
            "Tailored solutions for your business",
            "Flexible business requirements",
            "Customer Support and dedicated account management",
        ],
    },
];
