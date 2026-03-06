import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  TextField,
  InputAdornment,
  IconButton,
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Divider,
  LinearProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  AppBar,
  ListItemButton,
  Collapse,
  Container
} from '@mui/material';
import {
  LocalHospital,
  People,
  MedicalServices,
  Apartment,
  Payment,
  Dashboard,
  CalendarToday,
  Settings,
  Search,
  NotificationsNone,
  ArrowUpward,
  ArrowDownward,
  PersonAdd,
  Edit,
  Delete,
  Visibility,
  Email,
  Phone,
  Bed,
  Group,
  CleaningServices,
  Schedule,
  MonitorHeart,
  Favorite,
  Psychology,
  Vaccines,
  Bloodtype,
  Height,
  FitnessCenter,
  Male,
  Female,
  Transgender,
  AccountCircle,
  ExitToApp,
  Menu,
  VideoCall,
  Chat,
  Assignment,
  Analytics,
  SmartToy,
  History,
  Emergency,
  Allergy,
  Business,
  Security,
  Star,
  TrendingUp,
  TrendingDown,
  AccessTime,
  CheckCircle,
  Warning,
  Add,
  Notifications,
  Home,
  DateRange,
  Medication,
  Schedule as ScheduleIcon,
  Insights,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/health/HealthcareDashboard.css';
import AddingPatientForm from '../../Forms/AddingPatientForm';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// Color Scheme - Professional Healthcare Theme
const colors = {
  primary: '#2E8B57', // Sea Green - Professional healthcare
  secondary: '#4682B4', // Steel Blue
  accent: '#FF6B35',   // Coral Orange
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#F8F9FA',
  sidebar: '#1A3C34', // Dark green for sidebar
  sidebarHover: '#2A4C44',
  header: '#2E8B57',
  card: '#FFFFFF'
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, subtitle, trend, color, icon, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      borderLeft: `4px solid ${color}`,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      background: colors.card,
      '&:hover': {
        transform: onClick ? 'translateY(-4px)' : 'none',
        boxShadow: onClick ? '0 8px 25px rgba(0,0,0,0.15)' : 'none'
      }
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box flex={1}>
          <Typography variant="body2" color="text.secondary" fontWeight="600">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="800" sx={{ 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            my: 1
          }}>
            {value}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {trend === 'down' && <TrendingDown sx={{ color: colors.error, fontSize: 16 }} />}
            {trend === 'up' && <TrendingUp sx={{ color: colors.success, fontSize: 16 }} />}
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ color: color, ml: 1 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// ECG Chart Component
const ECGChart = ({ data = [] }) => {
  const defaultData = Array.from({ length: 100 }, (_, i) => ({
    time: i * 0.1,
    value: Math.sin(i * 0.3) * 2 + Math.random() * 0.5
  }));

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorHeart color="error" />
          Real-time ECG Monitor
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <RechartsTooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors.error} 
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Chip label="Normal Rhythm" color="success" size="small" />
          <Typography variant="caption" color="text.secondary">
            Heart Rate: 72 BPM
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Organ Health Monitor Component
const OrganHealthMonitor = () => {
  const organsData = [
    { organ: 'Heart', health: 95, status: 'Excellent', color: colors.error },
    { organ: 'Lungs', health: 87, status: 'Good', color: colors.info },
    { organ: 'Liver', health: 92, status: 'Excellent', color: colors.warning },
    { organ: 'Kidneys', health: 78, status: 'Fair', color: colors.primary },
    { organ: 'Brain', health: 96, status: 'Excellent', color: colors.secondary },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Favorite color="error" />
          Organ Health Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {organsData.map((organ, index) => (
            <Box key={organ.organ}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight="600">
                  {organ.organ}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {organ.health}%
                  </Typography>
                  <Chip 
                    label={organ.status} 
                    size="small" 
                    color={
                      organ.status === 'Excellent' ? 'success' : 
                      organ.status === 'Good' ? 'primary' : 'warning'
                    }
                  />
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={organ.health} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: organ.color,
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Patient Vital Signs Component
const PatientVitalSigns = () => {
  const vitals = [
    { parameter: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', trend: 'stable' },
    { parameter: 'Heart Rate', value: '72', unit: 'BPM', status: 'Normal', trend: 'stable' },
    { parameter: 'Oxygen Saturation', value: '98', unit: '%', status: 'Excellent', trend: 'up' },
    { parameter: 'Temperature', value: '98.6', unit: '°F', status: 'Normal', trend: 'stable' },
    { parameter: 'Respiratory Rate', value: '16', unit: '/min', status: 'Normal', trend: 'stable' },
    { parameter: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'Normal', trend: 'stable' },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorHeart color="primary" />
          Vital Signs Monitor
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {vitals.map((vital, index) => (
            <Grid item xs={6} key={vital.parameter}>
              <Paper sx={{ p: 2, textAlign: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
                <Typography variant="h4" fontWeight="800" color={colors.primary}>
                  {vital.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {vital.parameter}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {vital.unit}
                </Typography>
                <Chip 
                  label={vital.status} 
                  size="small" 
                  color={
                    vital.status === 'Excellent' ? 'success' : 
                    vital.status === 'Normal' ? 'primary' : 'warning'
                  }
                  sx={{ mt: 0.5 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Sidebar Navigation Component
const Sidebar = ({ open, onClose, activeTab, setActiveTab, doctorData, onAddPatient }) => {
  const [openSubmenu, setOpenSubmenu] = useState({});

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <Dashboard />,
      badge: 0
    },
    { 
      id: 'patients', 
      label: 'Patients', 
      icon: <Group />,
      subItems: [
        { id: 'all-patients', label: 'All Patients' },
        { id: 'new-patient', label: 'Add New Patient' },
        { id: 'patient-groups', label: 'Patient Groups' }
      ]
    },
    { 
      id: 'appointments', 
      label: 'Appointments', 
      icon: <CalendarToday />,
      badge: 3
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: <Assignment />,
      subItems: [
        { id: 'all-prescriptions', label: 'All Prescriptions' },
        { id: 'new-prescription', label: 'Add Prescription' },
        { id: 'medications', label: 'Medications List' }
      ]
    },
    { 
      id: 'medical-records', 
      label: 'Medical Records', 
      icon: <History />
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <Analytics />,
      subItems: [
        { id: 'reports', label: 'Reports' },
        { id: 'insights', label: 'AI Insights' },
        { id: 'performance', label: 'Performance' }
      ]
    },
    { 
      id: 'telemedicine', 
      label: 'Telemedicine', 
      icon: <VideoCall />,
      badge: 2
    }
  ];

  const handleSubmenuToggle = (menuId) => {
    setOpenSubmenu(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleMenuItemClick = (itemId) => {
    console.log('🩺 Sidebar - Menu item clicked:', itemId);
    
    if (itemId === 'new-patient') {
      console.log('🩺 Sidebar - Opening patient form from menu');
      onAddPatient();
      onClose();
    } else {
      setActiveTab(itemId);
      onClose();
    }
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: colors.sidebar,
          color: 'white',
          border: 'none'
        },
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: `1px solid ${colors.sidebarHover}` }}>
        <LocalHospital sx={{ fontSize: 40, color: colors.accent, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="white">
          MEDCARE PRO
        </Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.7)">
          Doctor Dashboard
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <Box key={item.id}>
            <ListItemButton
              onClick={() => {
                if (item.subItems) {
                  handleSubmenuToggle(item.id);
                } else {
                  handleMenuItemClick(item.id);
                }
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: activeTab === item.id ? colors.primary : 'transparent',
                '&:hover': {
                  backgroundColor: colors.sidebarHover,
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
              {item.badge > 0 && (
                <Badge badgeContent={item.badge} color="error" sx={{ mr: 1 }} />
              )}
              {item.subItems && (
                openSubmenu[item.id] ? <ExpandLess /> : <ExpandMore />
              )}
            </ListItemButton>

            {item.subItems && (
              <Collapse in={openSubmenu[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton
                      key={subItem.id}
                      onClick={() => handleMenuItemClick(subItem.id)}
                      sx={{
                        pl: 4,
                        borderRadius: 2,
                        mb: 0.5,
                        backgroundColor: activeTab === subItem.id ? colors.primary : 'transparent',
                        '&:hover': {
                          backgroundColor: colors.sidebarHover,
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.label}
                        primaryTypographyProps={{ fontSize: '0.85rem' }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>

      <Divider sx={{ borderColor: colors.sidebarHover, my: 2 }} />

      {/* Bottom Menu Items */}
      <List sx={{ px: 1 }}>
        <ListItemButton sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>

      {/* Doctor Profile Section */}
      <Box sx={{ p: 2, mt: 'auto', borderTop: `1px solid ${colors.sidebarHover}` }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: colors.accent }}>
            <AccountCircle />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold" color="white">
              {doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : 'Loading...'}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)">
              {doctorData?.specialization || 'Doctor'}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block' }}>
              ID: {doctorData?.doctorId || 'N/A'}
            </Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block' }}>
              Org ID: {doctorData?.organizationId || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

// AI Recommendations Component
const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([
    { id: 1, type: 'alert', message: '3 patients need follow-up consultation', priority: 'high' },
    { id: 2, type: 'insight', message: 'Higher readmission rate in cardiology department', priority: 'medium' },
    { id: 3, type: 'reminder', message: 'Schedule seasonal flu vaccination campaign', priority: 'low' }
  ]);

  return (
    <Card sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
      color: 'white' 
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <SmartToy sx={{ mr: 1 }} />
          <Typography variant="h6">AI Insights & Recommendations</Typography>
        </Box>
        <List dense>
          {recommendations.map((rec) => (
            <ListItem key={rec.id}>
              <ListItemIcon>
                <Warning sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText 
                primary={rec.message}
                secondary={
                  <Chip 
                    label={rec.priority} 
                    size="small" 
                    color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'default'}
                    sx={{ color: 'white', mt: 0.5 }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
        <Button 
          variant="outlined" 
          sx={{ color: 'white', borderColor: 'white', mt: 2 }}
          startIcon={<Analytics />}
        >
          View Detailed Analysis
        </Button>
      </CardContent>
    </Card>
  );
};

// Quick Actions Component
const QuickActions = ({ onAddPatient, onAddPrescription }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={() => {
              console.log('🩺 QuickActions - Add Patient button clicked');
              onAddPatient();
            }}
            size="small"
            sx={{ 
              py: 1,
              background: colors.primary,
              '&:hover': { background: '#26734d' }
            }}
          >
            Add Patient
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<Assignment />}
            onClick={onAddPrescription}
            size="small"
            sx={{ 
              py: 1,
              borderColor: colors.primary,
              color: colors.primary,
            }}
          >
            Add Prescription
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<VideoCall />}
            size="small"
            sx={{ py: 1 }}
          >
            Video Consult
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<Chat />}
            size="small"
            sx={{ py: 1 }}
          >
            Message
          </Button>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

// Main Doctor Dashboard Component
const DoctorDashboard = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [addPrescriptionOpen, setAddPrescriptionOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  console.log('🩺 DoctorDashboard - Component mounted');
  console.log('🩺 DoctorDashboard - User Data from Auth:', userData);
  console.log('🩺 DoctorDashboard - Active Tab:', activeTab);
  console.log('🩺 DoctorDashboard - Add Patient Form Open:', addPatientOpen);

  // Fetch doctor and patient data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🩺 DoctorDashboard - Starting data fetch...');
        setLoading(true);
        
        // Use the authenticated user data directly
        const currentUserData = userData;
        console.log('🩺 DoctorDashboard - Current User Data:', currentUserData);
        
        if (!currentUserData) {
          console.error('🩺 DoctorDashboard - No user data found');
          setLoading(false);
          return;
        }

        // Create doctor data from authenticated user
        const doctorData = {
          id: currentUserData.uid || 'demo-doctor-id',
          firstName: currentUserData.firstName || 'John',
          lastName: currentUserData.lastName || 'Smith',
          specialization: currentUserData.specialization || 'Cardiologist',
          doctorId: currentUserData.doctorId || 'DOC001',
          organizationId: currentUserData.organizationId || 'ORG_DRQRLPVDM',
          email: currentUserData.email || 'doctor@hospital.com',
          phone: currentUserData.phone || '+1234567890'
        };
        
        console.log('🩺 DoctorDashboard - Setting doctor data:', doctorData);
        setDoctorData(doctorData);
        
        // Create organization data
        const orgData = {
          id: currentUserData.organizationId || 'ORG_DRQRLPVDM',
          name: 'City General Hospital',
          address: '123 Medical Center Dr, Healthcare City',
          phone: '+1234567890'
        };
        console.log('🩺 DoctorDashboard - Setting organization data:', orgData);
        setOrganizationData(orgData);
        
        // Fetch patients data
        console.log('🩺 DoctorDashboard - Setting up patients listener for doctor:', doctorData.id);
        const patientsQuery = query(
          collection(db, 'patients'),
          where('doctorId', '==', doctorData.id)
        );
        
        const unsubscribe = onSnapshot(patientsQuery, (querySnapshot) => {
          const patientsData = [];
          querySnapshot.forEach((doc) => {
            patientsData.push({ id: doc.id, ...doc.data() });
          });
          console.log('🩺 DoctorDashboard - Patients data updated:', patientsData.length, 'patients');
          setPatients(patientsData);
          setLoading(false);
        }, (error) => {
          console.error('🩺 DoctorDashboard - Error in patients listener:', error);
          // Set demo patients for testing
          const demoPatients = [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              status: 'active',
              chronicConditions: ['Hypertension', 'Diabetes']
            },
            {
              id: '2', 
              firstName: 'Jane',
              lastName: 'Smith',
              status: 'active',
              chronicConditions: ['Asthma']
            }
          ];
          setPatients(demoPatients);
          setLoading(false);
        });

        return () => {
          console.log('🩺 DoctorDashboard - Cleaning up patients listener');
          unsubscribe();
        };
      } catch (error) {
        console.error('🩺 DoctorDashboard - Error fetching data:', error);
        setLoading(false);
      }
    };

    if (userData) {
      fetchData();
    }
  }, [userData]);

  // Handle patient form opening
  const handleAddPatient = () => {
    console.log('🩺 DoctorDashboard - Opening patient form');
    console.log('🩺 DoctorDashboard - Doctor data available:', !!doctorData);
    console.log('🩺 DoctorDashboard - Organization data available:', !!organizationData);
    setAddPatientOpen(true);
  };

  // Effect to open patient form when activeTab is 'new-patient'
  useEffect(() => {
    if (activeTab === 'new-patient') {
      console.log('🩺 DoctorDashboard - Active tab is new-patient, opening form');
      handleAddPatient();
      // Reset active tab to avoid reopening form on re-render
      setActiveTab('patients');
    }
  }, [activeTab]);

  // Chart data based on real patient data
  const getChartData = () => {
    if (patients.length === 0) {
      console.log('🩺 DoctorDashboard - No patients found, using demo chart data');
      return {
        patientTrend: [
          { month: 'Jan', patients: 12, consultations: 18 },
          { month: 'Feb', patients: 15, consultations: 22 },
          { month: 'Mar', patients: 18, consultations: 25 },
          { month: 'Apr', patients: 14, consultations: 20 },
          { month: 'May', patients: 20, consultations: 28 },
          { month: 'Jun', patients: 22, consultations: 30 }
        ],
        conditionDistribution: [
          { condition: 'Hypertension', patients: 8 },
          { condition: 'Diabetes', patients: 6 },
          { condition: 'Arthritis', patients: 4 },
          { condition: 'Asthma', patients: 3 },
          { condition: 'Other', patients: 5 }
        ]
      };
    }

    console.log('🩺 DoctorDashboard - Generating chart data from', patients.length, 'patients');
    // Calculate actual data from patients
    const conditionCount = patients.reduce((acc, patient) => {
      const conditions = patient.chronicConditions || [];
      conditions.forEach(condition => {
        acc[condition] = (acc[condition] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      patientTrend: [
        { month: 'Jan', patients: Math.floor(patients.length * 0.6), consultations: Math.floor(patients.length * 0.9) },
        { month: 'Feb', patients: Math.floor(patients.length * 0.7), consultations: Math.floor(patients.length * 1.0) },
        { month: 'Mar', patients: Math.floor(patients.length * 0.8), consultations: Math.floor(patients.length * 1.1) },
        { month: 'Apr', patients: Math.floor(patients.length * 0.75), consultations: Math.floor(patients.length * 1.05) },
        { month: 'May', patients: patients.length, consultations: Math.floor(patients.length * 1.3) },
        { month: 'Jun', patients: Math.floor(patients.length * 1.1), consultations: Math.floor(patients.length * 1.4) }
      ],
      conditionDistribution: Object.entries(conditionCount).map(([condition, patients]) => ({
        condition,
        patients
      }))
    };
  };

  const chartData = getChartData();

  const renderDashboardContent = () => (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Organization and Doctor Info */}
      <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight="bold" color={colors.primary}>
                {organizationData?.name || 'Medical Organization'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {organizationData?.address || 'Healthcare Facility'}
              </Typography>
              <Chip 
                label={`Organization ID: ${organizationData?.id || 'N/A'}`} 
                variant="outlined" 
                size="small" 
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Logged in as Doctor: {userData?.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                <Avatar sx={{ bgcolor: colors.accent, width: 60, height: 60 }}>
                  <AccountCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : 'Loading...'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctorData?.specialization || 'Medical Specialist'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Doctor ID: {doctorData?.doctorId || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Organization ID: {doctorData?.organizationId || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Patients"
            value={patients.length.toString()}
            subtitle={`Active: ${patients.filter(p => p.status === 'active').length}`}
            trend="up"
            color={colors.primary}
            icon={<People />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Appointments"
            value="8"
            subtitle="3 completed, 5 pending"
            trend="stable"
            color={colors.accent}
            icon={<CalendarToday />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Prescriptions"
            value="24"
            subtitle="This month"
            trend="up"
            color={colors.secondary}
            icon={<Medication />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Patient Satisfaction"
            value="96%"
            subtitle="+2% from last month"
            trend="up"
            color={colors.success}
            icon={<Star />}
          />
        </Grid>
      </Grid>

      {/* Medical Monitoring Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ECGChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <OrganHealthMonitor />
        </Grid>
        <Grid item xs={12} md={4}>
          <PatientVitalSigns />
        </Grid>
      </Grid>

      {/* Charts and Analytics Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Trends & Consultations
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.patientTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="patients" stroke={colors.primary} strokeWidth={3} />
                      <Line type="monotone" dataKey="consultations" stroke={colors.accent} strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Condition Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.conditionDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="condition" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="patients" fill={colors.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AIRecommendations />
            </Grid>
            <Grid item xs={12}>
              <QuickActions 
                onAddPatient={handleAddPatient}
                onAddPrescription={() => setAddPrescriptionOpen(true)}
              />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Today's Appointments
                  </Typography>
                  <List>
                    {[
                      { time: '09:00 AM', patient: 'John Smith', type: 'Follow-up', status: 'confirmed' },
                      { time: '10:30 AM', patient: 'Emma Davis', type: 'New Patient', status: 'confirmed' },
                      { time: '02:15 PM', patient: 'Robert Brown', type: 'Consultation', status: 'pending' },
                      { time: '04:00 PM', patient: 'Sarah Johnson', type: 'Check-up', status: 'confirmed' }
                    ].map((appt, index) => (
                      <ListItem key={index} divider>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: colors.primary, width: 32, height: 32 }}>
                            {appt.patient.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={appt.patient}
                          secondary={`${appt.time} • ${appt.type}`}
                        />
                        <Chip label={appt.status} size="small" color={appt.status === 'confirmed' ? 'success' : 'warning'} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ background: colors.header }}>
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => {
                console.log('🩺 DoctorDashboard - Opening sidebar');
                setSidebarOpen(true);
              }}
              edge="start"
              sx={{ mr: 2 }}
            >
              <Menu />
            </IconButton>
            <LocalHospital sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" fontWeight="bold">
              MEDCARE PRO
            </Typography>
          </Box>
          
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Doctor Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Search">
              <IconButton color="inherit">
                <Search />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar sx={{ ml: 1, bgcolor: colors.accent, width: 32, height: 32 }}>
              {doctorData ? `${doctorData.firstName?.[0]}${doctorData.lastName?.[0]}` : 'DR'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => {
          console.log('🩺 DoctorDashboard - Closing sidebar');
          setSidebarOpen(false);
        }} 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          console.log('🩺 DoctorDashboard - Setting active tab to:', tab);
          setActiveTab(tab);
        }}
        doctorData={doctorData}
        onAddPatient={handleAddPatient}
      />

      {/* Main Content */}
      <Box sx={{ ml: isMobile ? 0 : '20px', transition: 'margin 0.3s ease' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading Doctor Dashboard...
            </Typography>
          </Box>
        ) : (
          renderDashboardContent()
        )}
      </Box>

      {/* Patient Form Dialog */}
      <AddingPatientForm 
        open={addPatientOpen} 
        onClose={() => {
          console.log('🩺 DoctorDashboard - Closing patient form');
          setAddPatientOpen(false);
        }}
        doctorData={doctorData}
        organizationData={organizationData}
      />

      {/* Add Prescription Dialog */}
      <AddPrescriptionDialog open={addPrescriptionOpen} onClose={() => setAddPrescriptionOpen(false)} />
    </Box>
  );
};

// Add Prescription Dialog Component
const AddPrescriptionDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>Add New Prescription</DialogTitle>
    <DialogContent>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Patient</InputLabel>
            <Select label="Select Patient">
              <MenuItem value="1">John Smith</MenuItem>
              <MenuItem value="2">Sarah Johnson</MenuItem>
              <MenuItem value="3">Mike Wilson</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Medication Name" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Dosage" variant="outlined" />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Instructions" multiline rows={3} variant="outlined" />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="contained" sx={{ background: colors.primary }} onClick={onClose}>
        Save Prescription
      </Button>
    </DialogActions>
  </Dialog>
);

export default DoctorDashboard;