import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Savings,
  TrendingUp,
  Add,
  MoreVert,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
// import AddAccountForm from '../forms/AddAccountForm';

const AccountsView = () => {
  const [addAccountOpen, setAddAccountOpen] = useState(false);

  const accounts = [
    {
      id: 1,
      name: 'Chase Checking',
      type: 'Checking',
      institution: 'Chase Bank',
      accountNumber: '****4321',
      balance: 8450.50,
      lastUpdated: 'Today',
      color: '#667eea',
      status: 'Active',
      transactions: 12
    },
    {
      id: 2,
      name: 'Discover Savings',
      type: 'Savings',
      institution: 'Discover Bank',
      accountNumber: '****5678',
      balance: 25430.75,
      lastUpdated: 'Yesterday',
      color: '#10b981',
      status: 'Active',
      transactions: 4
    },
    {
      id: 3,
      name: 'Fidelity Investments',
      type: 'Investment',
      institution: 'Fidelity',
      accountNumber: '****9012',
      balance: 68450.25,
      lastUpdated: '2 days ago',
      color: '#8b5cf6',
      status: 'Active',
      transactions: 8
    },
    {
      id: 4,
      name: 'Amex Platinum',
      type: 'Credit Card',
      institution: 'American Express',
      accountNumber: '****3456',
      balance: -2450.00,
      lastUpdated: 'Today',
      color: '#f59e0b',
      status: 'Active',
      transactions: 23
    },
    {
      id: 5,
      name: 'Betterment IRA',
      type: 'Retirement',
      institution: 'Betterment',
      accountNumber: '****7890',
      balance: 42500.00,
      lastUpdated: '1 week ago',
      color: '#0ea5e9',
      status: 'Active',
      transactions: 2
    },
    {
      id: 6,
      name: 'Wells Fargo',
      type: 'Checking',
      institution: 'Wells Fargo',
      accountNumber: '****1234',
      balance: 12500.00,
      lastUpdated: 'Today',
      color: '#ef4444',
      status: 'Inactive',
      transactions: 0
    }
  ];

  const AccountCard = ({ account }) => (
    <Card className="account-card">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: account.color, width: 48, height: 48 }}>
              {account.type === 'Checking' && <AccountBalance />}
              {account.type === 'Savings' && <Savings />}
              {account.type === 'Investment' && <TrendingUp />}
              {account.type === 'Credit Card' && <CreditCard />}
              {account.type === 'Retirement' && <AccountBalance />}
            </Avatar>
            <Box>
              <Typography variant="h6">{account.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {account.institution} • {account.accountNumber}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ 
            color: account.balance >= 0 ? '#10b981' : '#ef4444',
            fontWeight: 'bold'
          }}>
            {account.balance >= 0 ? '+' : ''}${Math.abs(account.balance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Current Balance
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={account.type}
            size="small"
            sx={{ bgcolor: `${account.color}20`, color: account.color }}
          />
          <Chip 
            label={account.status}
            size="small"
            color={account.status === 'Active' ? 'success' : 'default'}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box className="accounts-view">
      {/* Header */}
      <Box className="section-header">
        <Box>
          <Typography variant="h4" className="section-title">
            My Accounts
          </Typography>
          <Typography variant="body1" className="section-subtitle">
            Manage all your financial accounts in one place
          </Typography>
        </Box>
        <Box className="header-actions">
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => setAddAccountOpen(true)}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                $154,381.50
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Across 6 accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Cash Balance
              </Typography>
              <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                $20,950.50
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Checking & Savings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Investments
              </Typography>
              <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                $110,950.25
              </Typography>
              <Typography variant="caption" color="textSecondary">
                +2.4% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Credit Balance
              </Typography>
              <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                -$2,450.00
              </Typography>
              <Typography variant="caption" color="textSecondary">
                23 transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Account Cards */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        All Accounts
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <AccountCard account={account} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Transactions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { date: 'Today', desc: 'Salary Deposit', account: 'Chase Checking', amount: 8450.50, type: 'deposit' },
                  { date: 'Today', desc: 'Amazon Purchase', account: 'Amex Platinum', amount: -189.99, type: 'purchase' },
                  { date: 'Yesterday', desc: 'Electric Bill', account: 'Chase Checking', amount: -145.50, type: 'bill' },
                  { date: '2 days ago', desc: 'Stock Dividend', account: 'Fidelity', amount: 234.75, type: 'dividend' },
                  { date: '3 days ago', desc: 'Grocery Store', account: 'Amex Platinum', amount: -85.25, type: 'purchase' },
                ].map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.desc}</TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell align="right" sx={{ 
                      color: transaction.amount >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog 
        open={addAccountOpen} 
        onClose={() => setAddAccountOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Account</DialogTitle>
        <DialogContent>
          {/* <AddAccountForm onClose={() => setAddAccountOpen(false)} /> */}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AccountsView;