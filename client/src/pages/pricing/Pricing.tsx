import React from "react";
import {
    ArrowForwardRounded,
    AutoAwesomeRounded,
    BusinessRounded,
    CheckCircleRounded,
    SupportAgentRounded,
    WorkspacePremiumRounded,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Container,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./Pricing.scss";

interface PricingPlan {
    id: "pro" | "premium" | "enterprise";
    name: string;
    description: string;
    price: string;
    billingPeriod: string;
    buttonLabel: string;
    highlighted?: boolean;
    features: string[];
}

const pricingPlans: PricingPlan[] = [
    {
        id: "pro",
        name: "Pro",
        description:
            "Everything you need to start building customer loyalty and growing your business.",
        price: "₱199",
        billingPeriod: "/ month",
        buttonLabel: "Get Started",
        features: [
            "Recruit partners to earn more points",
            "Access to Content Hub",
            "Manage 1 business",
            "Basic CRM access",
        ],
    },
    {
        id: "premium",
        name: "Premium",
        description:
            "Advanced tools to manage your team, engage customers, and grow your business.",
        price: "₱499",
        billingPeriod: "/ month",
        buttonLabel: "Get Premium",
        highlighted: true,
        features: [
            "Everything included in Pro",
            "Manage up to 3 businesses",
            "Team management",
            "Create appointments",
            "Create events",
            "Full CRM access",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description:
            "A tailored loyalty solution designed around your business requirements.",
        price: "Custom",
        billingPeriod: "pricing",
        buttonLabel: "Contact Us",
        features: [
            "Everything included in Premium",
            "Full CRM access",
            "Custom feature requests",
            "Tailored business solutions",
            "Dedicated assistance",
        ],
    },
];

const planIcons = {
    pro: AutoAwesomeRounded,
    premium: WorkspacePremiumRounded,
    enterprise: BusinessRounded,
};

const Pricing: React.FC = () => {
    const navigate = useNavigate();

    const handlePlanSelection = (plan: PricingPlan) => {
        if (plan.id === "enterprise") {
            navigate("/portal/contacts");
            return;
        }

        navigate(`/portal/checkout?plan=${plan.id}`);
    };

    return (
        <Box className="pricing-page">
            {/* Header */}
            <Box className="pricing-header">
                <Chip
                    label="Plans designed for your growth"
                    className="pricing-header__chip"
                />

                <Typography
                    component="h1"
                    className="pricing-header__title"
                >
                    Choose the right plan
                    <Box
                        component="span"
                        className="pricing-header__highlight"
                    >
                        {" "}for your business
                    </Box>
                </Typography>

                <Typography className="pricing-header__description">
                    Start building customer loyalty, rewarding your
                    customers, and growing your business with Puntos.
                    Choose a plan that works for you.
                </Typography>
            </Box>
            <Container maxWidth="lg">
                {/* Pricing Plans */}
                <Box className="pricing-plans">
                    {pricingPlans.map((plan) => {
                        const PlanIcon = planIcons[plan.id];

                        return (
                            <Box
                                key={plan.id}
                                className={[
                                    "pricing-plans__item",
                                    plan.highlighted
                                        ? "pricing-plans__item--highlighted"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <Box className="pricing-card">
                                    {plan.highlighted && (
                                        <Chip
                                            label="Most Popular"
                                            className="pricing-card__popular"
                                        />
                                    )}

                                    {/* Plan Header */}
                                    <Box className="pricing-card__header">
                                        <Box className="pricing-card__icon">
                                            <PlanIcon />
                                        </Box>

                                        <Typography
                                            component="h2"
                                            className="pricing-card__name"
                                        >
                                            {plan.name}
                                        </Typography>

                                        <Typography className="pricing-card__description">
                                            {plan.description}
                                        </Typography>
                                    </Box>

                                    {/* Price */}
                                    <Box className="pricing-card__price">
                                        <Typography
                                            component="span"
                                            className="pricing-card__amount"
                                        >
                                            {plan.price}
                                        </Typography>

                                        <Typography
                                            component="span"
                                            className="pricing-card__period"
                                        >
                                            {plan.billingPeriod}
                                        </Typography>
                                    </Box>

                                    {/* CTA */}
                                    <Button
                                        fullWidth
                                        variant={
                                            plan.highlighted
                                                ? "contained"
                                                : "outlined"
                                        }
                                        endIcon={<ArrowForwardRounded />}
                                        className={[
                                            "pricing-card__button",
                                            plan.highlighted
                                                ? "pricing-card__button--primary"
                                                : "",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        onClick={() =>
                                            handlePlanSelection(plan)
                                        }
                                    >
                                        {plan.buttonLabel}
                                    </Button>

                                    {/* Features */}
                                    <Box className="pricing-card__features">
                                        <Typography className="pricing-card__features-title">
                                            What's included
                                        </Typography>

                                        {plan.features.map(
                                            (feature) => {

                                                return (
                                                    <Box
                                                        key={feature}
                                                        className="pricing-card__feature"
                                                    >
                                                        <CheckCircleRounded className="pricing-card__check-icon" />

                                                        <Typography className="pricing-card__feature-text">
                                                            {feature}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                {/* Bottom CTA */}
                <Box className="pricing-footer">
                    <Box className="pricing-footer__content">
                        <Box className="pricing-footer__icon">
                            <SupportAgentRounded />
                        </Box>

                        <Box className="pricing-footer__text">
                            <Typography className="pricing-footer__title">
                                Need something more customized?
                            </Typography>

                            <Typography className="pricing-footer__description">
                                Let's discuss how Puntos can support your
                                business requirements.
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardRounded />}
                            className="pricing-footer__button"
                            onClick={() => navigate("/portal/contacts")}
                        >
                            Talk to our team
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Pricing;