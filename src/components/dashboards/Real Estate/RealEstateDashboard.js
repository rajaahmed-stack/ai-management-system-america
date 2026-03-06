// RealEstateDashboard.js
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
  Home,
  TrendingUp,
  People,
  Assignment,
  LocationOn,
  MonetizationOn,
  MoreVert,
  Schedule
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/realEstate/RealEstateDashboard.css';

const RealEstateDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const realEstateData = {
    stats: {
      totalProperties: 156,
      activeListings: 47,
      monthlyRevenue: '$245.8K',
      pendingDeals: 23
    },
    featuredProperties: [
      { address: '123 Park Avenue', type: 'Residential', price: '$2.45M', status: 'Active', views: 245, daysOnMarket: 12 },
      { address: '456 Business Blvd', type: 'Commercial', price: '$5.67M', status: 'Pending', views: 189, daysOnMarket: 8 },
      { address: '789 Ocean Drive', type: 'Luxury', price: '$8.90M', status: 'Active', views: 312, daysOnMarket: 5 },
      { address: '321 Main Street', type: 'Residential', price: '$1.23M', status: 'Sold', views: 167, daysOnMarket: 21 }
    ],
    recentDeals: [
      { property: '123 Park Avenue', client: 'Sarah Johnson', type: 'Sale', amount: '$2.45M', status: 'Completed', date: '2024-01-15' },
      { property: '456 Business Blvd', client: 'TechCorp Inc.', type: 'Lease', amount: '$45K/mo', status: 'In Progress', date: '2024-01-14' },
      { property: '789 Ocean Drive', client: 'Michael Chen', type: 'Sale', amount: '$8.90M', status: 'Negotiation', date: '2024-01-13' }
    ],
    marketAlerts: [
      { type: 'trend', message: 'Market value increased by 5.2%', area: 'Downtown', priority: 'Low' },
      { type: 'opportunity', message: 'New development opportunity', location: 'Waterfront', priority: 'High' },
      { type: 'maintenance', message: 'Property inspection scheduled', property: '123 Park Avenue', priority: 'Medium' }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setStats(realEstateData.stats);
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
      <Box className="realestate-dashboard loading">
        <Typography variant="h4">Loading Real Estate Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="realestate-dashboard">
      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="welcome-title">
            Real Estate Management
          </Typography>
          <Typography variant="h6" className="welcome-subtitle">
            Welcome back, {userData?.adminName || 'Property Manager'}
          </Typography>
        </Box>
        <Button variant="contained" className="primary-button">
          Add Property
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<Home />}
            color="blue"
            subtitle="+12 this quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={stats.activeListings}
            icon={<Assignment />}
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            icon={<MonetizationOn />}
            color="gold"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Deals"
            value={stats.pendingDeals}
            icon={<People />}
            color="purple"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} className="main-grid">
        {/* Featured Properties */}
        <Grid item xs={12} lg={8}>
          <Card className="section-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">
                  🏠 Featured Properties
                </Typography>
                <Button variant="outlined" className="view-all-button">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property Address</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Days on Market</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {realEstateData.featuredProperties.map((property, index) => (
                      <TableRow key={index} className="table-row">
                        <TableCell>
                          <Box className="property-info">
                            <Avatar className="property-avatar">
                              <Home />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" className="property-address">
                                {property.address}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={property.type}
                            className="type-chip"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="property-price">
                            {property.price}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={property.status}
                            className={`status-chip ${property.status.toLowerCase()}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="views-count">
                            {property.views}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="days-on-market">
                            {property.daysOnMarket} days
                          </Typography>
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
          {/* Recent Deals */}
          <Card className="section-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                💼 Recent Deals
              </Typography>
              <Box className="deals-list">
                {realEstateData.recentDeals.map((deal, index) => (
                  <Box key={index} className="deal-item">
                    <Box className="deal-info">
                      <Typography variant="body1" className="property-name">
                        {deal.property}
                      </Typography>
                      <Typography variant="caption" className="client-name">
                        {deal.client}
                      </Typography>
                      <Typography variant="caption" className="deal-meta">
                        {deal.type} • {deal.date}
                      </Typography>
                    </Box>
                    <Box className="deal-meta">
                      <Typography variant="body1" className="deal-amount">
                        {deal.amount}
                      </Typography>
                      <Chip 
                        label={deal.status} 
                        size="small" 
                        className={`status-chip ${deal.status.toLowerCase().replace(' ', '-')}`}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Market Alerts */}
          <Card className="section-card alerts-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                📈 Market Alerts
              </Typography>
              <Box className="alerts-list">
                {realEstateData.marketAlerts.map((alert, index) => (
                  <Box key={index} className={`alert-item ${alert.type}`}>
                    <Box className="alert-icon">
                      {alert.type === 'trend' && <TrendingUp />}
                      {alert.type === 'opportunity' && <LocationOn />}
                      {alert.type === 'maintenance' && <Schedule />}
                    </Box>
                    <Box className="alert-content">
                      <Typography variant="body2" className="alert-message">
                        {alert.message}
                      </Typography>
                      {alert.area && (
                        <Typography variant="caption" className="alert-area">
                          {alert.area}
                        </Typography>
                      )}
                      {alert.location && (
                        <Typography variant="caption" className="alert-location">
                          {alert.location}
                        </Typography>
                      )}
                      {alert.property && (
                        <Typography variant="caption" className="alert-property">
                          {alert.property}
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

export default RealEstateDashboard;