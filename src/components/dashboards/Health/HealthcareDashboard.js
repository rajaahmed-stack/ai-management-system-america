import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Avatar, Chip,
  List, ListItem, ListItemIcon, ListItemText, Drawer, Toolbar,
  TextField, InputAdornment, IconButton, Badge, Button,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Skeleton,
  Fade, Zoom, Paper, useMediaQuery, useTheme, Divider, Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  LocalHospital, People, MedicalServices, Apartment, Payment,
  Dashboard, CalendarToday, Settings, Search, NotificationsNone,
  ArrowUpward, ArrowDownward, PersonAdd, Edit, Delete, Visibility,
  Email, Phone, Bed, Group, Logout, Menu as MenuIcon,
  TrendingUp, MoreVert, FilterList, Refresh, Star,
  AccessTime, CheckCircle, Schedule, KeyboardArrowRight,
} from '@mui/icons-material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  Legend, PieChart, Pie, Cell, Sector, CartesianGrid, AreaChart, Area,
  LineChart, Line,
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import AddingDoctorForm from '../../Forms/AddingDoctorForm';
import AddingNurseForm from '../../Forms/AddingNurseForm';
import AddingHospStaffForm from '../../Forms/AddingHospStaffForm';
import AddingWardForm from '../../Forms/AddingWardForm';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import '../../../styles/health/HealthcareDashboard.css';

// ─── Theme Palette ────────────────────────────────────────────────────────────
const PALETTE = {
  primary:   '#6C63FF',
  secondary: '#48CAE4',
  success:   '#06D6A0',
  warning:   '#FFB347',
  danger:    '#FF6B6B',
  purple:    '#A855F7',
  pink:      '#EC4899',
  dark:      '#0F172A',
  surface:   '#1E293B',
  glass:     'rgba(255,255,255,0.06)',
};

const GRADIENTS = {
  primary:  'linear-gradient(135deg, #6C63FF 0%, #48CAE4 100%)',
  success:  'linear-gradient(135deg, #06D6A0 0%, #0CB8A9 100%)',
  warning:  'linear-gradient(135deg, #FFB347 0%, #FF8C42 100%)',
  danger:   'linear-gradient(135deg, #FF6B6B 0%, #EE0979 100%)',
  purple:   'linear-gradient(135deg, #A855F7 0%, #6C63FF 100%)',
  sidebar:  'linear-gradient(180deg, #0F172A 0%, #1a1040 50%, #0F172A 100%)',
  header:   'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(72,202,228,0.06) 100%)',
};

