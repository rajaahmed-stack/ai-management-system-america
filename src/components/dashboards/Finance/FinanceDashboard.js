// FinanceDashboard.js - UPDATED WITH EMPLOYEE FORM FUNCTIONALITY
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip,
  Badge
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Security,
  Payment,
  MoreVert,
  Warning,
  CheckCircle,
  Dashboard,
  Receipt,
  Analytics,
  AccountBalanceWallet,
  Savings,
  Notifications,
  Settings,
  Person,
  Logout,
  Menu as MenuIcon,
  Add,
  SmartToy,
  Psychology,
  ShowChart,
  PieChart,
  Timeline,
  People,
  Business,
  Assessment
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

// Import AI Feature Components
import FinanceAiChatBot from './FinanceAiChatBot';
import FinancialTherapy from './FinancialTherapy';
import PredictiveAnalytics from './PredictiveAnalytics';
import EmployeeDepartmentForm from '../../Forms/FinanceEmployeeAddingForm'; // Import the form component

import '../../../styles/finance/FinanceDashboard.css';

// Chart Components
const CashFlowChart = () => (
  <Box className="chart-container">
    <Typography variant="h6" className="chart-title">Organization Cash Flow</Typography>
    <Box className="chart-placeholder">
      <Timeline className="chart-icon" />
      <Typography>Real-time organizational cash flow analysis</Typography>
    </Box>
  </Box>
);

const PortfolioChart = () => (
  <Box className="chart-container">
    <Typography variant="h6" className="chart-title">Company Portfolio</Typography>
    <Box className="chart-placeholder">
      <PieChart className="chart-icon" />
      <Typography>Corporate investment distribution</Typography>
    </Box>
  </Box>
);

const SpendingChart = () => (
  <Box className="chart-container">
    <Typography variant="h6" className="chart-title">Department Spending</Typography>
    <Box className="chart-placeholder">
      <ShowChart className="chart-icon" />
      <Typography>Monthly departmental expenditure patterns</Typography>
    </Box>
  </Box>
);

const FinanceDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false); // State for form modal
  const { userData } = useAuth();

  // Admin-focused financial data
  const financeData = {
    stats: {
      totalAssets: '2.47M',
      monthlyRevenue: '184.5K',
      activeInvestments: 47,
      fraudAlerts: 3,
      cashFlow: '+$45.2K',
      netWorth: '3.12M',
      totalUsers: 156,
      activeEmployees: 89
    },
    departments: [
      { name: 'Engineering', budget: '$450K', spent: '$387K', variance: '-14%' },
      { name: 'Sales', budget: '$320K', spent: '$295K', variance: '-8%' },
      { name: 'Marketing', budget: '$280K', spent: '$312K', variance: '+11%' },
      { name: 'Operations', budget: '$190K', spent: '$175K', variance: '-8%' }
    ],
    employees: [
      { name: 'John Smith', department: 'Engineering', salary: '$125K', riskScore: 'Low' },
      { name: 'Sarah Johnson', department: 'Sales', salary: '$95K', riskScore: 'Medium' },
      { name: 'Mike Chen', department: 'Marketing', salary: '$110K', riskScore: 'Low' },
      { name: 'Emily Davis', department: 'Operations', salary: '$85K', riskScore: 'High' }
    ],
    transactions: [
      { id: 'TX001', account: 'Business Premium', amount: '+$12,450', type: 'Deposit', status: 'Completed', date: '2024-01-15', category: 'Revenue' },
      { id: 'TX002', account: 'Investment Account', amount: '-$8,750', type: 'Withdrawal', status: 'Pending', date: '2024-01-15', category: 'Investment' },
      { id: 'TX003', account: 'Savings Account', amount: '+$23,100', type: 'Transfer', status: 'Completed', date: '2024-01-14', category: 'Transfer' }
    ],
    investments: [
      { name: 'Tech Growth Fund', value: '$245,670', return: '+12.4%', risk: 'Medium', allocation: '35%' },
      { name: 'Global Index', value: '$189,230', return: '+8.2%', risk: 'Low', allocation: '25%' },
      { name: 'Real Estate ETF', value: '$98,450', return: '+5.3%', risk: 'Low', allocation: '15%' }
    ],
    alerts: [
      { type: 'fraud', message: 'Suspicious activity in Engineering Dept', priority: 'High', time: '2 min ago' },
      { type: 'compliance', message: 'Quarterly financial report due in 3 days', priority: 'Medium', time: '1 hour ago' },
      { type: 'budget', message: 'Marketing department over budget by 11%', priority: 'Medium', time: '5 hours ago' }
    ],
    aiInsights: [
      { type: 'savings', message: 'Optimize department budgets to save $45K monthly', confidence: '92%' },
      { type: 'investment', message: 'Rebalance corporate portfolio for better returns', confidence: '88%' },
      { type: 'risk', message: '3 employees show high financial stress risk', confidence: '95%' }
    ]
  };

  useEffect(() => {
    // Simulate API call to real database
    setTimeout(() => {
      setStats(financeData.stats);
      setLoading(false);
    }, 1500);
  }, []);

  // Admin-specific menu items
  const menuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: <Dashboard />, badge: 0 },
    { id: 'user-management', label: 'User Management', icon: <People />, badge: 3 },
    { id: 'department-analytics', label: 'Department Analytics', icon: <Business />, badge: 0 },
    { id: 'financial-therapy', label: 'Employee Wellness', icon: <Psychology />, badge: 5 },
    { id: 'predictive-analytics', label: 'Predictive Analytics', icon: <Analytics />, badge: 0 },
    { id: 'smart-categorization', label: 'Smart Categorization', icon: <Receipt />, badge: 0 },
    { id: 'anomaly-detection', label: 'Anomaly Detection', icon: <Warning />, badge: 2 },
    { id: 'scenario-planner', label: 'Scenario Planner', icon: <Assessment />, badge: 0 },
    { id: 'security-center', label: 'Security Center', icon: <Security />, badge: 3 }
  ];

  const StatCard = ({ title, value, icon, color, trend, trendValue, subtitle }) => (
    <Card className="stat-card">
      <CardContent>
        <Box className="stat-content">
          <Box className="stat-main">
            <Typography variant="h3" className="stat-number">
              {value}
            </Typography>
            <Typography variant="h6" className="stat-title">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" className="stat-subtitle">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box className="trend-indicator">
                {trend === 'up' ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
                <Typography variant="body2" className={`trend-value ${trend}`}>
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Box className={`stat-icon ${color}`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const Sidebar = () => (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      className="sidebar"
    >
      <Box className="sidebar-header">
        <Box className="logo-section">
          <Avatar className="logo">
            <Business />
          </Avatar>
          <Box>
            <Typography variant="h6" className="app-name">FinSight AI</Typography>
            <Typography variant="caption" className="app-tagline">Admin Portal</Typography>
          </Box>
        </Box>
        <IconButton onClick={() => setSidebarOpen(false)} className="menu-toggle">
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <ListItemIcon className="menu-icon">
              <Badge badgeContent={item.badge} color="error">
                {item.icon}
              </Badge>
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Divider />

      <List className="sidebar-footer">
        <ListItem className="menu-item">
          <ListItemIcon className="menu-icon">
            <Notifications />
          </ListItemIcon>
          <ListItemText primary="Alerts" />
          <Chip label="12" size="small" color="primary" />
        </ListItem>
        <ListItem className="menu-item">
          <ListItemIcon className="menu-icon">
            <Settings />
          </ListItemIcon>
          <ListItemText primary="System Settings" />
        </ListItem>
        <ListItem className="menu-item">
          <ListItemIcon className="menu-icon">
            <Person />
          </ListItemIcon>
          <ListItemText primary="Admin Profile" />
        </ListItem>
        <ListItem className="menu-item">
          <ListItemIcon className="menu-icon">
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );

  // Handle opening employee form
  const handleOpenEmployeeForm = () => {
    setEmployeeFormOpen(true);
  };

  // Handle closing employee form
  const handleCloseEmployeeForm = () => {
    setEmployeeFormOpen(false);
  };

  // Render different sections based on active menu
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'financial-therapy':
        return <FinancialTherapy adminView={true} />;
      case 'predictive-analytics':
        return <PredictiveAnalytics adminView={true} />;
      case 'user-management':
        return renderUserManagementSection();
      case 'dashboard':
      default:
        return renderAdminDashboard();
    }
  };

  // User Management Section
  const renderUserManagementSection = () => (
    <Box className="user-management-section">
      <Box className="section-header">
        <Typography variant="h4" className="section-title">
          User Management
        </Typography>
        <Typography variant="h6" className="section-subtitle">
          Manage employees and departments in your financial system
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="management-card">
            <CardContent>
              <Box className="card-header">
                <Avatar className="card-avatar" sx={{ bgcolor: 'primary.main' }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">Employee Management</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Add and manage employee accounts
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ my: 2 }}>
                Currently managing {financeData.employees.length} employees across {financeData.departments.length} departments.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={handleOpenEmployeeForm}
                className="add-employee-button"
                fullWidth
              >
                Add New Employee
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className="management-card">
            <CardContent>
              <Box className="card-header">
                <Avatar className="card-avatar" sx={{ bgcolor: 'secondary.main' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6">Department Management</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Create and organize departments
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ my: 2 }}>
                Track budgets and performance across all departments in your organization.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Add />}
                onClick={handleOpenEmployeeForm}
                className="add-department-button"
                fullWidth
              >
                Create Department
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee List */}
        <Grid item xs={12}>
          <Card className="employees-list-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Current Employees
              </Typography>
              <Grid container spacing={2}>
                {financeData.employees.map((employee, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card variant="outlined" className="employee-item-card">
                      <CardContent>
                        <Box className="employee-item-header">
                          <Avatar className="employee-avatar-small">
                            {employee.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" className="employee-name">
                              {employee.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {employee.department}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="employee-details">
                          <Chip 
                            label={employee.riskScore} 
                            size="small" 
                            className={`risk-chip-small ${employee.riskScore.toLowerCase()}`}
                          />
                          <Typography variant="body2" className="employee-salary">
                            {employee.salary}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderAdminDashboard = () => (
    <>
      {/* Header */}
      <Box className="dashboard-header">
        <Box className="header-left">
          {!sidebarOpen && (
            <IconButton onClick={() => setSidebarOpen(true)} className="menu-toggle">
              <MenuIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h4" className="welcome-title">
              Admin Financial Dashboard
            </Typography>
            <Typography variant="h6" className="welcome-subtitle">
              Welcome back, {userData?.adminName || 'Financial Administrator'} 👋
            </Typography>
          </Box>
        </Box>
        
        <Box className="header-actions">
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            className="action-button"
            onClick={handleOpenEmployeeForm}
          >
            Add User
          </Button>
          <Button variant="contained" startIcon={<Assessment />} className="primary-button">
            Generate Report
          </Button>
          <Tooltip title="AI Admin Assistant">
            <IconButton className="ai-assistant">
              <SmartToy />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* AI Insights Banner */}
      <Card className="ai-insights-banner">
        <CardContent>
          <Box className="insights-container">
            <Psychology className="insight-icon" />
            <Box className="insights-content">
              <Typography variant="h6">AI Organizational Insights</Typography>
              <Typography variant="body2">
                {financeData.aiInsights[0]?.message || "Analyzing organizational financial patterns..."}
              </Typography>
            </Box>
            <Chip label={`${financeData.aiInsights[0]?.confidence} Confidence`} color="primary" size="small" />
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Assets"
            value={stats.totalAssets}
            icon={<AccountBalance />}
            color="gold"
            trend="up"
            trendValue="+2.4%"
            subtitle="Corporate assets"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            icon={<TrendingUp />}
            color="green"
            trend="up"
            trendValue="+5.1%"
            subtitle="This month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Employees"
            value={stats.activeEmployees}
            icon={<People />}
            color="blue"
            trend="up"
            trendValue="+8.3%"
            subtitle="Financial program"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Risk Alerts"
            value={stats.fraudAlerts}
            icon={<Security />}
            color="red"
            subtitle="Require attention"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} className="charts-grid">
        <Grid item xs={12} md={8}>
          <CashFlowChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortfolioChart />
        </Grid>
        <Grid item xs={12}>
          <SpendingChart />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} className="main-grid">
        
        {/* Department Budgets */}
        <Grid item xs={12} lg={8}>
          <Card className="section-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">
                  Department Budgets
                </Typography>
                <Button variant="outlined" className="view-all-button">
                  Manage Budgets
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell>Budget</TableCell>
                      <TableCell>Spent</TableCell>
                      <TableCell>Variance</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {financeData.departments.map((dept, index) => (
                      <TableRow key={index} className="table-row">
                        <TableCell>
                          <Typography variant="body2" className="department-name">
                            {dept.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="budget-amount">
                            {dept.budget}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="spent-amount">
                            {dept.spent}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={dept.variance}
                            className={`variance-chip ${dept.variance.startsWith('+') ? 'negative' : 'positive'}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={dept.variance.startsWith('+') ? 'Over Budget' : 'On Track'}
                            className={`status-chip ${dept.variance.startsWith('+') ? 'warning' : 'success'}`}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Employee Risk Assessment */}
          <Card className="section-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">
                  Employee Financial Wellness
                </Typography>
                <Button 
                  variant="outlined" 
                  className="view-all-button"
                  onClick={() => setActiveSection('user-management')}
                >
                  View All
                </Button>
              </Box>
              <Grid container spacing={2}>
                {financeData.employees.map((employee, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box className="employee-card">
                      <Box className="employee-header">
                        <Avatar className="employee-avatar">
                          {employee.name.charAt(0)}
                        </Avatar>
                        <Box className="employee-info">
                          <Typography variant="h6" className="employee-name">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" className="employee-department">
                            {employee.department}
                          </Typography>
                        </Box>
                        <Chip 
                          label={employee.riskScore} 
                          size="small" 
                          className={`risk-chip ${employee.riskScore.toLowerCase()}`}
                        />
                      </Box>
                      <Box className="employee-details">
                        <Typography variant="body2" className="employee-salary">
                          Salary: {employee.salary}
                        </Typography>
                        <Button 
                          size="small" 
                          className="details-button"
                          onClick={() => setActiveSection('user-management')}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          
          {/* Security Alerts */}
          <Card className="section-card alerts-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h6" className="section-title">
                  Security Alerts
                </Typography>
                <Badge badgeContent={financeData.alerts.length} color="error">
                  <Warning className="alert-header-icon" />
                </Badge>
              </Box>
              <Box className="alerts-list">
                {financeData.alerts.map((alert, index) => (
                  <Box key={index} className={`alert-item ${alert.type}`}>
                    <Box className="alert-icon">
                      {alert.type === 'fraud' && <Warning />}
                      {alert.type === 'compliance' && <Security />}
                      {alert.type === 'budget' && <TrendingDown />}
                    </Box>
                    <Box className="alert-content">
                      <Typography variant="body2" className="alert-message">
                        {alert.message}
                      </Typography>
                      <Box className="alert-meta">
                        <Chip 
                          label={alert.priority} 
                          size="small" 
                          className={`priority-chip ${alert.priority.toLowerCase()}`}
                        />
                        <Typography variant="caption" className="alert-time">
                          {alert.time}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* AI Organizational Insights */}
          <Card className="section-card insights-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h6" className="section-title">
                  AI Insights
                </Typography>
                <Psychology className="insights-header-icon" />
              </Box>
              <Box className="insights-list">
                {financeData.aiInsights.map((insight, index) => (
                  <Box key={index} className="insight-item">
                    <Box className="insight-content">
                      <Typography variant="body2" className="insight-message">
                        {insight.message}
                      </Typography>
                      <Chip 
                        label={insight.confidence} 
                        size="small" 
                        className="confidence-chip"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="section-card quick-actions-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                Admin Actions
              </Typography>
              <Grid container spacing={1} className="quick-actions">
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    className="quick-action-button" 
                    fullWidth
                    onClick={handleOpenEmployeeForm}
                  >
                    Add User
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" className="quick-action-button" fullWidth>
                    Run Report
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" className="quick-action-button" fullWidth>
                    Budget Review
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="outlined" className="quick-action-button" fullWidth>
                    System Check
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );

  if (loading) {
    return (
      <Box className="finance-dashboard loading">
        <Box className="loading-content">
          <Avatar className="loading-logo">
            <Business />
          </Avatar>
          <Typography variant="h4" className="loading-text">
            Loading Admin Dashboard...
          </Typography>
          <LinearProgress className="loading-progress" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="finance-dashboard">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {renderActiveSection()}
      </Box>

      {/* Employee Department Form Modal */}
      <EmployeeDepartmentForm 
        open={employeeFormOpen}
        onClose={handleCloseEmployeeForm}
      />

      {/* AI Chat Bot - Always Available */}
      <FinanceAiChatBot adminMode={true} />
    </Box>
  );
};

export default FinanceDashboard;