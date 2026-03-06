// EducationDashboard.jsx - Fixed version with Firestore data fetching
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Drawer,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Badge,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  School,
  Group,
  Assignment,
  Analytics,
  Add,
  TrendingUp,
  Schedule,
  CheckCircle,
  Menu as MenuIcon,
  Dashboard,
  People,
  Class,
  Assessment,
  CalendarToday,
  Settings,
  Notifications,
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  MoreVert,
  Download,
  Edit,
  Delete,
  Business,
  LocalLibrary,
  ChildCare,
  PersonAdd,
  Book,
  ScheduleSend,
  Inventory,
  BeachAccess,
  Insights,
  ManageAccounts,
  BusinessCenter,
  Email,
  Phone,
  Search,
  ViewList,
  ViewModule,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import your Firestore instance
import '../../styles/education/EducationDashboard.css';
import AddingTeacherForm from '../Forms/AddingTeacherForm';
import AddingCoursesForm from '../Forms/AddingCoursesForm';
import SchoolScheduleForm from '../Forms/SchoolScheduleForm'
import SchoolResoursesForm from '../Forms/SchoolResoursesForm';
import SchoolLeaveForm from '../Forms/SchoolLeaveForm';

// Enhanced sidebar navigation with new features
const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, id: 'dashboard' },
  { text: 'Teacher Management', icon: <People />, id: 'teacher' },
  { text: 'Course Management', icon: <Book />, id: 'course' },
  { text: 'Schedule Management', icon: <ScheduleSend />, id: 'schedule' },
  { text: 'Resource Management', icon: <Inventory />, id: 'resource' },
  { text: 'Leave Applications', icon: <BeachAccess />, id: 'leave' },
  { text: 'AI Analytics', icon: <Insights />, id: 'analytics' },
  { text: 'Student Management', icon: <Group />, id: 'student' },
  { text: 'Class Management', icon: <Class />, id: 'class' },
  { text: 'Settings', icon: <Settings />, id: 'settings' }
];

// Enhanced mock data
const dashboardData = {
  stats: [
    { 
      label: 'Total Teachers', 
      value: '156', 
      icon: <People />, 
      change: '+8%', 
      color: '#4361EE',
      trend: 'up',
      modal: 'teacher'
    },
    { 
      label: 'Active Courses', 
      value: '89', 
      icon: <Book />, 
      change: '+12', 
      color: '#7209B7',
      trend: 'up',
      modal: 'course'
    },
    { 
      label: 'Pending Leave Requests', 
      value: '23', 
      icon: <BeachAccess />, 
      change: '+5', 
      color: '#F72585',
      trend: 'up',
      modal: 'leave'
    },
    { 
      label: 'Resource Utilization', 
      value: '78%', 
      icon: <Inventory />, 
      change: '+12%', 
      color: '#4CC9F0',
      trend: 'up',
      modal: 'resource'
    },
    { 
      label: 'AI Predictions', 
      value: '94%', 
      icon: <Insights />, 
      change: '+2.4%', 
      color: '#3A0CA3',
      trend: 'up',
      modal: 'analytics'
    },
    { 
      label: 'Scheduled Classes', 
      value: '45', 
      icon: <ScheduleSend />, 
      change: 'Today', 
      color: '#00B4D8',
      trend: 'neutral',
      modal: 'schedule'
    }
  ],
  recentActivities: [
    { 
      action: 'New teacher registered', 
      details: 'Dr. Sarah Wilson - Computer Science', 
      time: '10 min ago', 
      type: 'teacher'
    },
    { 
      action: 'Course assigned', 
      details: 'Advanced Mathematics to Prof. Mike Johnson', 
      time: '1 hour ago', 
      type: 'course'
    },
    { 
      action: 'Leave application submitted', 
      details: 'Prof. Emily Davis - 3 days medical leave', 
      time: '2 hours ago', 
      type: 'leave'
    },
    { 
      action: 'Resource allocated', 
      details: 'Science Lab to Physics Department', 
      time: '3 hours ago', 
      type: 'resource'
    },
    { 
      action: 'AI alert generated', 
      details: 'Low attendance pattern detected in Grade 11', 
      time: '5 hours ago', 
      type: 'ai'
    }
  ]
};

