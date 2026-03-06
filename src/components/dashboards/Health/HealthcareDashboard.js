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
  Schedule
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Sector,
  CartesianGrid
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/health/HealthcareDashboard.css';
import AddingDoctorForm from '../../Forms/AddingDoctorForm';
import AddingNurseForm from '../../Forms/AddingNurseForm';
import AddingHospStaffForm from '../../Forms/AddingHospStaffForm';
import AddingWardForm from '../../Forms/AddingWardForm';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

// --- Mock Data for Charts ---
const revenueData = [
  { name: 'Jan', Income: 4000, Expense: 2400 },
  { name: 'Feb', Income: 3000, Expense: 1398 },
  { name: 'Mar', Income: 2000, Expense: 9800 },
  { name: 'Apr', Income: 2780, Expense: 3908 },
  { name: 'May', Income: 1890, Expense: 4800 },
  { name: 'Jun', Income: 2390, Expense: 3800 },
  { name: 'Jul', Income: 3490, Expense: 4300 },
];

const patientData = [
  { name: 'Jan', NewPatient: 400, OldPatient: 240 },
  { name: 'Feb', NewPatient: 300, OldPatient: 139 },
  { name: 'Mar', NewPatient: 200, OldPatient: 980 },
  { name: 'Apr', NewPatient: 278, OldPatient: 390 },
  { name: 'May', NewPatient: 189, OldPatient: 480 },
  { name: 'Jun', NewPatient: 239, OldPatient: 380 },
  { name: 'Jul', NewPatient: 349, OldPatient: 430 },
];

const abilitiesData = [
  { name: 'Operation', value: 55 },
  { name: 'Theraphy', value: 35 },
  { name: 'Meditation', value: 10 },
];

const PIE_COLORS = ['#3498db', '#1abc9c', '#f1c40f'];

// --- Re-styled StatCard ---
const StatCard = ({ title, value, trend, icon, color, bgColor }) => (
  <Card className="stat-card">
    <CardContent className="stat-card-content">
      <Box className="stat-info">
        <Typography variant="h3" className="stat-value">
          {value}
        </Typography>
        <Typography variant="body1" className="stat-title">
          {title}
        </Typography>
        <Chip
          icon={trend > 0 ? <ArrowUpward /> : <ArrowDownward />}
          label={`${Math.abs(trend)}%`}
          className={trend > 0 ? 'trend-positive' : 'trend-negative'}
          size="small"
        />
      </Box>
      <Box className="stat-icon-wrapper" sx={{ backgroundColor: bgColor }}>
        {React.cloneElement(icon, { style: { color } })}
      </Box>
    </CardContent>
  </Card>
);

// --- Donut Chart Inner Label ---
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#333" fontSize={18} fontWeight={600}>
        {payload.value}%
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#999" fontSize={14}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

