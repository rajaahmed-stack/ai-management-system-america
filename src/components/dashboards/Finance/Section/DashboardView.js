// components/employee/sections/DashboardView.js
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Add,
  Payment,
  AutoGraph,
  Insights,
  Notifications,
  Refresh
} from '@mui/icons-material';

// Import widgets
// import FinancialHealthScore from '../widgets/FinancialHealthScore';
// import SpendingChart from '../widgets/SpendingChart';
// import InvestmentChart from '../widgets/InvestmentChart';
// import GoalTracker from '../widgets/GoalTracker';
// import QuickActions from '../widgets/QuickActions';

import '../../../../styles/finance/EmployeesSectionViews.css';

const DashboardView = () => {
  // Dashboard data
  const dashboardData = {
    stats: {
      netWorth: '$156,340',
      monthlyCashFlow: '+$2,450',
      savingsRate: '28%',
      creditScore: 765,
      investmentReturns: '+12.4%',
      debtToIncome: '22%'
    },
    quickInsights: [
      { 
        title: 'Spending Alert', 
        message: 'Dining out increased by 25% this month',
        type: 'warning',
        action: 'Review'
      },
      { 
        title: 'Investment Opportunity', 
        message: 'Market conditions favor tech stocks',
        type: 'opportunity',
        action: 'Explore'
      },
      { 
        title: 'Savings Milestone', 
        message: 'Emergency fund 65% complete',
        type: 'success',
        action: 'Celebrate'
      }
    ],
    recentActivity: [
      { action: 'Salary deposited', amount: '$8,450', time: '2 hours ago' },
      { action: 'Investment dividend', amount: '$234', time: '1 day ago' },
      { action: 'Credit card payment', amount: '$1,245', time: '2 days ago' },
      { action: 'Utility bill paid', amount: '$189', time: '3 days ago' }
    ]
  };

  const StatCard = ({ title, value, trend, subtitle, icon, color }) => (
    <Card className="dashboard-stat-card">
      <CardContent>
        <Box className="stat-header">
          <Typography variant="h6" className="stat-title">
            {title}
          </Typography>
          <Avatar className={`stat-icon ${color}`}>
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h3" className="stat-value">
          {value}
        </Typography>
        {trend && (
          <Box className="stat-trend">
            {trend.direction === 'up' ? 
              <TrendingUp className="trend-icon up" /> : 
              <TrendingDown className="trend-icon down" />
            }
            <Typography variant="body2" className={`trend-text ${trend.direction}`}>
              {trend.value}
            </Typography>
          </Box>
        )}
        {subtitle && (
          <Typography variant="body2" className="stat-subtitle">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const InsightCard = ({ insight, index }) => (
    <Card className={`insight-card ${insight.type}`}>
      <CardContent>
        <Box className="insight-header">
          <Chip 
            label={insight.type.toUpperCase()} 
            size="small" 
            className="insight-type"
          />
          <Typography variant="h6" className="insight-title">
            {insight.title}
          </Typography>
        </Box>
        <Typography variant="body2" className="insight-message">
          {insight.message}
        </Typography>
        <Button 
          variant="outlined" 
          size="small" 
          className="insight-action"
        >
          {insight.action}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box className="dashboard-view">
      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="dashboard-title">
            Financial Dashboard
          </Typography>
          <Typography variant="body1" className="dashboard-subtitle">
            Your complete financial overview
          </Typography>
        </Box>
        <Box className="header-actions">
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            className="refresh-btn"
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            className="add-money-btn"
          >
            Add Money
          </Button>
        </Box>
      </Box>

      {/* Financial Health Score */}
      <Box className="health-score-section">
        {/* <FinancialHealthScore score={78} /> */}
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Net Worth"
            value={dashboardData.stats.netWorth}
            trend={{ direction: 'up', value: '+2.4%' }}
            subtitle="Total assets"
            icon={<AutoGraph />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Cash Flow"
            value={dashboardData.stats.monthlyCashFlow}
            trend={{ direction: 'up', value: '+12.3%' }}
            subtitle="This month"
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Savings Rate"
            value={dashboardData.stats.savingsRate}
            trend={{ direction: 'up', value: '+5.1%' }}
            subtitle="Of income"
            icon={<Payment />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Credit Score"
            value={dashboardData.stats.creditScore}
            trend={{ direction: 'up', value: '+15 pts' }}
            subtitle="Excellent"
            icon={<Insights />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Investment Returns"
            value={dashboardData.stats.investmentReturns}
            trend={{ direction: 'up', value: '+2.1%' }}
            subtitle="YTD"
            icon={<TrendingUp />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Debt to Income"
            value={dashboardData.stats.debtToIncome}
            trend={{ direction: 'down', value: '-3.2%' }}
            subtitle="Healthy"
            icon={<TrendingDown />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} className="main-grid">
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Spending Chart */}
          <Card className="main-chart-card">
            <CardContent>
              <Box className="chart-header">
                <Typography variant="h6">Spending Analysis</Typography>
                <Box className="chart-actions">
                  <Chip label="Live" size="small" color="success" />
                  <Button size="small">View Details</Button>
                </Box>
              </Box>
              {/* <SpendingChart /> */}
            </CardContent>
          </Card>

          {/* Investment Chart */}
          <Card className="main-chart-card">
            <CardContent>
              <Box className="chart-header">
                <Typography variant="h6">Investment Portfolio</Typography>
                <Box className="chart-actions">
                  <Button size="small" startIcon={<AutoGraph />}>
                    Rebalance
                  </Button>
                </Box>
              </Box>
              {/* <InvestmentChart /> */}
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <Card className="main-chart-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>Goals Progress</Typography>
              {/* <GoalTracker /> */}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Quick Actions */}
          <Card className="sidebar-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              {/* <QuickActions /> */}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="sidebar-card">
            <CardContent>
              <Box className="card-header">
                <Typography variant="h6">AI Insights</Typography>
                <Avatar className="ai-avatar">
                  <Insights />
                </Avatar>
              </Box>
              <Box className="insights-list">
                {dashboardData.quickInsights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="sidebar-card">
            <CardContent>
              <Box className="card-header">
                <Typography variant="h6">Recent Activity</Typography>
                <IconButton size="small">
                  <Notifications />
                </IconButton>
              </Box>
              <Box className="activity-list">
                {dashboardData.recentActivity.map((activity, index) => (
                  <Box key={index} className="activity-item">
                    <Box className="activity-details">
                      <Typography variant="body2" className="activity-action">
                        {activity.action}
                      </Typography>
                      <Typography variant="caption" className="activity-time">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      className={`activity-amount ${activity.amount.startsWith('+') ? 'positive' : 'negative'}`}
                    >
                      {activity.amount}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardView;