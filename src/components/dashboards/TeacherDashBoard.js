import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  LinearProgress,
  Container
} from '@mui/material';
import {
  School,
  Dashboard,
  Class,
  Schedule,
  Settings,
  Assignment,
  Analytics,
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarToday,
  TrendingUp,
  People,
  Book,
  Quiz,
  Grade,
  Psychology,
  AutoAwesome,
  Lightbulb,
  FilterList,
  MoreVert,
  EmojiEvents,
  WorkspacePremium,
  Groups,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';
import '../../styles/education/TeacherDashboard.css';

const TeacherDashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [notificationMenu, setNotificationMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();

  // Enhanced menu items with modern icons
  const menuItems = [
    { text: 'Course Overview', icon: <Dashboard />, id: 'dashboard' },
    { text: 'Test Kit', icon: <Quiz />, id: 'test-kit' },
    { text: 'Assignment', icon: <Assignment />, id: 'assignment' },
    { text: 'Calendar', icon: <CalendarToday />, id: 'calendar' },
    { text: 'Analytics', icon: <Analytics />, id: 'analytics' },
    { text: 'Resources', icon: <Book />, id: 'resources' }
  ];

  // Enhanced mock data with modern structure
  const mockData = {
    organization: {
      name: 'EduPlatform Academy',
      shortName: 'EduPlatform',
      theme: {
        primary: '#2563eb',
        secondary: '#7c3aed',
        accent: '#f59e0b'
      }
    },
    welcome: {
      greeting: "Welcome back",
      message: "Let's start the day by learning something new. Don't forget to check your To-Do List.",
      dayMessage: "Here's good day for teaching excellence!"
    },
    stats: {
      totalStudents: 142,
      activeCourses: 8,
      completionRate: 87,
      avgScore: 92
    },
    bestPerformers: [
      { name: 'Floyd Miles', rank: '01', norms: '70', closures: '250', assignments: '30', hours: '84', points: '94', progress: 95 },
      { name: 'Courtney Henry', rank: '02', norms: '65', closures: '248', assignments: '30', hours: '80', points: '88', progress: 88 },
      { name: 'Kathryn Murphy', rank: '03', norms: '60', closures: '245', assignments: '30', hours: '85', points: '85', progress: 85 },
      { name: 'Darnell Steward', rank: '04', norms: '59', closures: '245', assignments: '30', hours: '82', points: '82', progress: 82 }
    ],
    calendar: {
      month: 'February, 2024',
      days: Array.from({ length: 28 }, (_, i) => i + 1)
    },
    designProgress: {
      uiUk: [32, 50, 60, 40, 60, 54],
      adAtt: [48, 46, 44, 64]
    },
    assignments: [
      { title: 'What is Typographic Design?', subtitle: 'Instead of those standards', progress: 75, dueDate: '2024-02-15' },
      { title: 'UI Yu Uk Or Ui-Uk Which One Is Appropriate', subtitle: 'Invoicing (Browse Standards)', progress: 60, dueDate: '2024-02-18' },
      { title: 'Basic Into With Motion Graphic Design', subtitle: 'Invoicing (Browse Standards)', progress: 45, dueDate: '2024-02-20' },
      { title: 'Introduction To Cinema', subtitle: 'Ad And Moyo Invoicing (Browse Standards)', progress: 90, dueDate: '2024-02-22' }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (currentUser) {
          // Fetch teacher data
          const teacherDocRef = doc(db, 'teachers', currentUser.uid);
          const teacherDocSnap = await getDoc(teacherDocRef);
          
          if (teacherDocSnap.exists()) {
            const teacherDataFromFirestore = teacherDocSnap.data();
            setTeacherData({
              name: teacherDataFromFirestore.name || teacherDataFromFirestore.displayName || 'Teacher',
              id: teacherDataFromFirestore.teacherId || teacherDataFromFirestore.id || `TEA-${currentUser.uid.slice(-6)}`,
              email: teacherDataFromFirestore.email || currentUser.email,
              avatar: teacherDataFromFirestore.name ? 
                teacherDataFromFirestore.name.split(' ').map(n => n[0]).join('') : 'T'
            });
          } else {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setTeacherData({
                name: userData.name || userData.displayName || currentUser.displayName || 'Teacher',
                id: userData.teacherId || userData.id || `TEA-${currentUser.uid.slice(-6)}`,
                email: userData.email || currentUser.email,
                avatar: userData.name ? 
                  userData.name.split(' ').map(n => n[0]).join('') : 
                  (currentUser.displayName ? 
                    currentUser.displayName.split(' ').map(n => n[0]).join('') : 'T')
              });
            } else {
              setTeacherData({
                name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Teacher',
                id: `TEA-${currentUser.uid.slice(-6)}`,
                email: currentUser.email,
                avatar: currentUser.displayName ? 
                  currentUser.displayName.split(' ').map(n => n[0]).join('') : 'T'
              });
            }
          }

          // Fetch organization data
          try {
            const orgQuery = query(
              collection(db, 'organizations'), 
              where('members', 'array-contains', currentUser.uid)
            );
            const orgSnapshot = await getDocs(orgQuery);
            
            if (!orgSnapshot.empty) {
              const orgData = orgSnapshot.docs[0].data();
              setOrganizationData({
                name: orgData.name || 'Educational Institution',
                shortName: orgData.shortName || orgData.name || 'EduPlatform'
              });
            } else {
              setOrganizationData(mockData.organization);
            }
          } catch (orgError) {
            setOrganizationData(mockData.organization);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setTeacherData({
          name: 'Teacher',
          id: 'TEA-000000',
          email: 'teacher@example.com',
          avatar: 'T'
        });
        setOrganizationData(mockData.organization);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuItemClick = (menuId) => {
    setActiveItem(menuId);
  };

  // Enhanced Sidebar Component
  const Sidebar = () => (
    <Box className="sidebar">
      <Box className="sidebar-header">
        <Box className="organization-brand">
          <Box className="logo-container">
            <WorkspacePremium className="sidebar-logo" />
          </Box>
          <Typography variant="h6" className="organization-name">
            {organizationData?.shortName || 'EduPlatform'}
          </Typography>
        </Box>
      </Box>
      
      <Divider className="sidebar-divider" />
      
      <List className="sidebar-menu">
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemIcon className="menu-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                className="menu-text"
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Enhanced Teacher Info Section */}
      <Box className="teacher-info-section">
        <Divider className="sidebar-divider" />
        <Box className="teacher-info-card">
          <Avatar className="teacher-avatar">
            {teacherData?.avatar || 'T'}
          </Avatar>
          <Box className="teacher-details">
            <Typography variant="subtitle2" className="teacher-name">
              {teacherData?.name || 'Loading...'}
            </Typography>
            <Typography variant="caption" className="teacher-id">
              ID: {teacherData?.id || 'Loading...'}
            </Typography>
            <Chip 
              label="Senior Instructor" 
              size="small" 
              className="teacher-badge"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Enhanced Stats Cards Component
  const StatsCards = () => (
    <Grid container spacing={2} className="stats-cards">
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card students-card">
          <CardContent>
            <Box className="stat-content">
              <Box>
                <Typography variant="h4" className="stat-number">
                  {mockData.stats.totalStudents}
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Total Students
                </Typography>
              </Box>
              <Groups className="stat-icon" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card courses-card">
          <CardContent>
            <Box className="stat-content">
              <Box>
                <Typography variant="h4" className="stat-number">
                  {mockData.stats.activeCourses}
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Active Courses
                </Typography>
              </Box>
              <Book className="stat-icon" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card completion-card">
          <CardContent>
            <Box className="stat-content">
              <Box>
                <Typography variant="h4" className="stat-number">
                  {mockData.stats.completionRate}%
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Completion Rate
                </Typography>
              </Box>
              <TrendingUp className="stat-icon" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card score-card">
          <CardContent>
            <Box className="stat-content">
              <Box>
                <Typography variant="h4" className="stat-number">
                  {mockData.stats.avgScore}%
                </Typography>
                <Typography variant="body2" className="stat-label">
                  Avg. Score
                </Typography>
              </Box>
              <EmojiEvents className="stat-icon" />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Enhanced Best Performers Table Component
  const BestPerformersTable = () => (
    <Card className="best-performers-card">
      <CardContent>
        <Box className="section-header">
          <Typography variant="h5" className="section-title">
            🏆 Top Performers
          </Typography>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<FilterList />}
            className="filter-button"
          >
            Filter
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Student</TableCell>
                <TableCell className="table-header">Rank</TableCell>
                <TableCell className="table-header">Progress</TableCell>
                <TableCell className="table-header">Points</TableCell>
                <TableCell className="table-header">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.bestPerformers.map((student, index) => (
                <TableRow key={index} className="table-row">
                  <TableCell className="student-cell">
                    <Box className="student-info">
                      <Avatar className="student-avatar">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" className="student-name">
                          {student.name}
                        </Typography>
                        <Typography variant="caption" className="student-meta">
                          {student.assignments} assignments
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<EmojiEvents />}
                      label={`Rank ${student.rank}`}
                      className="rank-chip"
                      size="small"
                    />
                  </TableCell>
                  <TableCell className="progress-cell">
                    <Box className="progress-container">
                      <LinearProgress 
                        variant="determinate" 
                        value={student.progress} 
                        className="progress-bar"
                      />
                      <Typography variant="body2" className="progress-text">
                        {student.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" className="points-text">
                      {student.points}
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
  );

  // Enhanced Calendar Component
  const CalendarSection = () => (
    <Card className="calendar-card">
      <CardContent>
        <Box className="calendar-header">
          <Typography variant="h6" className="calendar-title">
            {mockData.calendar.month}
          </Typography>
          <Box className="calendar-controls">
            <IconButton size="small" className="calendar-button">
              <ChevronLeft />
            </IconButton>
            <IconButton size="small" className="calendar-button">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
        <Box className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Typography key={day} variant="caption" className="calendar-day-header">
              {day}
            </Typography>
          ))}
          {mockData.calendar.days.map(day => (
            <Box
              key={day}
              className={`calendar-day ${day === 14 ? 'active-day' : ''}`}
            >
              <Typography variant="body2" className="day-number">
                {day}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced Assignments Component
  const AssignmentsSection = () => (
    <Card className="assignments-card">
      <CardContent>
        <Typography variant="h6" className="section-title">
          📚 Recent Assignments
        </Typography>
        <Box className="assignments-list">
          {mockData.assignments.map((assignment, index) => (
            <Box key={index} className="assignment-item">
              <Box className="assignment-content">
                <Typography variant="subtitle1" className="assignment-title">
                  {assignment.title}
                </Typography>
                <Typography variant="body2" className="assignment-subtitle">
                  {assignment.subtitle}
                </Typography>
                <Box className="assignment-progress">
                  <LinearProgress 
                    variant="determinate" 
                    value={assignment.progress} 
                    className="assignment-progress-bar"
                  />
                  <Typography variant="body2" className="progress-percentage">
                    {assignment.progress}%
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label="Due Soon" 
                size="small" 
                className="due-chip"
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced Welcome Section
  const WelcomeSection = () => (
    <Card className="welcome-card">
      <CardContent className="welcome-content">
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" className="welcome-greeting">
              {mockData.welcome.greeting}
            </Typography>
            <Typography variant="h4" className="welcome-name">
              {teacherData?.name || 'Loading...'}
            </Typography>
            <Typography variant="h6" className="welcome-message">
              {mockData.welcome.message}
            </Typography>
            <Typography variant="body1" className="welcome-day-message">
              {mockData.welcome.dayMessage}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="welcome-graphic">
            <Box className="graphic-container">
              <WorkspacePremium className="welcome-icon" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className="loading-container">
        <Box className="loading-content">
          <Typography variant="h4" className="loading-text">
            Loading your dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="teacher-dashboard">
      {/* Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content Area */}
      <Box className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Enhanced Top Navigation Bar */}
        <AppBar position="static" className="top-app-bar">
          <Toolbar className="toolbar">
            <IconButton
              color="inherit"
              onClick={handleSidebarToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h5" className="page-title">
              {menuItems.find(item => item.id === activeItem)?.text || 'Course Overview'}
            </Typography>

            {/* Enhanced Search Bar */}
            <Box className="search-bar">
              <Search className="search-icon" />
              <input 
                placeholder="Search courses, students, assignments..." 
                className="search-input"
              />
            </Box>

            {/* Enhanced Action Buttons */}
            <Box className="action-buttons">
              <IconButton className="action-button notification-button">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <IconButton 
                className="action-button user-button"
                onClick={(e) => setUserMenu(e.currentTarget)}
              >
                <Avatar className="user-avatar">
                  {teacherData?.avatar || 'T'}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={userMenu}
                open={Boolean(userMenu)}
                onClose={() => setUserMenu(null)}
                className="user-menu"
              >
                <MenuItem onClick={() => setUserMenu(null)}>
                  <ListItemIcon><AccountCircle /></ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => setUserMenu(null)}>
                  <ListItemIcon><Settings /></ListItemIcon>
                  Settings
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" className="content-container">
          {/* Welcome Section */}
          <WelcomeSection />

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Grid Layout */}
          <Grid container spacing={3} className="main-grid">
            {/* Left Column - Best Performers */}
            <Grid item xs={12} lg={8} className="left-column">
              <BestPerformersTable />
            </Grid>

            {/* Right Column - Calendar & Assignments */}
            <Grid item xs={12} lg={4} className="right-column">
              <CalendarSection />
              <AssignmentsSection />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default TeacherDashBoard;