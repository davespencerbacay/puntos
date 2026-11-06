import { Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import PuntosButton from "components/button/PuntosButton";
import type { RecentTransaction } from "pages/portal/dashboard/models/dashboard";

import "../Dashboard.scss";

interface RecentTransactionsProps {
    transactions: RecentTransaction[];
    onViewAll: () => void;
}

const statusColor = (status: RecentTransaction["status"]) => {
    if (status === "Completed") return "var(--color-success)";
    if (status === "Pending") return "var(--color-warning)";
    return "var(--color-error)";
};

const RecentTransactions = ({ transactions, onViewAll }: RecentTransactionsProps) => {
    return (
        <Box className="dashboard-card dashboard-transactions">
            <Box className="dashboard-transactions__header">
                <Box>
                    <Typography className="dashboard-section__title">Recent Transactions</Typography>
                    <Typography className="dashboard-section__subtitle">
                        Latest earning, redemption, and referral activities.
                    </Typography>
                </Box>

                <PuntosButton variant="outlined" colorType="white" onClick={onViewAll}>
                    View All Transactions
                </PuntosButton>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Transaction Type</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Points</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id} hover>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        color: transaction.points < 0 ? "var(--color-error)" : "var(--color-success)",
                                        fontWeight: 700,
                                    }}
                                >
                                    {transaction.points > 0 ? `+${transaction.points}` : transaction.points}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={transaction.status}
                                        size="small"
                                        sx={{
                                            borderRadius: 999,
                                            border: "1px solid var(--color-border)",
                                            color: statusColor(transaction.status),
                                            backgroundColor: "var(--color-surface-hover)",
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RecentTransactions;
