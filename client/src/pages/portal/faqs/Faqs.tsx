
import { useMemo, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

import PuntosButton from "components/button/PuntosButton";
import PuntosBreadcrumb from "components/breadcrumbs/Breadcrumbs";


import "./Faqs.scss";
import type { FAQCategory, FAQItem } from "models/faq";

const faqCategories: FAQCategory[] = [
    { id: "all", label: "All Topics", icon: "HelpCircle" },
    { id: "getting-started", label: "Getting Started", icon: "Rocket" },
    { id: "points", label: "Wallet & Points", icon: "Wallet" },
    { id: "referrals", label: "Referrals", icon: "Users" },
    { id: "businesses", label: "Businesses & Partners", icon: "Store" },
    { id: "rewards", label: "Rewards", icon: "Gift" },
    { id: "account", label: "Account & Support", icon: "UserRound" },
];

const faqData: FAQItem[] = [
    // Move your existing FAQ objects here without changing their content.
];

const categoryIcons: Record<string, React.ReactNode> = {
    all: <HelpOutlineRoundedIcon />,
    "getting-started": <RocketLaunchRoundedIcon />,
    points: <AccountBalanceWalletRoundedIcon />,
    referrals: <PeopleAltRoundedIcon />,
    businesses: <StorefrontRoundedIcon />,
    rewards: <CardGiftcardRoundedIcon />,
    account: <SupportAgentRoundedIcon />,
};

const FAQs = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);

    const filteredFAQs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return faqData.filter((faq: FAQItem) => {
            const matchesCategory =
                activeCategory === "all" ||
                faq.category === activeCategory;

            const searchableContent = [
                faq.question,
                faq.answer,
                ...(faq.keywords || []),
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !query || searchableContent.includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const popularFAQs = faqData.filter((faq) => faq.popular);

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId);
        setExpandedFAQ(false);
    };

    const handleSearchChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(event.target.value);
        setExpandedFAQ(false);
    };

    const handleAccordionChange =
        (faqId: string) =>
            (_event: React.SyntheticEvent, isExpanded: boolean) => {
                setExpandedFAQ(isExpanded ? faqId : false);
            };

    const handleClearSearch = () => {
        setSearchQuery("");
        setExpandedFAQ(false);
    };

    const isFiltering = searchQuery.trim().length > 0 ||
        activeCategory !== "all";

    return (
        <Box className="faqs-page">
            {/* Page Header */}
            <Box className="faqs-page__header">
                <PuntosBreadcrumb
                    items={[{ label: "FAQs" }]}
                />

                <Box className="faqs-page__heading">
                    <Box className="faqs-page__heading-content">
                        <Typography className="faqs-page__eyebrow">
                            HELP CENTER
                        </Typography>

                        <Typography className="faqs-page__title">
                            Frequently Asked Questions
                        </Typography>

                        <Typography className="faqs-page__subtitle">
                            Everything you need to know about your Puntos
                            account, points, referrals, and rewards.
                        </Typography>
                    </Box>

                    <Box className="faqs-page__heading-icon">
                        <QuestionAnswerRoundedIcon />
                    </Box>
                </Box>
            </Box>

            {/* Search */}
            <Box className="faqs-search">
                <TextField
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search questions, topics, or keywords..."
                    className="faqs-search__input"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchQuery && (
                                <InputAdornment position="end">
                                    <Box
                                        className="faqs-search__clear"
                                        onClick={handleClearSearch}
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Clear search"
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                handleClearSearch();
                                            }
                                        }}
                                    >
                                        <ClearRoundedIcon />
                                    </Box>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Typography className="faqs-search__hint">
                    Search our help articles to find what you're looking for.
                </Typography>
            </Box>

            {/* Main Content */}
            <Box className="faqs-layout">
                {/* Categories */}
                <Box className="faqs-categories">
                    <Typography className="faqs-categories__title">
                        Browse Topics
                    </Typography>

                    <Box className="faqs-categories__list">
                        {faqCategories.map((category) => (
                            <Box
                                key={category.id}
                                className={`faqs-categories__item ${activeCategory === category.id
                                    ? "faqs-categories__item--active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    handleCategoryChange(category.id)
                                }
                                role="button"
                                tabIndex={0}
                                aria-pressed={
                                    activeCategory === category.id
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        handleCategoryChange(category.id);
                                    }
                                }}
                            >
                                <Box className="faqs-categories__icon">
                                    {categoryIcons[category.id]}
                                </Box>

                                <Typography>
                                    {category.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* FAQ Questions */}
                <Box className="faqs-content">
                    <Box className="faqs-content__header">
                        <Box>
                            <Typography className="faqs-content__title">
                                {isFiltering
                                    ? "Search Results"
                                    : "How can we help you?"}
                            </Typography>

                            <Typography className="faqs-content__subtitle">
                                {filteredFAQs.length}{" "}
                                {filteredFAQs.length === 1
                                    ? "question"
                                    : "questions"}{" "}
                                found
                            </Typography>
                        </Box>

                        {isFiltering && (
                            <PuntosButton
                                colorType="white"
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setActiveCategory("all");
                                    setSearchQuery("");
                                    setExpandedFAQ(false);
                                }}
                            >
                                Clear Filters
                            </PuntosButton>
                        )}
                    </Box>

                    {filteredFAQs.length > 0 ? (
                        <Box className="faqs-accordion-list">
                            {filteredFAQs.map((faq) => (
                                <Accordion
                                    key={faq.id}
                                    expanded={expandedFAQ === faq.id}
                                    onChange={handleAccordionChange(faq.id)}
                                    className="faqs-accordion"
                                    disableGutters
                                    elevation={0}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreRoundedIcon />
                                        }
                                        className="faqs-accordion__summary"
                                        aria-controls={`${faq.id}-content`}
                                        id={`${faq.id}-header`}
                                    >
                                        <Typography className="faqs-accordion__question">
                                            {faq.question}
                                        </Typography>

                                        {faq.popular && (
                                            <Chip
                                                label="Popular"
                                                size="small"
                                                className="faqs-accordion__popular"
                                            />
                                        )}
                                    </AccordionSummary>

                                    <AccordionDetails
                                        className="faqs-accordion__details"
                                        id={`${faq.id}-content`}
                                    >
                                        <Typography>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    ) : (
                        <Box className="faqs-empty">
                            <Box className="faqs-empty__icon">
                                <SearchRoundedIcon />
                            </Box>

                            <Typography className="faqs-empty__title">
                                No questions found
                            </Typography>

                            <Typography className="faqs-empty__description">
                                We couldn't find any questions matching
                                your search. Try different keywords or
                                browse another category.
                            </Typography>

                            <PuntosButton
                                colorType="violet"
                                onClick={() => {
                                    setActiveCategory("all");
                                    setSearchQuery("");
                                }}
                            >
                                View All Questions
                            </PuntosButton>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Popular Questions */}
            {!isFiltering && (
                <Box className="faqs-popular">
                    <Box className="faqs-section-heading">
                        <Box>
                            <Typography className="faqs-section-heading__title">
                                Popular Questions
                            </Typography>

                            <Typography className="faqs-section-heading__subtitle">
                                Answers to the questions users ask most.
                            </Typography>
                        </Box>
                    </Box>

                    <Box className="faqs-popular__grid">
                        {popularFAQs.map((faq) => (
                            <Box
                                key={faq.id}
                                className="faqs-popular__card"
                                onClick={() => {
                                    setActiveCategory(faq.category);
                                    setExpandedFAQ(faq.id);

                                    document
                                        .querySelector(".faqs-layout")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <Typography>
                                    {faq.question}
                                </Typography>

                                <ArrowForwardRoundedIcon />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Contact Support */}
            <Box className="faqs-support">
                <Box className="faqs-support__icon">
                    <SupportAgentRoundedIcon />
                </Box>

                <Box className="faqs-support__content">
                    <Typography className="faqs-support__title">
                        Still need help?
                    </Typography>

                    <Typography className="faqs-support__description">
                        Can't find the answer you're looking for?
                        Our support team is here to help.
                    </Typography>
                </Box>

                <PuntosButton
                    colorType="yellow"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => {
                        // Connect this to your actual support route.
                    }}
                >
                    Contact Support
                </PuntosButton>
            </Box>
        </Box>
    );
};

export default FAQs;