// --- Nurse Management Component ---
const NurseManagement = ({ nurses, loading, onAddNurse, onEditNurse, onDeleteNurse, onViewNurse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredNurses = nurses.filter(nurse =>
    (nurse.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     nurse.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     nurse.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     nurse.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     nurse.specialization?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment === 'all' || nurse.department === filterDepartment)
  );

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on leave': return 'warning';
      default: return 'default';
    }
  };

  const paginatedNurses = filteredNurses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="nurses-section">
      <Box className="section-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" className="section-title">
            Nurses Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {nurses.length} nurses in your organization
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={onAddNurse}
          className="add-nurse-button"
          size="large"
        >
          Add New Nurse
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search nurses by name, email, department..."
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={filterDepartment}
                  label="Department"
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="General Medicine">General Medicine</MenuItem>
                  <MenuItem value="Surgery">Surgery</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="ICU">ICU</MenuItem>
                  <MenuItem value="Emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredNurses.length} of {nurses.length} nurses
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Nurses Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredNurses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocalHospital sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No nurses found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first nurse'}
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  onClick={onAddNurse}
                >
                  Add First Nurse
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nurse</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Shift</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedNurses.map((nurse) => (
                      <TableRow key={nurse.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                bgcolor: 'primary.main', 
                                mr: 2,
                                width: 40, 
                                height: 40 
                              }}
                            >
                              {getInitials(nurse.firstName, nurse.lastName)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {nurse.firstName} {nurse.lastName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {nurse.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email fontSize="small" />
                              {nurse.email}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone fontSize="small" />
                              {nurse.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={nurse.department} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {nurse.specialization || 'General Nursing'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {nurse.experience} years
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={nurse.shift || 'Not assigned'} 
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={nurse.status || 'active'} 
                            size="small"
                            color={getStatusColor(nurse.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {nurse.joinDate ? new Date(nurse.joinDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => onViewNurse(nurse)}
                              color="info"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => onEditNurse(nurse.id)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => onDeleteNurse(nurse.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredNurses.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// --- Staff Management Component ---
const StaffManagement = ({ staff, loading, onAddStaff, onEditStaff, onDeleteStaff, onViewStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterDepartment, setFilterDepartment] = useState('all');

  const filteredStaff = staff.filter(staffMember =>
    (staffMember.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staffMember.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staffMember.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staffMember.position?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterDepartment === 'all' || staffMember.department === filterDepartment)
  );

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const paginatedStaff = filteredStaff.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="staff-section">
      <Box className="section-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" className="section-title">
            Staff Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {staff.length} staff members in your organization
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />}
          onClick={onAddStaff}
          className="add-staff-button"
          size="large"
        >
          Add New Staff
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search staff by name, email, position..."
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select
                  value={filterDepartment}
                  label="Department"
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Administrative">Administrative</MenuItem>
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                  <MenuItem value="Cleaning">Cleaning</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredStaff.length} of {staff.length} staff
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredStaff.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Group sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No staff members found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first staff member'}
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  onClick={onAddStaff}
                >
                  Add First Staff Member
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff Member</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Salary</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Join Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStaff.map((staffMember) => (
                      <TableRow key={staffMember.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                bgcolor: 'primary.main', 
                                mr: 2,
                                width: 40, 
                                height: 40 
                              }}
                            >
                              {getInitials(staffMember.firstName, staffMember.lastName)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {staffMember.firstName} {staffMember.lastName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {staffMember.employeeId}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Email fontSize="small" />
                              {staffMember.email}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Phone fontSize="small" />
                              {staffMember.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {staffMember.position}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={staffMember.department} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ${staffMember.salary}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={staffMember.status || 'active'} 
                            size="small"
                            color={getStatusColor(staffMember.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {staffMember.joinDate ? new Date(staffMember.joinDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => onViewStaff(staffMember)}
                              color="info"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => onEditStaff(staffMember.id)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => onDeleteStaff(staffMember.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredStaff.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// --- Ward Management Component ---
const WardManagement = ({ wards, loading, onAddWard, onEditWard, onDeleteWard, onViewWard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredWards = wards.filter(ward =>
    ward.wardName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ward.wardType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ward.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ward.wardNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return 'error';
    if (occupancy >= 70) return 'warning';
    return 'success';
  };

  const getWardTypeColor = (type) => {
    const types = {
      'General Ward': 'primary',
      'ICU': 'error',
      'Pediatric Ward': 'success',
      'Maternity Ward': 'secondary',
      'Surgical Ward': 'warning',
      'Emergency Ward': 'error'
    };
    return types[type] || 'default';
  };

  const paginatedWards = filteredWards.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box className="wards-section">
      <Box className="section-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" className="section-title">
            Ward Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {wards.length} wards in your hospital
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Bed />}
          onClick={onAddWard}
          className="add-ward-button"
          size="large"
        >
          Add New Ward
        </Button>
      </Box>

      {/* Ward Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="stat-card-content">
              <Box className="stat-info">
                <Typography variant="h3" className="stat-value">
                  {wards.reduce((total, ward) => total + (ward.totalBeds || 0), 0)}
                </Typography>
                <Typography variant="body1" className="stat-title">
                  Total Beds
                </Typography>
              </Box>
              <Box className="stat-icon-wrapper" sx={{ backgroundColor: '#e8f4fd' }}>
                <Bed style={{ color: '#3498db' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="stat-card-content">
              <Box className="stat-info">
                <Typography variant="h3" className="stat-value">
                  {wards.reduce((total, ward) => total + (ward.occupiedBeds || 0), 0)}
                </Typography>
                <Typography variant="body1" className="stat-title">
                  Occupied Beds
                </Typography>
              </Box>
              <Box className="stat-icon-wrapper" sx={{ backgroundColor: '#ffeaa7' }}>
                <Bed style={{ color: '#fdcb6e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="stat-card-content">
              <Box className="stat-info">
                <Typography variant="h3" className="stat-value">
                  {wards.length}
                </Typography>
                <Typography variant="body1" className="stat-title">
                  Total Wards
                </Typography>
              </Box>
              <Box className="stat-icon-wrapper" sx={{ backgroundColor: '#d1ecf1' }}>
                <Apartment style={{ color: '#17a2b8' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="stat-card">
            <CardContent className="stat-card-content">
              <Box className="stat-info">
                <Typography variant="h3" className="stat-value">
                  {wards.length > 0 ? Math.round(wards.reduce((total, ward) => {
                    const occupancy = ((ward.occupiedBeds || 0) / (ward.totalBeds || 1)) * 100;
                    return total + occupancy;
                  }, 0) / wards.length) : 0}%
                </Typography>
                <Typography variant="body1" className="stat-title">
                  Avg. Occupancy
                </Typography>
              </Box>
              <Box className="stat-icon-wrapper" sx={{ backgroundColor: '#e8f6f3' }}>
                <Dashboard style={{ color: '#1abc9c' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search wards by name, type, department..."
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
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="textSecondary">
                Showing {filteredWards.length} of {wards.length} wards
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Wards Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredWards.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Bed sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No wards found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first ward'}
              </Typography>
              {!searchTerm && (
                <Button 
                  variant="contained" 
                  startIcon={<Bed />}
                  onClick={onAddWard}
                >
                  Add First Ward
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ward Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Beds (Occupied/Total)</TableCell>
                      <TableCell>Occupancy Rate</TableCell>
                      <TableCell>Charge per Day</TableCell>
                      <TableCell>In-Charge Nurse</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedWards.map((ward) => {
                      const occupancyRate = ((ward.occupiedBeds || 0) / (ward.totalBeds || 1)) * 100;
                      return (
                        <TableRow key={ward.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{ 
                                  bgcolor: 'primary.main', 
                                  mr: 2,
                                  width: 40, 
                                  height: 40 
                                }}
                              >
                                <Bed />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2">
                                  {ward.wardName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {ward.wardNumber}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={ward.wardType} 
                              size="small" 
                              color={getWardTypeColor(ward.wardType)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ward.department}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ward.occupiedBeds || 0} / {ward.totalBeds || 0}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${Math.round(occupancyRate)}%`}
                              size="small"
                              color={getOccupancyColor(occupancyRate)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              ${ward.chargePerDay}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {ward.inChargeNurse || 'Not Assigned'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={ward.status || 'active'} 
                              size="small"
                              color={ward.status === 'active' ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => onViewWard(ward)}
                                color="info"
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => onEditWard(ward.id)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => onDeleteWard(ward.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredWards.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const HealthcareDashboard = () => {
  const { userData } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [doctorFormOpen, setDoctorFormOpen] = useState(false);
  const [nurseFormOpen, setNurseFormOpen] = useState(false);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [wardFormOpen, setWardFormOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // State for all data
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
  const [viewType, setViewType] = useState(''); // 'doctor', 'nurse', 'staff', 'ward'

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'doctors', label: 'Doctors', icon: <MedicalServices /> },
    { id: 'nurses', label: 'Nurses', icon: <LocalHospital /> },
    { id: 'staff', label: 'Other Staff', icon: <Group /> },
    { id: 'wards', label: 'Wards', icon: <Bed /> },
    { id: 'departments', label: 'Department', icon: <Apartment /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  // Fetch all data from Firebase
  useEffect(() => {
    if (userData?.organizationId) {
      console.log('🔍 Fetching all data for organization:', userData.organizationId);
      setLoading(true);

      // Fetch Doctors
      const doctorsRef = collection(db, 'doctors');
      const doctorsQuery = query(
        doctorsRef, 
        where('organizationId', '==', userData.organizationId)
      );

      const unsubscribeDoctors = onSnapshot(doctorsQuery, (querySnapshot) => {
        const doctorsData = [];
        querySnapshot.forEach((doc) => {
          doctorsData.push({ id: doc.id, ...doc.data() });
        });
        doctorsData.sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
        setDoctors(doctorsData);
      });

      // Fetch Nurses
      const nursesRef = collection(db, 'nurses');
      const nursesQuery = query(
        nursesRef, 
        where('organizationId', '==', userData.organizationId)
      );

      const unsubscribeNurses = onSnapshot(nursesQuery, (querySnapshot) => {
        const nursesData = [];
        querySnapshot.forEach((doc) => {
          nursesData.push({ id: doc.id, ...doc.data() });
        });
        setNurses(nursesData);
      });

      // Fetch Staff
      const staffRef = collection(db, 'staff');
      const staffQuery = query(
        staffRef, 
        where('organizationId', '==', userData.organizationId)
      );

      const unsubscribeStaff = onSnapshot(staffQuery, (querySnapshot) => {
        const staffData = [];
        querySnapshot.forEach((doc) => {
          staffData.push({ id: doc.id, ...doc.data() });
        });
        setStaff(staffData);
      });

      // Fetch Wards
      const wardsRef = collection(db, 'wards');
      const wardsQuery = query(
        wardsRef, 
        where('organizationId', '==', userData.organizationId)
      );

      const unsubscribeWards = onSnapshot(wardsQuery, (querySnapshot) => {
        const wardsData = [];
        querySnapshot.forEach((doc) => {
          wardsData.push({ id: doc.id, ...doc.data() });
        });
        setWards(wardsData);
        setLoading(false);
      });

      return () => {
        unsubscribeDoctors();
        unsubscribeNurses();
        unsubscribeStaff();
        unsubscribeWards();
      };
    }
  }, [userData?.organizationId]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.doctorId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    setSearchTerm(''); // Reset search when switching tabs
    setPage(0); // Reset to first page
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // View Handlers
  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setViewType('doctor');
    setViewDialogOpen(true);
  };

  const handleViewNurse = (nurse) => {
    setSelectedNurse(nurse);
    setViewType('nurse');
    setViewDialogOpen(true);
  };

  const handleViewStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setViewType('staff');
    setViewDialogOpen(true);
  };

  const handleViewWard = (ward) => {
    setSelectedWard(ward);
    setViewType('ward');
    setViewDialogOpen(true);
  };

  // Delete Handlers
  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoc(doc(db, 'doctors', doctorId));
        console.log('Doctor deleted successfully');
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor. Please try again.');
      }
    }
  };

  const handleDeleteNurse = async (nurseId) => {
    if (window.confirm('Are you sure you want to delete this nurse?')) {
      try {
        await deleteDoc(doc(db, 'nurses', nurseId));
        console.log('Nurse deleted successfully');
      } catch (error) {
        console.error('Error deleting nurse:', error);
        alert('Error deleting nurse. Please try again.');
      }
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteDoc(doc(db, 'staff', staffId));
        console.log('Staff member deleted successfully');
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Error deleting staff member. Please try again.');
      }
    }
  };

  const handleDeleteWard = async (wardId) => {
    if (window.confirm('Are you sure you want to delete this ward?')) {
      try {
        await deleteDoc(doc(db, 'wards', wardId));
        console.log('Ward deleted successfully');
      } catch (error) {
        console.error('Error deleting ward:', error);
        alert('Error deleting ward. Please try again.');
      }
    }
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const paginatedDoctors = filteredDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on leave': return 'warning';
      default: return 'default';
    }
  };

  const renderMainContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <>
            {/* Quick Stats Grid */}
            <Grid container spacing={3} className="quick-stats-grid">
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Doctors"
                  value={doctors.length.toString()}
                  trend={12}
                  icon={<MedicalServices />}
                  color="#3498db"
                  bgColor="#e8f4fd"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Nurses"
                  value={nurses.length.toString()}
                  trend={8}
                  icon={<LocalHospital />}
                  color="#1abc9c"
                  bgColor="#e8f8f5"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Staff Members"
                  value={staff.length.toString()}
                  trend={5}
                  icon={<Group />}
                  color="#9b59b6"
                  bgColor="#f5eef8"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Wards"
                  value={wards.length.toString()}
                  trend={3}
                  icon={<Bed />}
                  color="#e67e22"
                  bgColor="#fdf3e9"
                />
              </Grid>
            </Grid>

            {/* Main Chart Grid */}
            <Grid container spacing={3} className="main-grid">
              {/* Left Column (Charts) */}
              <Grid item xs={12} lg={8}>
                <Grid container spacing={3}>
                  {/* Revenue Chart */}
                  <Grid item xs={12}>
                    <Card className="chart-card">
                      <CardContent>
                        <Typography variant="h6" className="chart-title">
                          Hospital Statistics
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} />
                              <YAxis axisLine={false} tickLine={false} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="Income" fill="#3498db" radius={[10, 10, 0, 0]} />
                              <Bar dataKey="Expense" fill="#e8f4fd" radius={[10, 10, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column (Donut Chart) */}
              <Grid item xs={12} lg={4}>
                <Grid container spacing={3}>
                  {/* Staff Distribution Chart */}
                  <Grid item xs={12}>
                    <Card className="chart-card">
                      <CardContent>
                        <Typography variant="h6" className="chart-title">
                          Staff Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={[
                                  { name: 'Doctors', value: doctors.length },
                                  { name: 'Nurses', value: nurses.length },
                                  { name: 'Staff', value: staff.length }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                              >
                                <Cell key="doctors" fill="#3498db" />
                                <Cell key="nurses" fill="#1abc9c" />
                                <Cell key="staff" fill="#9b59b6" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                        <Box className="pie-legend">
                          <Box className="legend-item">
                            <Box className="legend-dot" sx={{ backgroundColor: '#3498db' }} />
                            <Typography variant="body2">Doctors ({doctors.length})</Typography>
                          </Box>
                          <Box className="legend-item">
                            <Box className="legend-dot" sx={{ backgroundColor: '#1abc9c' }} />
                            <Typography variant="body2">Nurses ({nurses.length})</Typography>
                          </Box>
                          <Box className="legend-item">
                            <Box className="legend-dot" sx={{ backgroundColor: '#9b59b6' }} />
                            <Typography variant="body2">Staff ({staff.length})</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      
      case 'doctors':
        return (
          <Box className="doctors-section">
            <Box className="section-header" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" className="section-title">
                  Doctors Management
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {doctors.length} doctors in your organization
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<PersonAdd />}
                onClick={() => setDoctorFormOpen(true)}
                className="add-doctor-button"
                size="large"
              >
                Add New Doctor
              </Button>
            </Box>

            {/* Search and Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Search doctors by name, email, department..."
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
                  <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="textSecondary">
                      Showing {filteredDoctors.length} of {doctors.length} doctors
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Doctors Table */}
            <Card>
              <CardContent>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredDoctors.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <MedicalServices sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No doctors found
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                      {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first doctor'}
                    </Typography>
                    {!searchTerm && (
                      <Button 
                        variant="contained" 
                        startIcon={<PersonAdd />}
                        onClick={() => setDoctorFormOpen(true)}
                      >
                        Add First Doctor
                      </Button>
                    )}
                  </Box>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Doctor</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Join Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedDoctors.map((doctor) => (
                            <TableRow key={doctor.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar
                                    sx={{ 
                                      bgcolor: 'primary.main', 
                                      mr: 2,
                                      width: 40, 
                                      height: 40 
                                    }}
                                  >
                                    {getInitials(doctor.firstName, doctor.lastName)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2">
                                      Dr. {doctor.firstName} {doctor.lastName}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {doctor.doctorId}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Email fontSize="small" />
                                    {doctor.email}
                                  </Typography>
                                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Phone fontSize="small" />
                                    {doctor.phone}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={doctor.department} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {doctor.specialization}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {doctor.experience} years
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={doctor.status || 'active'} 
                                  size="small"
                                  color={getStatusColor(doctor.status)}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {doctor.joinDate ? new Date(doctor.joinDate).toLocaleDateString() : 'N/A'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleViewDoctor(doctor)}
                                    color="info"
                                  >
                                    <Visibility />
                                  </IconButton>
                                  <IconButton size="small" color="primary">
                                    <Edit />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteDoctor(doctor.id)}
                                  >
                                    <Delete />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredDoctors.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        );

      case 'nurses':
        return (
          <NurseManagement
            nurses={nurses}
            loading={loading}
            onAddNurse={() => setNurseFormOpen(true)}
            onEditNurse={(nurseId) => console.log('Edit nurse:', nurseId)}
            onDeleteNurse={handleDeleteNurse}
            onViewNurse={handleViewNurse}
          />
        );

      case 'staff':
        return (
          <StaffManagement
            staff={staff}
            loading={loading}
            onAddStaff={() => setStaffFormOpen(true)}
            onEditStaff={(staffId) => console.log('Edit staff:', staffId)}
            onDeleteStaff={handleDeleteStaff}
            onViewStaff={handleViewStaff}
          />
        );

      case 'wards':
        return (
          <WardManagement
            wards={wards}
            loading={loading}
            onAddWard={() => setWardFormOpen(true)}
            onEditWard={(wardId) => console.log('Edit ward:', wardId)}
            onDeleteWard={handleDeleteWard}
            onViewWard={handleViewWard}
          />
        );

      case 'departments':
        return (
          <Box className="departments-section">
            <Typography variant="h4" gutterBottom>Departments</Typography>
            <Typography color="textSecondary">Departments management interface</Typography>
          </Box>
        );

      case 'settings':
        return (
          <Box className="settings-section">
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Typography color="textSecondary">System settings interface</Typography>
          </Box>
        );

      default:
        return (
          <Box className="dashboard-section">
            <Typography variant="h4" gutterBottom>Dashboard</Typography>
            <Typography color="textSecondary">Default dashboard view</Typography>
          </Box>
        );
    }
  };

  // Details Dialog Component
  const DetailsDialog = () => {
    const renderContent = () => {
      switch (viewType) {
        case 'doctor':
          return selectedDoctor && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Doctor ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.doctorId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Chip label={selectedDoctor.department} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Specialization</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.specialization}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.experience} years</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Qualification</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.qualification}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">License Number</Typography>
                <Typography variant="body1" gutterBottom>{selectedDoctor.licenseNumber}</Typography>
              </Grid>
            </Grid>
          );

        case 'nurse':
          return selectedNurse && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Nurse ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.nurseId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Employee ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.employeeId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Chip label={selectedNurse.department} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Specialization</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.specialization || 'General Nursing'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Shift</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.shift || 'Not assigned'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">License Number</Typography>
                <Typography variant="body1" gutterBottom>{selectedNurse.licenseNumber}</Typography>
              </Grid>
            </Grid>
          );

        case 'staff':
          return selectedStaff && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Staff ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.staffId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Employee ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.employeeId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Position</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.position}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Chip label={selectedStaff.department} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Salary</Typography>
                <Typography variant="body1" gutterBottom>${selectedStaff.salary}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Qualification</Typography>
                <Typography variant="body1" gutterBottom>{selectedStaff.qualification}</Typography>
              </Grid>
            </Grid>
          );

        case 'ward':
          return selectedWard && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Ward ID</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.wardId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Ward Number</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.wardNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Ward Type</Typography>
                <Chip label={selectedWard.wardType} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.department}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Total Beds</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.totalBeds}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Occupied Beds</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.occupiedBeds}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Charge Per Day</Typography>
                <Typography variant="body1" gutterBottom>${selectedWard.chargePerDay}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">In-Charge Nurse</Typography>
                <Typography variant="body1" gutterBottom>{selectedWard.inChargeNurse || 'Not assigned'}</Typography>
              </Grid>
            </Grid>
          );

        default:
          return null;
      }
    };

    const getTitle = () => {
      switch (viewType) {
        case 'doctor':
          return `Doctor Details - Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName}`;
        case 'nurse':
          return `Nurse Details - ${selectedNurse?.firstName} ${selectedNurse?.lastName}`;
        case 'staff':
          return `Staff Details - ${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
        case 'ward':
          return `Ward Details - ${selectedWard?.wardName}`;
        default:
          return 'Details';
      }
    };

    return (
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {getTitle()}
        </DialogTitle>
        <DialogContent>
          {renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const drawer = (
    <Box className="sidebar">
      <Toolbar className="sidebar-header">
        <LocalHospital className="hospital-logo" />
        <Typography variant="h5" className="hospital-name">
          ERES
        </Typography>
      </Toolbar>
      <Typography variant="caption" className="menu-title">
        Main Menu
      </Typography>
      <List className="nav-list">
        {navItems.map((item) => (
          <ListItem
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item)}
            button
          >
            <ListItemIcon className="nav-icon">{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="healthcare-dashboard">
      {/* Sidebar */}
      <Drawer variant="permanent" className="desktop-drawer" open>
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box className="main-content">
        {/* Main Header */}
        <Box className="main-header">
          <Box>
            <Typography variant="h4" className="welcome-title">
              Welcome to Eres!
            </Typography>
            <Typography variant="body1" className="welcome-subtitle">
              {activeNav === 'dashboard' ? 'Hospital Admin Dashboard Template' : 
               `Manage ${activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}`}
            </Typography>
          </Box>
          <Box className="header-actions">
            <TextField
              variant="outlined"
              size="small"
              className="search-bar"
              placeholder="Search..."
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
            <IconButton>
              <Badge badgeContent={4} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
            <Box className="profile-section">
              <Avatar
                alt={userData?.adminName || 'Admin'}
                src="/path/to/admin.jpg"
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ ml: 1.5 }}>
                <Typography variant="body1" className="profile-name">
                  Hello, {userData?.adminName || 'Admin'}
                </Typography>
                <Typography variant="caption" className="profile-role">
                  System Administrator
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Dynamic Content based on activeNav */}
        {renderMainContent()}
      </Box>

      {/* Form Dialogs */}
      <AddingDoctorForm 
        open={doctorFormOpen} 
        onClose={() => setDoctorFormOpen(false)} 
      />
      
      <AddingNurseForm 
        open={nurseFormOpen} 
        onClose={() => setNurseFormOpen(false)} 
      />
      
      <AddingHospStaffForm 
        open={staffFormOpen} 
        onClose={() => setStaffFormOpen(false)} 
      />
      
      <AddingWardForm 
        open={wardFormOpen} 
        onClose={() => setWardFormOpen(false)} 
      />

      {/* Details Dialog */}
      <DetailsDialog />
    </Box>
  );
};

export default HealthcareDashboard;