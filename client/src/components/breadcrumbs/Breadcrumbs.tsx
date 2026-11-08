import React from "react";
import {
    Box,
    Breadcrumbs as MuiBreadcrumbs,
    Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import "./Breadcrumbs.scss";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    homeHref?: string;
    homeLabel?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    homeHref = "/portal",
    homeLabel = "Portal",
}) => {
    return (
        <Box className="puntos-breadcrumb-wrapper">
            <MuiBreadcrumbs
                separator={
                    <ChevronRightRoundedIcon className="puntos-breadcrumb__separator" />
                }
                aria-label="Breadcrumb"
                className="puntos-breadcrumb"
                maxItems={5}
                itemsBeforeCollapse={2}
                itemsAfterCollapse={2}
            >
                <Box
                    component={RouterLink}
                    to={homeHref}
                    className="puntos-breadcrumb__link puntos-breadcrumb__home"
                    aria-label={homeLabel}
                >
                    <HomeRoundedIcon />
                    <span>{homeLabel}</span>
                </Box>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    if (isLast) {
                        return (
                            <Typography
                                key={`${item.label}-${index}`}
                                component="span"
                                className="puntos-breadcrumb__current"
                                aria-current="page"
                            >
                                {item.label}
                            </Typography>
                        );
                    }

                    return item.href ? (
                        <Box
                            key={`${item.label}-${index}`}
                            component={RouterLink}
                            to={item.href}
                            className="puntos-breadcrumb__link"
                        >
                            {item.label}
                        </Box>
                    ) : (
                        <Typography
                            key={`${item.label}-${index}`}
                            component="span"
                            className="puntos-breadcrumb__parent"
                        >
                            {item.label}
                        </Typography>
                    );
                })}
            </MuiBreadcrumbs>
        </Box>
    );
};

export default Breadcrumbs;