// User Info Component
const UserInfoCard = ({ userData }) => (
  <Card sx={{ mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        >
          <BusinessCenter />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {userData?.fullName || 'Administrator'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            {userData?.organizationName || 'Educational Institution'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<BadgeIcon />}
              label={`Org ID: ${userData?.organizationId || 'N/A'}`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
            <Chip 
              icon={<School />}
              label={userData?.industry || 'Education'}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
            <Chip 
              icon={<Business />}
              label={`Size: ${userData?.organizationSize || 'N/A'}`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Sidebar Component
const Sidebar = ({ open, onClose, drawerWidth, activeItem, onMenuItemClick, userData }) => {
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #1e3a8a 0%, #3730a3 100%)',
          color: 'white',
          border: 'none',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1, fontSize: 32 }} />
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              EduAdmin Pro
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Management System
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      
      {/* User Info in Sidebar */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          borderRadius: 2, 
          p: 2,
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccountCircle sx={{ fontSize: 16, opacity: 0.8 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {userData?.fullName || 'Admin User'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessCenter sx={{ fontSize: 14, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
              {userData?.organizationName || 'Organization'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <BadgeIcon sx={{ fontSize: 14, opacity: 0.7 }} />
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
              ID: {userData?.organizationId || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      
      <List sx={{ mt: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              onClick={() => onMenuItemClick(item.id)}
              sx={{
                mx: 0.5,
                mb: 0.5,
                borderRadius: 2,
                backgroundColor: activeItem === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': { 
                    fontWeight: activeItem === item.id ? 600 : 400,
                    fontSize: '0.9rem'
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

// Stat Card Component
const StatCard = ({ stat, onClick }) => (
  <Card className="admin-stat-card" onClick={onClick}>
    <CardContent sx={{ p: 3 }}>
      <Box className="stat-header">
        <Box className="stat-icon" sx={{ backgroundColor: `${stat.color}20` }}>
          {React.cloneElement(stat.icon, { sx: { color: stat.color, fontSize: 24 } })}
        </Box>
        <Chip 
          label={stat.change} 
          size="small" 
          className="stat-change"
          sx={{ 
            backgroundColor: stat.trend === 'up' ? '#10b98120' : '#ef444420',
            color: stat.trend === 'up' ? '#10b981' : '#ef4444',
            fontWeight: 600,
          }}
        />
      </Box>
      <Typography variant="h4" className="stat-value">
        {stat.value}
      </Typography>
      <Typography variant="body2" className="stat-label">
        {stat.label}
      </Typography>
    </CardContent>
  </Card>
);

// Teacher Card Component
const TeacherCard = ({ teacher, onViewDetails }) => (
  <Card className="teacher-card" sx={{ height: '100%', transition: 'all 0.3s ease' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
        <Avatar
          sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}
          src={teacher.profilePicture}
        >
          {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {teacher.firstName} {teacher.lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {teacher.department}
          </Typography>
          <Chip 
            label={teacher.qualification} 
            size="small" 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            label={`${teacher.experience} yrs`} 
            size="small" 
            color="primary"
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            {teacher.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            {teacher.phone}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BadgeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.7rem', fontFamily: 'monospace' }}>
            {teacher.teacherId}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button 
          size="small" 
          variant="outlined"
          onClick={() => onViewDetails(teacher)}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          variant="contained"
          sx={{ flex: 1 }}
        >
          Edit
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// Teacher Details Modal Component
const TeacherDetailsModal = ({ teacher, open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Typography variant="h5">
        Teacher Details - {teacher.firstName} {teacher.lastName}
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              src={teacher.profilePicture}
            >
              {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
            </Avatar>
            <Chip 
              label={teacher.status || 'Active'} 
              color="success" 
              sx={{ mb: 2 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h6" gutterBottom>Personal Information</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Full Name</Typography>
              <Typography variant="body1">{teacher.firstName} {teacher.lastName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Gender</Typography>
              <Typography variant="body1">{teacher.gender}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
              <Typography variant="body1">{teacher.dateOfBirth}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Join Date</Typography>
              <Typography variant="body1">{teacher.joinDate}</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Professional Information</Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Department</Typography>
              <Chip label={teacher.department} size="small" color="primary" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Qualification</Typography>
              <Typography variant="body1">{teacher.qualification}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Specialization</Typography>
              <Typography variant="body1">{teacher.specialization}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Experience</Typography>
              <Typography variant="body1">{teacher.experience} years</Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">Email</Typography>
              <Typography variant="body1">{teacher.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{teacher.phone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Emergency Contact</Typography>
              <Typography variant="body1">{teacher.emergencyContact}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Teacher ID
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {teacher.teacherId}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained">Edit Teacher</Button>
    </DialogActions>
  </Dialog>
);

// Main Admin Dashboard Component
const EducationDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userMenu, setUserMenu] = useState(null);
  const [notificationMenu, setNotificationMenu] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // State for different modals
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);

  // Teacher Management State
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const drawerWidth = 280;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user data from localStorage or context
        const storedUserData = localStorage.getItem('lastOrganizationCredentials');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          console.log('✅ User data loaded:', parsedData);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch teachers from Firestore - UPDATED
  const fetchTeachersFromFirestore = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching teachers from Firestore...');
      
      // Get the current organization ID from user data
      const currentOrgId = userData?.organizationId;
      
      if (!currentOrgId) {
        console.log('❌ No organization ID found');
        setTeachers([]);
        return;
      }

      console.log('🏢 Fetching teachers for organization:', currentOrgId);

      // Query teachers collection for the current organization
      const teachersQuery = query(
        collection(db, 'teachers'),
        where('organizationId', '==', currentOrgId)
      );

      const teachersSnapshot = await getDocs(teachersQuery);
      
      console.log(`📊 Found ${teachersSnapshot.size} teachers in Firestore`);

      const teachersData = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('✅ Teachers data from Firestore:', teachersData);
      setTeachers(teachersData);

    } catch (error) {
      console.error('❌ Error fetching teachers from Firestore:', error);
      setError('Failed to load teachers data');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teachers when user data is available
  useEffect(() => {
    if (userData?.organizationId) {
      fetchTeachersFromFirestore();
    }
  }, [userData]);

  // Refresh teachers when modal closes
  useEffect(() => {
    if (!teacherModalOpen && userData?.organizationId) {
      fetchTeachersFromFirestore();
    }
  }, [teacherModalOpen, userData]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sidebar menu item clicks
  const handleMenuItemClick = (menuId) => {
    setActiveItem(menuId);
    
    // Open corresponding modal based on menu item
    switch(menuId) {
      case 'teacher':
        setTeacherModalOpen(true);
        break;
      case 'course':
        setCourseModalOpen(true);
        break;
      case 'schedule':
        setScheduleModalOpen(true);
        break;
      case 'resource':
        setResourceModalOpen(true);
        break;
      case 'leave':
        setLeaveModalOpen(true);
        break;
      case 'analytics':
        setAnalyticsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleStatClick = (stat) => {
    switch(stat.modal) {
      case 'teacher':
        setTeacherModalOpen(true);
        break;
      case 'course':
        setCourseModalOpen(true);
        break;
      case 'schedule':
        setScheduleModalOpen(true);
        break;
      case 'resource':
        setResourceModalOpen(true);
        break;
      case 'leave':
        setLeaveModalOpen(true);
        break;
      case 'analytics':
        setAnalyticsModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Enhanced Teacher Management Content
  const renderTeacherManagementContent = () => {
    const departments = [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'English Literature',
      'History & Social Studies',
      'Economics & Business',
      'Arts & Music',
      'Physical Education',
      'Languages',
      'Special Education'
    ];

    // Filter teachers based on search and department
    const filteredTeachers = teachers.filter(teacher => {
      const matchesSearch = teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || teacher.department === filterDepartment;
      
      return matchesSearch && matchesDepartment;
    });

    return (
      <>
        {/* User Info Card */}
        <UserInfoCard userData={userData} />
        
        <Card sx={{ p: 3 }}>
          {/* Header with Stats and Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Teacher Management
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {loading ? 'Loading...' : `${teachers.length} teachers in ${userData?.organizationName}`}
              </Typography>
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                onClick={fetchTeachersFromFirestore}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<PersonAdd />}
                onClick={() => setTeacherModalOpen(true)}
                size="large"
              >
                Add New Teacher
              </Button>
            </Box>
          </Box>

          {/* Stats Overview */}
          {!loading && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50' }}>
                  <Typography variant="h4" color="primary.main">
                    {teachers.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Teachers
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.50' }}>
                  <Typography variant="h4" color="secondary.main">
                    {new Set(teachers.map(t => t.department)).size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Departments
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50' }}>
                  <Typography variant="h4" color="success.main">
                    {Math.round(teachers.reduce((acc, t) => acc + parseInt(t.experience || 0), 0) / teachers.length) || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Avg. Experience
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50' }}>
                  <Typography variant="h4" color="warning.main">
                    {teachers.filter(t => t.qualification === 'PhD').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    PhD Holders
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Loading State */}
          {loading && (
            <Card sx={{ textAlign: 'center', p: 6 }}>
              <Typography variant="h6" gutterBottom>
                Loading Teachers...
              </Typography>
              <LinearProgress sx={{ mt: 2 }} />
            </Card>
          )}

          {/* Teachers Content */}
          {!loading && (
            <>
              {/* Filters and Search */}
              <Card sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search teachers by name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={filterDepartment}
                        label="Department"
                        onChange={(e) => setFilterDepartment(e.target.value)}
                      >
                        <MenuItem value="all">All Departments</MenuItem>
                        {departments.map(dept => (
                          <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('grid')}
                        startIcon={<Dashboard />}
                      >
                        Grid
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('list')}
                        startIcon={<ViewList />}
                      >
                        List
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Teachers Grid/List */}
              {filteredTeachers.length === 0 ? (
                <Card sx={{ textAlign: 'center', p: 6 }}>
                  <People sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Teachers Found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {searchTerm || filterDepartment !== 'all' 
                      ? 'Try adjusting your search criteria' 
                      : 'Get started by adding your first teacher'
                    }
                  </Typography>
                  {!searchTerm && filterDepartment === 'all' && (
                    <Button 
                      variant="contained" 
                      startIcon={<PersonAdd />}
                      onClick={() => setTeacherModalOpen(true)}
                    >
                      Add First Teacher
                    </Button>
                  )}
                </Card>
              ) : viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {filteredTeachers.map((teacher, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.teacherId || index}>
                      <TeacherCard 
                        teacher={teacher} 
                        onViewDetails={setSelectedTeacher}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <TableContainer component={Card}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Qualification</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.teacherId}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={teacher.profilePicture}>
                                {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {teacher.firstName} {teacher.lastName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {teacher.teacherId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={teacher.department} size="small" />
                          </TableCell>
                          <TableCell>{teacher.qualification}</TableCell>
                          <TableCell>{teacher.experience} years</TableCell>
                          <TableCell>
                            <Typography variant="body2">{teacher.email}</Typography>
                            <Typography variant="caption">{teacher.phone}</Typography>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="small" 
                              onClick={() => setSelectedTeacher(teacher)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Card>

        {/* Teacher Details Modal */}
        {selectedTeacher && (
          <TeacherDetailsModal
            teacher={selectedTeacher}
            open={!!selectedTeacher}
            onClose={() => setSelectedTeacher(null)}
          />
        )}
      </>
    );
  };

  // Other content rendering functions (simplified for brevity)
  const renderDashboardContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Dashboard content...</Typography>
    </>
  );

  const renderCourseManagementContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Course management content...</Typography>
    </>
  );

  const renderScheduleManagementContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Schedule management content...</Typography>
    </>
  );

  const renderResourceManagementContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Resource management content...</Typography>
    </>
  );

  const renderLeaveManagementContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Leave management content...</Typography>
    </>
  );

  const renderAnalyticsContent = () => (
    <>
      <UserInfoCard userData={userData} />
      <Typography>Analytics content...</Typography>
    </>
  );

  // Render different content based on active sidebar item
  const renderMainContent = () => {
    switch(activeItem) {
      case 'dashboard':
        return renderDashboardContent();
      case 'teacher':
        return renderTeacherManagementContent();
      case 'course':
        return renderCourseManagementContent();
      case 'schedule':
        return renderScheduleManagementContent();
      case 'resource':
        return renderResourceManagementContent();
      case 'leave':
        return renderLeaveManagementContent();
      case 'analytics':
        return renderAnalyticsContent();
      default:
        return renderDashboardContent();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      {!isMobile && (
        <Sidebar 
          open={sidebarOpen} 
          onClose={handleSidebarToggle} 
          drawerWidth={drawerWidth}
          activeItem={activeItem}
          onMenuItemClick={handleMenuItemClick}
          userData={userData}
        />
      )}

      {/* Main Content */}
      <Box 
        component="main" 
        className="admin-main-content"
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 0}px)` },
        }}
      >
        {/* Top Bar */}
        <AppBar 
          position="static" 
          elevation={0}
          className="admin-top-bar"
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleSidebarToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {menuItems.find(item => item.id === activeItem)?.text || 'Admin Dashboard'}
            </Typography>

            {/* User Organization Info */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, mr: 2 }}>
              <BusinessCenter sx={{ fontSize: 20, opacity: 0.8 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1 }}>
                  {userData?.organizationName || 'Organization'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                  ID: {userData?.organizationId || 'N/A'}
                </Typography>
              </Box>
            </Box>

            {/* Notifications */}
            <IconButton 
              color="inherit"
              onClick={(e) => setNotificationMenu(e.currentTarget)}
            >
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* User Menu */}
            <IconButton
              color="inherit"
              onClick={(e) => setUserMenu(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <AccountCircle />
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {userData?.fullName || 'Admin'}
              </Typography>
            </IconButton>

            <Menu
              anchorEl={userMenu}
              open={Boolean(userMenu)}
              onClose={() => setUserMenu(null)}
            >
              <MenuItem onClick={() => setUserMenu(null)}>
                <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={() => setUserMenu(null)}>
                <ListItemIcon><BusinessCenter fontSize="small" /></ListItemIcon>
                Organization: {userData?.organizationName || 'N/A'}
              </MenuItem>
              <MenuItem onClick={() => setUserMenu(null)}>
                <ListItemIcon><BadgeIcon fontSize="small" /></ListItemIcon>
                ID: {userData?.organizationId || 'N/A'}
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setUserMenu(null)}>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                Settings
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box className="admin-dashboard">
          {renderMainContent()}
        </Box>
      </Box>

      {/* Modals */}
      <AddingTeacherForm open={teacherModalOpen} onClose={() => setTeacherModalOpen(false)} />
      <AddingCoursesForm open={courseModalOpen} onClose={() => setCourseModalOpen(false)} />
      <SchoolScheduleForm open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} />
      <SchoolResoursesForm open={resourceModalOpen} onClose={() => setResourceModalOpen(false)} />
      <SchoolLeaveForm open={leaveModalOpen} onClose={() => setLeaveModalOpen(false)} />
    </Box>
  );
};

export default EducationDashboard;