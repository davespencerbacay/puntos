import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export interface ThemeSemanticColors {
    "--color-primary": string;
    "--color-primary-hover": string;
    "--color-secondary": string;
    "--color-accent": string;
    "--color-background": string;
    "--color-surface": string;
    "--color-surface-hover": string;
    "--color-text-primary": string;
    "--color-text-secondary": string;
    "--color-text-muted": string;
    "--color-border": string;
    "--color-input-background": string;
    "--color-error": string;
    "--color-success": string;
    "--color-warning": string;
}

export const puntosColorModes: Record<PaletteMode, ThemeSemanticColors> = {
    light: {
        "--color-primary": "#6818e8",
        "--color-primary-hover": "#5510c7",
        "--color-secondary": "#17102f",
        "--color-accent": "#ffda00",
        "--color-background": "#f8f6fc",
        "--color-surface": "#ffffff",
        "--color-surface-hover": "#f5f0ff",
        "--color-text-primary": "#17102f",
        "--color-text-secondary": "#47405e",
        "--color-text-muted": "#89849b",
        "--color-border": "#ddd5ee",
        "--color-input-background": "#ffffff",
        "--color-error": "#d14343",
        "--color-success": "#177d47",
        "--color-warning": "#b77a00",
    },
    dark: {
        "--color-primary": "#8c5cff",
        "--color-primary-hover": "#7a42ff",
        "--color-secondary": "#e5dfff",
        "--color-accent": "#ffd94d",
        "--color-background": "#0f1020",
        "--color-surface": "#17192b",
        "--color-surface-hover": "#20243b",
        "--color-text-primary": "#f3f0ff",
        "--color-text-secondary": "#cbc5df",
        "--color-text-muted": "#9e99b7",
        "--color-border": "#2b2f49",
        "--color-input-background": "#131628",
        "--color-error": "#ff6b74",
        "--color-success": "#49d089",
        "--color-warning": "#f4bb4b",
    },
};

export const applyThemeCssVariables = (mode: PaletteMode) => {
    const tokens = puntosColorModes[mode];

    document.documentElement.setAttribute("data-theme", mode);

    Object.entries(tokens).forEach(([token, value]) => {
        document.documentElement.style.setProperty(token, value);
    });
};

export const createPuntosTheme = (mode: PaletteMode) => {
    const tokens = puntosColorModes[mode];

    return createTheme({
        palette: {
            mode,
            primary: {
                main: tokens["--color-primary"],
            },
            secondary: {
                main: tokens["--color-secondary"],
            },
            background: {
                default: tokens["--color-background"],
                paper: tokens["--color-surface"],
            },
            text: {
                primary: tokens["--color-text-primary"],
                secondary: tokens["--color-text-secondary"],
            },
            error: {
                main: tokens["--color-error"],
            },
            success: {
                main: tokens["--color-success"],
            },
            warning: {
                main: tokens["--color-warning"],
            },
        },
        typography: {
            fontFamily: '"Gilroy", Arial, sans-serif',
        },
        shape: {
            borderRadius: 12,
        },
    });
};
