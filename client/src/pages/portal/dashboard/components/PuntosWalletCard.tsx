import { Box, Typography } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import PuntosButton from "components/button/PuntosButton";
import type { WalletOverview } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface PuntosWalletCardProps {
    wallet: WalletOverview;
    onViewWallet: () => void;
}

const formatPoints = (value: number) => new Intl.NumberFormat().format(value);

const PuntosWalletCard = ({ wallet, onViewWallet }: PuntosWalletCardProps) => {
    return (
        <Box className="dashboard-wallet">
            <Box className="dashboard-wallet__highlight">
                <Box className="dashboard-wallet__label-row">
                    <AccountBalanceWalletRoundedIcon />
                    <Typography className="dashboard-wallet__label">Current Puntos Balance</Typography>
                </Box>
                <Typography className="dashboard-wallet__balance">{formatPoints(wallet.currentBalance)}</Typography>
                <Typography className="dashboard-wallet__caption">Available for rewards and redemption</Typography>
            </Box>

            <Box className="dashboard-wallet__stats">
                <Box className="dashboard-wallet__stat">
                    <Typography className="dashboard-wallet__stat-label">Lifetime Earned</Typography>
                    <Typography className="dashboard-wallet__stat-value">{formatPoints(wallet.lifetimeEarned)}</Typography>
                </Box>
                <Box className="dashboard-wallet__stat">
                    <Typography className="dashboard-wallet__stat-label">Total Redeemed</Typography>
                    <Typography className="dashboard-wallet__stat-value">{formatPoints(wallet.totalRedeemed)}</Typography>
                </Box>
                <Box className="dashboard-wallet__stat">
                    <Typography className="dashboard-wallet__stat-label">Pending Points</Typography>
                    <Typography className="dashboard-wallet__stat-value">{formatPoints(wallet.pendingPoints)}</Typography>
                </Box>
            </Box>

            <Box className="dashboard-wallet__action">
                <PuntosButton variant="outlined" colorType="white" onClick={onViewWallet}>
                    View Wallet
                </PuntosButton>
            </Box>
        </Box>
    );
};

export default PuntosWalletCard;
