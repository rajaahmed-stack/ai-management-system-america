// MusicDashboard.js
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
  MusicNote,
  TrendingUp,
  People,
  Album,
  Schedule,
  PlayArrow,
  MoreVert,
  MonetizationOn
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/music/MusicDashboard.css';

const MusicDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  const musicData = {
    stats: {
      totalStreams: '2.4M',
      monthlyRevenue: '$45.8K',
      activeArtists: 24,
      newReleases: 8
    },
    topTracks: [
      { title: 'Summer Vibes', artist: 'DJ Pulse', streams: '245K', revenue: '$12.4K', trend: 'up' },
      { title: 'Midnight City', artist: 'Electro Wave', streams: '189K', revenue: '$9.8K', trend: 'up' },
      { title: 'Ocean Dreams', artist: 'Coastal Sound', streams: '156K', revenue: '$7.9K', trend: 'down' },
      { title: 'Urban Rhythm', artist: 'City Beats', streams: '134K', revenue: '$6.7K', trend: 'up' }
    ],
    recentReleases: [
      { title: 'Neon Lights EP', artist: 'Synth Collective', type: 'EP', releaseDate: '2024-01-15', status: 'Published' },
      { title: 'Acoustic Sessions', artist: 'Soulful Strings', type: 'Album', releaseDate: '2024-01-14', status: 'Pending' },
      { title: 'Bass Revolution', artist: 'Deep Bass', type: 'Single', releaseDate: '2024-01-13', status: 'Published' }
    ],
    royaltyAlerts: [
      { type: 'payout', message: 'Royalty payout processed', amount: '$23,450', priority: 'High' },
      { type: 'copyright', message: 'New copyright claim', amount: '$1,200', priority: 'Medium' },
      { type: 'distribution', message: 'Distribution expanded to 5 new platforms', priority: 'Low' }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setStats(musicData.stats);
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
      <Box className="music-dashboard loading">
        <Typography variant="h4">Loading Music Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="music-dashboard">
      {/* Header */}
      <Box className="dashboard-header">
        <Box>
          <Typography variant="h4" className="welcome-title">
            Music Management
          </Typography>
          <Typography variant="h6" className="welcome-subtitle">
            Welcome back, {userData?.adminName || 'Music Director'}
          </Typography>
        </Box>
        <Button variant="contained" className="primary-button">
          New Release
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} className="stats-grid">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Streams"
            value={stats.totalStreams}
            icon={<MusicNote />}
            color="purple"
            subtitle="+15% this month"
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
            title="Active Artists"
            value={stats.activeArtists}
            icon={<People />}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Releases"
            value={stats.newReleases}
            icon={<Album />}
            color="green"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3} className="main-grid">
        {/* Top Tracks */}
        <Grid item xs={12} lg={8}>
          <Card className="section-card">
            <CardContent>
              <Box className="section-header">
                <Typography variant="h5" className="section-title">
                  🎵 Top Performing Tracks
                </Typography>
                <Button variant="outlined" className="view-all-button">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Track</TableCell>
                      <TableCell>Artist</TableCell>
                      <TableCell>Streams</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Trend</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {musicData.topTracks.map((track, index) => (
                      <TableRow key={index} className="table-row">
                        <TableCell>
                          <Box className="track-info">
                            <Avatar className="track-avatar">
                              <MusicNote />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" className="track-title">
                                {track.title}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" className="artist-name">
                            {track.artist}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="streams-count">
                            {track.streams}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className="revenue">
                            {track.revenue}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={track.trend === 'up' ? <TrendingUp /> : <TrendingUp />}
                            label={track.trend === 'up' ? 'Rising' : 'Declining'}
                            className={`trend-chip ${track.trend}`}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" className="play-button">
                            <PlayArrow />
                          </IconButton>
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
          {/* Recent Releases */}
          <Card className="section-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                🎼 Recent Releases
              </Typography>
              <Box className="releases-list">
                {musicData.recentReleases.map((release, index) => (
                  <Box key={index} className="release-item">
                    <Box className="release-info">
                      <Avatar className="release-avatar">
                        <Album />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" className="release-title">
                          {release.title}
                        </Typography>
                        <Typography variant="caption" className="release-artist">
                          {release.artist}
                        </Typography>
                        <Typography variant="caption" className="release-meta">
                          {release.type} • {release.releaseDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={release.status} 
                      size="small" 
                      className={`status-chip ${release.status.toLowerCase()}`}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Royalty Alerts */}
          <Card className="section-card alerts-card">
            <CardContent>
              <Typography variant="h6" className="section-title">
                💰 Royalty & Payments
              </Typography>
              <Box className="alerts-list">
                {musicData.royaltyAlerts.map((alert, index) => (
                  <Box key={index} className={`alert-item ${alert.type}`}>
                    <Box className="alert-icon">
                      {alert.type === 'payout' && <MonetizationOn />}
                      {alert.type === 'copyright' && <MusicNote />}
                      {alert.type === 'distribution' && <TrendingUp />}
                    </Box>
                    <Box className="alert-content">
                      <Typography variant="body2" className="alert-message">
                        {alert.message}
                      </Typography>
                      {alert.amount && (
                        <Typography variant="body1" className="alert-amount">
                          {alert.amount}
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

export default MusicDashboard;