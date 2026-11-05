
import React from "react";
import {
    Button,
    CircularProgress,
    type ButtonProps,
} from "@mui/material";

export interface PuntosButtonProps extends Omit<ButtonProps, "color"> {
    colorType?: "violet" | "yellow" | "white";
    buttonColor?: string;
    hoverColor?: string;
    textColor?: string;
    borderColor?: string;
    loading?: boolean;
}

const PuntosButton: React.FC<PuntosButtonProps> = ({
    children,
    colorType = "violet",
    buttonColor,
    hoverColor,
    textColor,
    borderColor,
    loading = false,
    disabled,
    variant = "contained",
    size = "medium",
    sx,
    ...props
}) => {
    const colors = {
        violet: {
            background: "var(--color-primary)",
            hover: "var(--color-primary-hover)",
            text: "#ffffff",
            border: "var(--color-primary)",
            hoverBorder: "var(--color-primary-hover)",
        },
        yellow: {
            background: "var(--color-accent)",
            hover: "var(--color-accent-hover)",
            text: "var(--color-text-on-accent)",
            border: "var(--color-accent)",
            hoverBorder: "var(--color-accent-hover)",
        },
        white: {
            background: "#ffffff",
            hover: "#ffffff",
            text: "var(--color-text-primary)",
            border: "var(--color-border)",
            hoverBorder: "var(--color-primary)",
        },
    };

    const selected = colors[colorType];

    const background = buttonColor || selected.background;
    const hover = hoverColor || selected.hover;
    const foreground = textColor || selected.text;
    const border = borderColor || selected.border;
    const hoverBorder = borderColor || selected.hoverBorder;

    return (
        <Button
            variant={variant}
            size={size}
            disabled={disabled || loading}
            sx={{
                borderRadius: 2,
                border: "1px solid transparent",
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "none",
                transition: "all 0.2s ease",

                ...(variant === "contained" && {
                    backgroundColor: background,
                    color: foreground,
                    borderColor: colorType === "white" ? border : "transparent",
                    "&:hover": {
                        backgroundColor: hover,
                        borderColor: hoverBorder,
                        boxShadow: "none",
                    },
                }),

                ...(variant === "outlined" && {
                    backgroundColor:
                        colorType === "white" ? "#ffffff" : "transparent",
                    borderColor: border,
                    color: foreground,
                    "&:hover": {
                        backgroundColor:
                            colorType === "white"
                                ? "#ffffff"
                                : "var(--color-surface-hover)",
                        borderColor: hoverBorder,
                        boxShadow: "none",
                    },
                }),

                ...(variant === "text" && {
                    color: foreground,
                    "&:hover": {
                        backgroundColor: "var(--color-surface-hover)",
                        borderColor: hoverBorder,
                    },
                }),

                "&.Mui-disabled": {
                    opacity: 0.6,
                },

                ...sx,
            }}
            {...props}
        >
            {loading ? (
                <CircularProgress size={18} color="inherit" />
            ) : (
                children
            )}
        </Button>
    );
};

export default PuntosButton;