// ─── StatCard ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, trend, icon, gradient, subtitle, delay }) => (
  <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
    <Box className="stat-card-wrapper">
      <Card className="stat-card">
        <CardContent className="stat-card-content">
          <Box className="stat-icon-orb" style={{ background: gradient }}>
            {React.cloneElement(icon, { className: 'stat-icon', style: { color: '#fff' } })}
            <Box className="orb-ripple" style={{ background: gradient }} />
          </Box>
          <Box className="stat-body">
            <Typography className="stat-label">{title}</Typography>
            <Typography className="stat-number">{value}</Typography>
            {subtitle && <Typography className="stat-subtitle">{subtitle}</Typography>}
          </Box>
          <Box className={`stat-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? <ArrowUpward sx={{ fontSize: 12 }} /> : <ArrowDownward sx={{ fontSize: 12 }} />}
            <span>{Math.abs(trend)}%</span>
          </Box>
          <Box className="stat-bottom-bar" style={{ background: gradient }} />
        </CardContent>
      </Card>
    </Box>
  </Fade>
);

// ─── Active Pie Shape ─────────────────────────────────────────────────────────
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={700}>
        {payload.value}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={13}>
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={4} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16}
        startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.5} />
    </g>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box className="custom-tooltip">
      <Typography className="tooltip-label">{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} className="tooltip-row">
          <Box className="tooltip-dot" style={{ backgroundColor: p.color }} />
          <Typography className="tooltip-text">{p.name}: <strong>{p.value}</strong></Typography>
        </Box>
      ))}
    </Box>
  );
};

// ─── Recent Activity Item ─────────────────────────────────────────────────────
const ActivityItem = ({ avatar, name, action, time, color, delay }) => (
  <Fade in timeout={400} style={{ transitionDelay: `${delay}ms` }}>
    <Box className="activity-item">
      <Avatar className="activity-avatar" style={{ background: color }}>{avatar}</Avatar>
      <Box className="activity-content">
        <Typography className="activity-name">{name}</Typography>
        <Typography className="activity-action">{action}</Typography>
      </Box>
      <Box className="activity-time">
        <AccessTime sx={{ fontSize: 12, mr: 0.4 }} />
        <Typography className="activity-time-text">{time}</Typography>
      </Box>
    </Box>
  </Fade>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────
const QuickAction = ({ icon, label, gradient, onClick }) => (
  <Box className="quick-action" onClick={onClick}>
    <Box className="quick-action-icon" style={{ background: gradient }}>
      {icon}
    </Box>
    <Typography className="quick-action-label">{label}</Typography>
    <KeyboardArrowRight className="quick-action-arrow" />
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const HealthcareDashboard = () => {
  const { userData, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeNav, setActiveNav] = useState('dashboard');
  const [doctorFormOpen, setDoctorFormOpen] = useState(false);
  const [nurseFormOpen, setNurseFormOpen] = useState(false);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [wardFormOpen, setWardFormOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewType, setViewType] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard',   label: 'Dashboard',   icon: <Dashboard />,     gradient: GRADIENTS.primary },
    { id: 'doctors',     label: 'Doctors',     icon: <MedicalServices />, gradient: GRADIENTS.success },
    { id: 'nurses',      label: 'Nurses',      icon: <LocalHospital />,  gradient: GRADIENTS.warning },
    { id: 'staff',       label: 'Other Staff', icon: <Group />,          gradient: GRADIENTS.purple },
    { id: 'wards',       label: 'Wards',       icon: <Bed />,            gradient: GRADIENTS.danger },
    { id: 'departments', label: 'Departments', icon: <Apartment />,      gradient: GRADIENTS.primary },
    { id: 'settings',    label: 'Settings',    icon: <Settings />,       gradient: GRADIENTS.purple },
  ];

  // ── Firestore listeners ──
  useEffect(() => {
    if (!userData?.organizationId) { setLoading(false); return; }
    const orgId = userData.organizationId;
    const cols = [
      { col: 'doctors', setter: setDoctors },
      { col: 'nurses',  setter: setNurses  },
      { col: 'staff',   setter: setStaff   },
      { col: 'wards',   setter: setWards   },
    ];
    const unsubs = cols.map(({ col, setter }) => {
      const q = query(collection(db, col), where('organizationId', '==', orgId));
      return onSnapshot(q, snap => setter(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
        err => console.error(err));
    });
    const t = setTimeout(() => setLoading(false), 600);
    return () => { unsubs.forEach(u => u()); clearTimeout(t); };
  }, [userData?.organizationId]);

  // ── Filtered / paginated data ──
  const filteredDoctors = doctors.filter(d =>
    [d.firstName, d.lastName, d.email, d.department, d.specialization, d.doctorId]
      .some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const paginatedDoctors = filteredDoctors.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // ── Handlers ──
  const handleNavClick = (item) => {
    setActiveNav(item.id);
    setSearchTerm('');
    setPage(0);
    if (isMobile) setMobileOpen(false);
  };

  const handleViewDoctor = (d)  => { setSelectedDoctor(d);  setViewType('doctor'); setViewDialogOpen(true); };
  const handleViewNurse  = (n)  => { setSelectedNurse(n);   setViewType('nurse');  setViewDialogOpen(true); };
  const handleViewStaff  = (s)  => { setSelectedStaff(s);   setViewType('staff');  setViewDialogOpen(true); };
  const handleViewWard   = (w)  => { setSelectedWard(w);    setViewType('ward');   setViewDialogOpen(true); };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Delete this doctor?')) {
      try { await deleteDoc(doc(db, 'doctors', id)); }
      catch { alert('Error deleting doctor'); }
    }
  };

  // ── Stats ──
  const stats = [
    { title: 'Total Doctors',   value: doctors.length, trend: 12,  subtitle: 'Active physicians',     gradient: GRADIENTS.primary, icon: <MedicalServices />, delay: 0   },
    { title: 'Total Nurses',    value: nurses.length,  trend: 8,   subtitle: 'On duty today',          gradient: GRADIENTS.success, icon: <LocalHospital />,  delay: 100 },
    { title: 'Staff Members',   value: staff.length,   trend: -3,  subtitle: 'Support & admin',        gradient: GRADIENTS.warning, icon: <Group />,          delay: 200 },
    { title: 'Active Wards',    value: wards.length,   trend: 5,   subtitle: 'Fully operational',      gradient: GRADIENTS.purple,  icon: <Bed />,            delay: 300 },
  ];

  const patientFlowData = [
    { name: 'Jan', Admitted: 420, Discharged: 380, Emergency: 90 },
    { name: 'Feb', Admitted: 380, Discharged: 310, Emergency: 75 },
    { name: 'Mar', Admitted: 510, Discharged: 470, Emergency: 110 },
    { name: 'Apr', Admitted: 460, Discharged: 390, Emergency: 95 },
    { name: 'May', Admitted: 540, Discharged: 500, Emergency: 130 },
    { name: 'Jun', Admitted: 480, Discharged: 420, Emergency: 100 },
    { name: 'Jul', Admitted: 590, Discharged: 540, Emergency: 145 },
  ];

  const bedOccupancy = [
    { name: 'Mon', occupancy: 78 }, { name: 'Tue', occupancy: 82 },
    { name: 'Wed', occupancy: 75 }, { name: 'Thu', occupancy: 88 },
    { name: 'Fri', occupancy: 91 }, { name: 'Sat', occupancy: 69 },
    { name: 'Sun', occupancy: 65 },
  ];

  const recentActivities = [
    { avatar: 'JS', name: 'Dr. James Smith',    action: 'Admitted patient #4821',  time: '2m ago',   color: GRADIENTS.primary },
    { avatar: 'MK', name: 'Nurse Mary Kim',      action: 'Updated ward report',     time: '14m ago',  color: GRADIENTS.success },
    { avatar: 'RB', name: 'Dr. Rachel Brown',    action: 'Completed surgery',       time: '1h ago',   color: GRADIENTS.warning },
    { avatar: 'TN', name: 'Staff Tom Nelson',    action: 'Lab results uploaded',    time: '2h ago',   color: GRADIENTS.purple  },
    { avatar: 'AW', name: 'Dr. Anna Williams',   action: 'New prescription issued', time: '3h ago',   color: GRADIENTS.danger  },
  ];

  const pieData = [
    { name: 'Doctors', value: doctors.length || 0 },
    { name: 'Nurses',  value: nurses.length  || 0 },
    { name: 'Staff',   value: staff.length   || 0 },
  ];
  const pieColors = [PALETTE.primary, PALETTE.success, PALETTE.warning];

  // ── Sidebar ──
  const drawer = (
    
    <Box className="sidebar">
      {/* Brand */}
      <Box className="sidebar-brand">
        <Box className="brand-icon">
          <LocalHospital />
        </Box>
        <Box className="brand-text">
          <Typography className="brand-name">ERES</Typography>
          <Typography className="brand-tagline">Medical Suite</Typography>
        </Box>
      </Box>

      <Divider className="sidebar-divider" />

      <Typography className="nav-section-label">NAVIGATION</Typography>

      <List className="nav-list" disablePadding>
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <ListItem
              key={item.id}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              onClick={() => handleNavClick(item)}
              disablePadding
            >
              <Box className="nav-item-inner">
                <Box className={`nav-icon-box ${isActive ? 'nav-icon-active' : ''}`}
                  style={isActive ? { background: item.gradient } : {}}>
                  {item.icon}
                </Box>
                <Typography className="nav-label">{item.label}</Typography>
                {isActive && <Box className="nav-active-pill" />}
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Box flex={1} />

      {/* Upgrade Banner */}
      <Box className="sidebar-upgrade">
        <Box className="upgrade-icon"><Star sx={{ fontSize: 18 }} /></Box>
        <Typography className="upgrade-title">Pro Features</Typography>
        <Typography className="upgrade-desc">Unlock advanced analytics and reports</Typography>
        <Button className="upgrade-btn" fullWidth size="small">Upgrade Now</Button>
      </Box>

      <Divider className="sidebar-divider" />

      {/* User Profile */}
      <Box className="sidebar-user">
        <Avatar className="sidebar-avatar" src="/path/to/admin.jpg">
          {userData?.adminName?.[0] || 'A'}
        </Avatar>
        <Box className="sidebar-user-info">
          <Typography className="sidebar-user-name">{userData?.adminName || 'Admin'}</Typography>
          <Typography className="sidebar-user-role">System Admin</Typography>
        </Box>
        <Tooltip title="Logout">
          <IconButton className="sidebar-logout" onClick={logout}>
            <Logout sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box className="hd-root">
      {/* ── Mobile Menu Trigger ── */}
      {isMobile && (
        <IconButton className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          <MenuIcon />
        </IconButton>
      )}

      {/* ── Sidebar ── */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        classes={{ paper: 'sidebar-paper' }}
        PaperProps={{
          // style: { backgroundColor: '#141414' }   // ← forces background
        }}
      >
        {drawer}
      </Drawer>
      {/* ── Main ── */}
      <Box className="hd-main">

        {/* ── Top Header ── */}
        <Box className="hd-header">
          <Box className="header-left">
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} className="header-menu-btn">
                <MenuIcon />
              </IconButton>
            )}
            <Box>
              <Typography className="header-greeting">
                Good {getTimeOfDay()},{' '}
                <span className="header-name">{userData?.adminName || 'Admin'} 👋</span>
              </Typography>
              <Typography className="header-sub">
                {activeNav === 'dashboard'
                  ? 'Here\'s what\'s happening at your hospital today.'
                  : `Manage your ${activeNav} efficiently.`}
              </Typography>
            </Box>
          </Box>

          <Box className="header-right">
            <Box className="header-search-wrap">
              <Search className="search-icon-float" />
              <input
                className="header-search"
                placeholder="Search patients, doctors, wards…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Box>

            <Tooltip title="Notifications">
              <IconButton className="header-icon-btn notif-btn">
                <Badge badgeContent={4} color="error">
                  <NotificationsNone />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh">
              <IconButton className="header-icon-btn">
                <Refresh />
              </IconButton>
            </Tooltip>

            <Box className="header-avatar-wrap">
              <Avatar className="header-avatar" src="/path/to/admin.jpg">
                {userData?.adminName?.[0] || 'A'}
              </Avatar>
              {!isMobile && (
                <Box>
                  <Typography className="header-avatar-name">{userData?.adminName || 'Admin'}</Typography>
                  <Box className="header-avatar-status">
                    <Box className="status-dot" />
                    <Typography className="status-text">Online</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* ── Content ── */}
        {loading ? (
          <Box className="hd-loading">
            <Box className="loading-ring">
              <CircularProgress size={56} thickness={3} style={{ color: PALETTE.primary }} />
            </Box>
            <Typography className="loading-text">Syncing hospital data…</Typography>
          </Box>
        ) : (
          <Fade in timeout={500}>
            <Box className="hd-content">

              {/* ══════════════ DASHBOARD ══════════════ */}
              {activeNav === 'dashboard' && (
                <Box>

                  {/* Stat Cards */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((s) => (
                      <Grid item xs={12} sm={6} lg={3} key={s.title}>
                        <StatCard {...s} />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Charts Row */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>

                    {/* Patient Flow Bar Chart */}
                    <Grid item xs={12} lg={8}>
                      <Zoom in timeout={500}>
                        <Card className="chart-card">
                          <CardContent className="chart-card-content">
                            <Box className="chart-header">
                              <Box>
                                <Typography className="chart-title">Patient Flow</Typography>
                                <Typography className="chart-subtitle">Admissions & discharges per month</Typography>
                              </Box>
                              <Box className="chart-actions">
                                <Chip label="This Year" size="small" className="chart-chip-active" />
                                <IconButton size="small" className="chart-more-btn"><MoreVert sx={{ fontSize: 18 }} /></IconButton>
                              </Box>
                            </Box>
                            <Box sx={{ height: 280, mt: 2 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={patientFlowData} barGap={4}>
                                  <defs>
                                    <linearGradient id="admittedGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#6C63FF" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#48CAE4" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="dischargedGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#06D6A0" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#0CB8A9" stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id="emergencyGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor="#FF6B6B" stopOpacity={1} />
                                      <stop offset="100%" stopColor="#EE0979" stopOpacity={0.8} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }} />
                                  <YAxis axisLine={false} tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 12 }} />
                                  <ReTooltip content={<CustomTooltip />} />
                                  <Legend
                                    wrapperStyle={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingTop: 12 }}
                                    iconType="circle" iconSize={8}
                                  />
                                  <Bar dataKey="Admitted"   fill="url(#admittedGrad)"   radius={[6,6,0,0]} maxBarSize={28} />
                                  <Bar dataKey="Discharged" fill="url(#dischargedGrad)" radius={[6,6,0,0]} maxBarSize={28} />
                                  <Bar dataKey="Emergency"  fill="url(#emergencyGrad)"  radius={[6,6,0,0]} maxBarSize={28} />
                                </BarChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>

                    {/* Donut Chart */}
                    <Grid item xs={12} lg={4}>
                      <Zoom in timeout={600}>
                        <Card className="chart-card">
                          <CardContent className="chart-card-content">
                            <Box className="chart-header">
                              <Box>
                                <Typography className="chart-title">Staff Distribution</Typography>
                                <Typography className="chart-subtitle">Total: {doctors.length + nurses.length + staff.length}</Typography>
                              </Box>
                              <IconButton size="small" className="chart-more-btn"><MoreVert sx={{ fontSize: 18 }} /></IconButton>
                            </Box>
                            <Box sx={{ height: 220, mt: 1 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={62} outerRadius={82}
                                    dataKey="value"
                                    onMouseEnter={(_, i) => setActiveIndex(i)}
                                  >
                                    {pieData.map((_, i) => (
                                      <Cell key={i} fill={pieColors[i]} />
                                    ))}
                                  </Pie>
                                </PieChart>
                              </ResponsiveContainer>
                            </Box>
                            <Box className="donut-legend">
                              {pieData.map((entry, i) => (
                                <Box key={entry.name} className="donut-legend-item">
                                  <Box className="donut-legend-dot" style={{ backgroundColor: pieColors[i] }} />
                                  <Box>
                                    <Typography className="donut-legend-name">{entry.name}</Typography>
                                    <Typography className="donut-legend-value">{entry.value}</Typography>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  </Grid>

                  {/* Bottom Row */}
                  <Grid container spacing={3}>

                    {/* Bed Occupancy Area Chart */}
                    <Grid item xs={12} md={5}>
                      <Zoom in timeout={700}>
                        <Card className="chart-card">
                          <CardContent className="chart-card-content">
                            <Box className="chart-header">
                              <Box>
                                <Typography className="chart-title">Bed Occupancy</Typography>
                                <Typography className="chart-subtitle">Weekly rate (%)</Typography>
                              </Box>
                              <Chip label="Live" size="small" className="chip-live" icon={<Box className="live-dot" />} />
                            </Box>
                            <Box sx={{ height: 180, mt: 2 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={bedOccupancy}>
                                  <defs>
                                    <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%"  stopColor="#6C63FF" stopOpacity={0.35} />
                                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }} />
                                  <YAxis axisLine={false} tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                                    domain={[0, 100]} tickFormatter={v => `${v}%`} />
                                  <ReTooltip content={<CustomTooltip />} />
                                  <Area type="monotone" dataKey="occupancy"
                                    stroke="#6C63FF" strokeWidth={2.5}
                                    fill="url(#occGrad)" dot={{ fill: '#6C63FF', r: 4 }} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12} md={4}>
                      <Zoom in timeout={750}>
                        <Card className="chart-card" sx={{ height: '100%' }}>
                          <CardContent className="chart-card-content">
                            <Box className="chart-header" sx={{ mb: 2 }}>
                              <Typography className="chart-title">Recent Activity</Typography>
                              <Typography className="view-all-link">View All</Typography>
                            </Box>
                            {recentActivities.map((a, i) => (
                              <ActivityItem key={i} {...a} delay={i * 60} />
                            ))}
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>

                    {/* Quick Actions */}
                    <Grid item xs={12} md={3}>
                      <Zoom in timeout={800}>
                        <Card className="chart-card" sx={{ height: '100%' }}>
                          <CardContent className="chart-card-content">
                            <Typography className="chart-title" sx={{ mb: 2 }}>Quick Actions</Typography>
                            <QuickAction icon={<PersonAdd sx={{ fontSize: 18 }} />} label="Add Doctor"
                              gradient={GRADIENTS.primary}  onClick={() => setDoctorFormOpen(true)} />
                            <QuickAction icon={<LocalHospital sx={{ fontSize: 18 }} />} label="Add Nurse"
                              gradient={GRADIENTS.success}  onClick={() => setNurseFormOpen(true)} />
                            <QuickAction icon={<Group sx={{ fontSize: 18 }} />} label="Add Staff"
                              gradient={GRADIENTS.warning}  onClick={() => setStaffFormOpen(true)} />
                            <QuickAction icon={<Bed sx={{ fontSize: 18 }} />} label="Add Ward"
                              gradient={GRADIENTS.purple}   onClick={() => setWardFormOpen(true)} />
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* ══════════════ DOCTORS ══════════════ */}
              {activeNav === 'doctors' && (
                <Fade in timeout={400}>
                  <Box>
                    <Box className="section-hero">
                      <Box className="section-hero-icon" style={{ background: GRADIENTS.primary }}>
                        <MedicalServices />
                      </Box>
                      <Box>
                        <Typography className="section-title">Doctors Management</Typography>
                        <Typography className="section-subtitle">{doctors.length} physicians registered</Typography>
                      </Box>
                      <Box flex={1} />
                      <Button
                        className="add-btn"
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => setDoctorFormOpen(true)}
                      >
                        Add New Doctor
                      </Button>
                    </Box>

                    <Card className="table-card">
                      <CardContent className="table-card-content">

                        {/* Search + Filters */}
                        <Box className="table-toolbar">
                          <Box className="table-search-wrap">
                            <Search className="table-search-icon" />
                            <input
                              className="table-search"
                              placeholder="Search by name, ID, department, specialization…"
                              value={searchTerm}
                              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                            />
                          </Box>
                          <IconButton className="filter-btn"><FilterList /></IconButton>
                          <IconButton className="filter-btn"><Refresh /></IconButton>
                        </Box>

                        {filteredDoctors.length === 0 ? (
                          <Box className="empty-state">
                            <Box className="empty-icon" style={{ background: GRADIENTS.primary }}>
                              <MedicalServices sx={{ fontSize: 36, color: '#fff' }} />
                            </Box>
                            <Typography className="empty-title">No doctors found</Typography>
                            <Typography className="empty-desc">Add your first doctor to get started</Typography>
                            <Button className="add-btn" variant="contained" startIcon={<PersonAdd />}
                              onClick={() => setDoctorFormOpen(true)}>
                              Add First Doctor
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <TableContainer className="styled-table-container">
                              <Table>
                                <TableHead>
                                  <TableRow className="table-head-row">
                                    {['Doctor','Contact','Department','Specialization','Experience','Status','Actions']
                                      .map(h => <TableCell key={h} className="th-cell">{h}</TableCell>)}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {paginatedDoctors.map((doctor, idx) => (
                                    <Fade in timeout={300} key={doctor.id} style={{ transitionDelay: `${idx * 40}ms` }}>
                                      <TableRow className="table-row" hover>
                                        <TableCell>
                                          <Box className="doctor-cell">
                                            <Avatar className="doctor-avatar"
                                              style={{ background: GRADIENTS.primary }}>
                                              {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                            </Avatar>
                                            <Box>
                                              <Typography className="doctor-name">
                                                Dr. {doctor.firstName} {doctor.lastName}
                                              </Typography>
                                              <Typography className="doctor-id">#{doctor.doctorId}</Typography>
                                            </Box>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Box className="contact-cell">
                                            <Box className="contact-row">
                                              <Email sx={{ fontSize: 13, mr: 0.5, color: PALETTE.primary }} />
                                              <Typography className="contact-text">{doctor.email}</Typography>
                                            </Box>
                                            <Box className="contact-row">
                                              <Phone sx={{ fontSize: 13, mr: 0.5, color: PALETTE.success }} />
                                              <Typography className="contact-text">{doctor.phone}</Typography>
                                            </Box>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Chip label={doctor.department} size="small" className="dept-chip" />
                                        </TableCell>
                                        <TableCell>
                                          <Typography className="td-text">{doctor.specialization}</Typography>
                                        </TableCell>
                                        <TableCell>
                                          <Box className="exp-cell">
                                            <Typography className="exp-num">{doctor.experience}</Typography>
                                            <Typography className="exp-label">yrs</Typography>
                                          </Box>
                                        </TableCell>
                                        <TableCell>
                                          <Chip
                                            label={doctor.status || 'Active'}
                                            size="small"
                                            className={`status-chip ${(doctor.status || 'active') === 'active' ? 'chip-active' : 'chip-inactive'}`}
                                            icon={<Box className={`chip-status-dot ${(doctor.status || 'active') === 'active' ? 'dot-active' : 'dot-inactive'}`} />}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Box className="action-btns">
                                            <Tooltip title="View Details">
                                              <IconButton size="small" className="action-btn view-btn"
                                                onClick={() => handleViewDoctor(doctor)}>
                                                <Visibility sx={{ fontSize: 16 }} />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                              <IconButton size="small" className="action-btn edit-btn">
                                                <Edit sx={{ fontSize: 16 }} />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                              <IconButton size="small" className="action-btn delete-btn"
                                                onClick={() => handleDeleteDoctor(doctor.id)}>
                                                <Delete sx={{ fontSize: 16 }} />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                        </TableCell>
                                      </TableRow>
                                    </Fade>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <TablePagination
                              className="table-pagination"
                              rowsPerPageOptions={[5, 10, 25]}
                              component="div"
                              count={filteredDoctors.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={(_, p) => setPage(p)}
                              onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
                            />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Fade>
              )}

              {/* Placeholder for other nav items (nurses, staff, wards) – you can add similar sections */}
              {activeNav === 'departments' && (
                <Box className="placeholder-panel">
                  <Typography className="placeholder-title">Departments</Typography>
                  <Typography className="placeholder-desc">Department management coming soon.</Typography>
                </Box>
              )}
              {activeNav === 'settings' && (
                <Box className="placeholder-panel">
                  <Typography className="placeholder-title">Settings</Typography>
                  <Typography className="placeholder-desc">Settings panel coming soon.</Typography>
                </Box>
              )}

            </Box>
          </Fade>
        )}
      </Box>

      {/* ── Form Dialogs ── */}
      <AddingDoctorForm    open={doctorFormOpen} onClose={() => setDoctorFormOpen(false)} organizationId={userData?.organizationId} />
      <AddingNurseForm     open={nurseFormOpen}  onClose={() => setNurseFormOpen(false)}  organizationId={userData?.organizationId} />
      <AddingHospStaffForm open={staffFormOpen}  onClose={() => setStaffFormOpen(false)}  organizationId={userData?.organizationId} />
      <AddingWardForm      open={wardFormOpen}   onClose={() => setWardFormOpen(false)}   organizationId={userData?.organizationId} />

      {/* ── Details Dialog ── */}
      <DetailsDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        type={viewType}
        doctor={selectedDoctor}
        nurse={selectedNurse}
        staff={selectedStaff}
        ward={selectedWard}
      />
    </Box>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

// ─── Unified Details Dialog ───────────────────────────────────────────────────
const DetailsDialog = ({ open, onClose, type, doctor, nurse, staff, ward }) => {
  const renderContent = () => {
    switch (type) {
      case 'doctor':
        return doctor && (
          <Grid container spacing={2}>
            {[
              { label: 'Doctor ID', value: doctor.doctorId },
              { label: 'Email', value: doctor.email },
              { label: 'Phone', value: doctor.phone },
              { label: 'Department', value: doctor.department },
              { label: 'Specialization', value: doctor.specialization },
              { label: 'Experience', value: `${doctor.experience} years` },
              { label: 'Status', value: doctor.status || 'Active' },
            ].map(({ label, value }) => (
              <Grid item xs={6} key={label}>
                <Box className="detail-item">
                  <Typography className="detail-label">{label}</Typography>
                  <Typography className="detail-value">{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      case 'nurse':
        return nurse && (
          <Grid container spacing={2}>
            {[
              { label: 'Nurse ID', value: nurse.nurseId },
              { label: 'Email', value: nurse.email },
              { label: 'Phone', value: nurse.phone },
              { label: 'Department', value: nurse.department },
              { label: 'Specialization', value: nurse.specialization || 'General' },
              { label: 'Shift', value: nurse.shift || 'Not assigned' },
              { label: 'Status', value: nurse.status || 'Active' },
            ].map(({ label, value }) => (
              <Grid item xs={6} key={label}>
                <Box className="detail-item">
                  <Typography className="detail-label">{label}</Typography>
                  <Typography className="detail-value">{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      case 'staff':
        return staff && (
          <Grid container spacing={2}>
            {[
              { label: 'Staff ID', value: staff.staffId },
              { label: 'Email', value: staff.email },
              { label: 'Phone', value: staff.phone },
              { label: 'Position', value: staff.position },
              { label: 'Department', value: staff.department },
              { label: 'Salary', value: `$${staff.salary}` },
              { label: 'Status', value: staff.status || 'Active' },
            ].map(({ label, value }) => (
              <Grid item xs={6} key={label}>
                <Box className="detail-item">
                  <Typography className="detail-label">{label}</Typography>
                  <Typography className="detail-value">{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      case 'ward':
        return ward && (
          <Grid container spacing={2}>
            {[
              { label: 'Ward ID', value: ward.wardId },
              { label: 'Ward Name', value: ward.wardName },
              { label: 'Type', value: ward.wardType },
              { label: 'Department', value: ward.department },
              { label: 'Total Beds', value: ward.totalBeds },
              { label: 'Occupied Beds', value: ward.occupiedBeds },
              { label: 'Charge/Day', value: `$${ward.chargePerDay}` },
            ].map(({ label, value }) => (
              <Grid item xs={6} key={label}>
                <Box className="detail-item">
                  <Typography className="detail-label">{label}</Typography>
                  <Typography className="detail-value">{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (type === 'doctor' && doctor) return `Dr. ${doctor.firstName} ${doctor.lastName}`;
    if (type === 'nurse' && nurse) return `${nurse.firstName} ${nurse.lastName}`;
    if (type === 'staff' && staff) return `${staff.firstName} ${staff.lastName}`;
    if (type === 'ward' && ward) return ward.wardName;
    return 'Details';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth classes={{ paper: 'details-dialog-paper' }}>
      <DialogTitle className="details-dialog-title">
        {getTitle()}
        <IconButton onClick={onClose} className="dialog-close-btn" size="small">
          <Delete sx={{ fontSize: 16 }} />
        </IconButton>
      </DialogTitle>
      <Divider className="dialog-divider" />
      <DialogContent className="details-dialog-content">
        {renderContent()}
      </DialogContent>
      <DialogActions className="details-dialog-actions">
        <Button className="dialog-edit-btn" variant="contained" startIcon={<Edit />}>Edit</Button>
        <Button className="dialog-close-action" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthcareDashboard;