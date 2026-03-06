import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Chip,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  AccountBalanceWallet,
  TrendingUp,
  Receipt,
  Savings,
  CreditCard,
  AccountBalance,
  Psychology,
  Insights,
  EmojiEvents,
  Settings,
  Person,
  Logout,
  Notifications,
  Menu as MenuIcon,
  Assessment,
  Calculate,
  School,
  Security,
  AutoGraph,
  Wallet,
  RequestQuote,
  Timeline,
  PieChart
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

// UNCOMMENT THESE IMPORTS - Import actual components
import DashboardView from '../Finance/Section/DashboardView';
import AccountsView from '../Finance/Section/AccountsView';
// Import other components as you create them
// import InvestmentsView from './sections/InvestmentsView';
// import BudgetView from './sections/BudgetView';
// import GoalsView from './sections/GoalsView';
// import DebtManagementView from './sections/DebtManagementView';
// import RetirementPlanningView from './sections/RetirementPlanningView';
// import TaxPlanningView from './sections/TaxPlanningView';
// import FinancialEducationView from './sections/FinancialEducationView';
// import SettingsView from './sections/SettingsView';
// import ProfileView from './sections/ProfileView';

// Import AI components
// import EmployeeAiChatBot from './ai/EmployeeAiChatBot';
// import SmartAlerts from './ai/SmartAlerts';

import '../../../styles/finance/EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState(5);
  const { userData } = useAuth();

  // Get user name from auth context or use default
  const employeeData = {
    personal: {
      name: userData?.fullName || "Sarah Johnson",
      employeeId: userData?.employeeId || "EMP_TECH_789",
      department: userData?.department || "Engineering",
      joinDate: userData?.joinDate || "2022-03-15",
      riskTolerance: "Moderate",
      financialWellness: 78,
      avatarColor: "#667eea"
    }
  };

  // Complete menu structure with all features
  const menuSections = [
    {
      title: "Overview",
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, badge: 0 },
        { id: 'accounts', label: 'My Accounts', icon: <AccountBalanceWallet />, badge: 2 },
        { id: 'investments', label: 'Investments', icon: <TrendingUp />, badge: 0 },
      ]
    },
    {
      title: "Planning & Budgeting",
      items: [
        { id: 'budget', label: 'Budget & Spending', icon: <Receipt />, badge: 3 },
        { id: 'goals', label: 'Savings Goals', icon: <Savings />, badge: 1 },
        { id: 'debt', label: 'Debt Management', icon: <CreditCard />, badge: 0 },
        { id: 'retirement', label: 'Retirement Planning', icon: <AccountBalance />, badge: 0 },
        { id: 'tax', label: 'Tax Planning', icon: <Calculate />, badge: 2 },
      ]
    },
    {
      title: "AI & Analytics",
      items: [
        { id: 'financial-therapy', label: 'Financial Therapy', icon: <Psychology />, badge: 1 },
        { id: 'predictive-analytics', label: 'AI Insights', icon: <Insights />, badge: 0 },
        { id: 'behavioral-insights', label: 'Behavioral Insights', icon: <Assessment />, badge: 0 },
      ]
    },
    {
      title: "Learning & Growth",
      items: [
        { id: 'financial-education', label: 'Learn & Grow', icon: <School />, badge: 0 },
        { id: 'challenges', label: 'Financial Challenges', icon: <EmojiEvents />, badge: 0 },
      ]
    },
    {
      title: "Account",
      items: [
        { id: 'profile', label: 'My Profile', icon: <Person />, badge: 0 },
        { id: 'settings', label: 'Settings', icon: <Settings />, badge: 0 },
        { id: 'security', label: 'Security', icon: <Security />, badge: 0 },
      ]
    }
  ];

  // Render active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'accounts':
        return <AccountsView />;
      // case 'investments':
      //   return <InvestmentsView />;
      // case 'budget':
      //   return <BudgetView />;
      // case 'goals':
      //   return <GoalsView />;
      // case 'debt':
      //   return <DebtManagementView />;
      // case 'retirement':
      //   return <RetirementPlanningView />;
      // case 'tax':
      //   return <TaxPlanningView />;
      // case 'financial-therapy':
      //   return <EmployeeFinancialTherapy />;
      // case 'predictive-analytics':
      //   return <EmployeePredictiveAnalytics />;
      // case 'behavioral-insights':
      //   return <BehavioralInsights />;
      // case 'financial-education':
      //   return <FinancialEducationView />;
      // case 'challenges':
      //   return <FinancialChallengesView />;
      // case 'profile':
      //   return <ProfileView />;
      // case 'settings':
      //   return <SettingsView />;
      // case 'security':
      //   return <SecurityView />;
      default:
        return <DashboardView />;
    }
  };

  const Sidebar = () => (
    <Drawer
      variant="persistent"
      anchor="left"
      open={sidebarOpen}
      className="employee-sidebar"
    >
      <Box className="sidebar-header">
        <Box className="user-profile">
          <Avatar 
            className="employee-avatar"
            sx={{ bgcolor: employeeData.personal.avatarColor }}
          >
            {employeeData.personal.name.charAt(0)}
          </Avatar>
          <Box className="user-info">
            <Typography variant="h6" className="user-name">
              {employeeData.personal.name}
            </Typography>
            <Typography variant="caption" className="user-role">
              {employeeData.personal.department}
            </Typography>
            <Chip 
              label={`Wellness: ${employeeData.personal.financialWellness}`} 
              size="small" 
              color="success"
              className="wellness-chip"
            />
          </Box>
        </Box>
        <Box className="header-actions">
          <Tooltip title="Notifications">
            <IconButton className="notification-btn">
              <Badge badgeContent={notifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton 
            onClick={() => setSidebarOpen(false)} 
            className="menu-toggle"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Box className="sidebar-content">
        {menuSections.map((section, index) => (
          <Box key={index} className="menu-section">
            <Typography variant="caption" className="section-title">
              {section.title}
            </Typography>
            <List className="menu-list">
              {section.items.map((item) => (
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
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ className: 'menu-text' }}
                  />
                </ListItem>
              ))}
            </List>
            {index < menuSections.length - 1 && <Divider className="section-divider" />}
          </Box>
        ))}
      </Box>

      <Box className="sidebar-footer">
        <ListItem className="footer-item" onClick={() => setActiveSection('profile')}>
          <ListItemIcon className="footer-icon">
            <Person />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem className="footer-item" onClick={() => setActiveSection('settings')}>
          <ListItemIcon className="footer-icon">
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem className="footer-item logout" onClick={() => window.location.href = '/login'}>
          <ListItemIcon className="footer-icon">
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Drawer>
  );

  return (
    <Box className="employee-dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box className={`employee-main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {!sidebarOpen && (
          <IconButton 
            className="menu-toggle-fixed"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Active Section Content */}
        <Box className="section-content">
          {renderActiveSection()}
        </Box>
      </Box>

      {/* AI Chat Bot */}
      {/* <EmployeeAiChatBot /> */}

      {/* Smart Alerts Component */}
      {/* <SmartAlerts /> */}
    </Box>
  );
};

export default EmployeeDashboard;