// LegalDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import {
  Gavel,
  Assignment,
  Schedule,
  People,
  TrendingUp,
  Warning,
  MoreVert,
  Description
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/legal/LegalDashboard.css';

const LegalDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const legalData = {
    stats: {
      activeCases: 47,
      completedCases: 23,
      totalClients: 156,
      upcomingHearings: 8
    },
    recentCases: [
      { caseId: 'CASE-001', client: 'TechCorp Inc.', type: 'Corporate Law', status: 'Active', progress: 65, priority: 'High' },
      { caseId: 'CASE-002', client: 'John Smith', type: 'Personal Injury', status: 'Research', progress: 30, priority: 'Medium' },
      { caseId: 'CASE-003', client: 'Global Enterprises', type: 'Intellectual Property', status: 'Discovery', progress: 45, priority: 'High' },
      { caseId: 'CASE-004', client: 'Sarah Johnson', type: 'Family Law', status: 'Settlement', progress: 85, priority: 'Low' }
    ],
    upcomingHearings: [
      { case: 'TechCorp vs State', date: '2024-01-20', time: '09:30 AM', court: 'District Court', type: 'Hearing' },
      { case: 'Smith Personal Injury', date: '2024-01-22', time: '02:15 PM', court: 'Civil Court', type: 'Deposition' },
      { case: 'Global IP Dispute', date: '2024-01-25', time: '10:00 AM', court: 'Federal Court', type: 'Motion Hearing' }
    ],
    legalAlerts: [
      { type: 'deadline', message: 'Discovery deadline approaching', case: 'CASE-002', daysLeft: 3, priority: 'High' },
      { type: 'document', message: 'New evidence submitted', case: 'CASE-001', priority: 'Medium' },
      { type: 'compliance', message: 'Quarterly compliance review due', priority: 'Low' }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setStats(legalData.stats);
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="stat-card">
      <CardContent>
        <Box className="stat-content">
          <Box>
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
          </Box>
          <Box className={`stat-icon ${color}`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className="legal-dashboard loading">
        <Typography variant="h4">Loading Legal Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="legal-dashboard">
      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="welcome-title">
            Legal Practice Management
          </Typography>
          <Typography variant="h6" className="welcome-subtitle">
            Welcome back, {userData?.adminName || 'Legal Counsel'}
          </Typography>
        </Box>
        <Button variant="contained" className="primary-button">
          New Case
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Cases"
            value={stats.activeCases}
            icon={<Gavel />}
            color="blue"
            subtitle="+5 this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Cases"
            value={stats.completedCases}
            icon={<Assignment />}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<People />}
            color="purple"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming Hearings"
            value={stats.upcomingHearings}
            icon={<Schedule />}
            color="orange"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} className="main-grid">
        {/* Recent Cases */}
        <Grid item xs={12} lg={8}>
          <Card className="section-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">
                  ⚖️ Active Cases
                </Typography>
                <Button variant="outlined" className="view-all-button">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Case ID</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Case Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {legalData.recentCases.map((caseItem, index) => (
                      <TableRow key={index} className="table-row">
                        <TableCell>
                          <Typography variant="body2" className="case-id">
                            {caseItem.caseId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box className="client-info">
                            <Avatar className="client-avatar">
                              {caseItem.client.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="body1" className="client-name">
                                {caseItem.client}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="case-type">
                            {caseItem.type}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={caseItem.status}
                            className={`status-chip ${caseItem.status.toLowerCase()}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box className="progress-container">
                            <LinearProgress 
                              variant="determinate" 
                              value={caseItem.progress}
                              className="progress-bar"
                            />
                            <Typography variant="body2" className="progress-text">
                              {caseItem.progress}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={caseItem.priority}
                            className={`priority-chip ${caseItem.priority.toLowerCase()}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" className="action-button">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Upcoming Hearings */}
          <Card className="section-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                🗓️ Upcoming Hearings
              </Typography>
              <Box className="hearings-list">
                {legalData.upcomingHearings.map((hearing, index) => (
                  <Box key={index} className="hearing-item">
                    <Box className="hearing-date">
                      <Typography variant="body2" className="date">
                        {hearing.date}
                      </Typography>
                      <Typography variant="caption" className="time">
                        {hearing.time}
                      </Typography>
                    </Box>
                    <Box className="hearing-details">
                      <Typography variant="body1" className="case-name">
                        {hearing.case}
                      </Typography>
                      <Typography variant="caption" className="court-info">
                        {hearing.court} • {hearing.type}
                      </Typography>
                    </Box>
                    <Chip label="Scheduled" size="small" className="scheduled-chip" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Legal Alerts */}
          <Card className="section-card alerts-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
            ⚠️ Legal Alerts
              </Typography>
              <Box className="alerts-list">
                {legalData.legalAlerts.map((alert, index) => (
                  <Box key={index} className={`alert-item ${alert.type}`}>
                    <Box className="alert-icon">
                      {alert.type === 'deadline' && <Warning />}
                      {alert.type === 'document' && <Description />}
                      {alert.type === 'compliance' && <Assignment />}
                    </Box>
                    <Box className="alert-content">
                      <Typography variant="body2" className="alert-message">
                        {alert.message}
                      </Typography>
                      {alert.case && (
                        <Typography variant="caption" className="alert-case">
                          {alert.case}
                        </Typography>
                      )}
                      {alert.daysLeft && (
                        <Typography variant="caption" className="days-left">
                          {alert.daysLeft} days left
                        </Typography>
                      )}
                      <Chip 
                        label={alert.priority} 
                        size="small" 
                        className={`priority-chip ${alert.priority.toLowerCase()}`}
                      />
                    </Box>
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

export default LegalDashboard;