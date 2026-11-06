
import React from "react";
import {
    Box,
    Breadcrumbs as MuiBreadcrumbs,
    Link,
    Typography,
} from "@mui/material";

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
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    homeHref = "/portal",
}) => {
    return (
        <MuiBreadcrumbs
            separator={<ChevronRightRoundedIcon className="puntos-breadcrumb__separator" />}
            aria-label="Breadcrumb"
            className="puntos-breadcrumb"
        >
            <Link
                href={homeHref}
                underline="none"
                className="puntos-breadcrumb__link"
            >
                <HomeRoundedIcon className="puntos-breadcrumb__home-icon" />
                <span>Portal</span>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast) {
                    return (
                        <Box
                            key={`${item.label}-${index}`}
                            className="puntos-breadcrumb__current"
                        >
                            <Typography component="span">
                                {item.label}
                            </Typography>
                        </Box>
                    );
                }

                return (
                    <Link
                        key={`${item.label}-${index}`}
                        href={item.href || "#"}
                        underline="none"
                        className="puntos-breadcrumb__link"
                    >
                        {item.label}
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumbs;
