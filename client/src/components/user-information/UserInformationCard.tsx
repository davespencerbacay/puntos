
import { useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

export interface UserInformation {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

interface UserInformationCardProps {
    user: UserInformation;
    title?: string;
    subtitle?: string;
    showClipboard?: boolean;
}

const UserInformationCard = ({
    user,
    title = "Your account",
    subtitle = "Your information is linked to this registration.",
    showClipboard,
}: UserInformationCardProps) => {
    const [copied, setCopied] = useState(false);

    const fullName = `${user.firstName} ${user.lastName}`.trim();

    const initials =
        `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
            .toUpperCase() || "U";

    const handleCopyId = async () => {
        if (!user.id) return;

        try {
            await navigator.clipboard.writeText(user.id);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                borderRadius: 3,
                backgroundColor: "var(--color-surface)",
                transition: "border-color 0.2s ease",

                "&:hover": {
                    borderColor: "var(--color-primary)",
                    cursor: "pointer",
                },
            }}
        >
            {/* Accent */}
            <Box
                sx={{
                    height: "4px",
                    background:
                        "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                }}
            />

            <Stack spacing={2.5} sx={{ p: { xs: 2.5, sm: 3 } }}>
                {/* Header */}
                <Stack sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            backgroundColor: "var(--color-surface-hover)",
                            color: "var(--color-primary)",
                        }}
                    >
                        <PersonOutlineRoundedIcon />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                                lineHeight: 1.3,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{ color: "var(--color-text-muted)" }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>
                </Stack>

                {/* Profile */}
                <Stack sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 1.5,
                }}
                >
                    <Avatar
                        src={user.avatar || undefined}
                        alt={fullName || "User"}
                        sx={{
                            width: 64,
                            height: 64,
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: "#ffffff",
                            backgroundColor: "var(--color-primary)",
                            border: "3px solid var(--color-surface-hover)",
                            boxShadow: "0 0 0 1px var(--color-border)",
                        }}
                    >
                        {initials}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "var(--color-text-primary)",
                                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                                overflowWrap: "anywhere",
                            }}
                        >
                            {fullName || "Unknown User"}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "var(--color-text-secondary)",
                                mt: 0.25,
                            }}
                        >
                            Registered User
                        </Typography>
                    </Box>
                </Stack>

                {/* User ID */}
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "var(--color-surface-hover)",
                        border: "1px solid var(--color-border)",
                    }}
                >
                    <Stack
                        sx={{
                            direction: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            spacing: 1,
                        }}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    fontWeight: 600,
                                    color: "var(--color-text-muted)",
                                    mb: 0.5,
                                }}
                            >
                                USER ID
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 700,
                                    color: "var(--color-text-primary)",
                                    fontFamily: "monospace",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {user.id || "Not available"}
                            </Typography>
                        </Box>

                        {user.id && showClipboard && (
                            <Tooltip title={copied ? "Copied!" : "Copy user ID"}>
                                <IconButton
                                    size="small"
                                    onClick={handleCopyId}
                                    aria-label="Copy user ID"
                                    sx={{
                                        color: copied
                                            ? "var(--color-success)"
                                            : "var(--color-primary)",
                                        backgroundColor: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 1.5,
                                        flexShrink: 0,
                                        "&:hover": {
                                            backgroundColor: "var(--color-background)",
                                        },
                                    }}
                                >
                                    {copied ? (
                                        <CheckRoundedIcon fontSize="small" />
                                    ) : (
                                        <ContentCopyRoundedIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Box>
            </Stack >
        </Box >
    );
};

export default UserInformationCard;
