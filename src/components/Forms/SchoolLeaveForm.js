// SchoolLeaveForm.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Check, Close, Visibility, Cancel } from '@mui/icons-material';
import '../../styles/education/LeaveApplicationForm.css';

const SchoolLeaveForm = ({ open, onClose }) => {
  const [filter, setFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);

  const leaveApplications = [
    {
      id: 1,
      teacherName: 'Dr. Sarah Wilson',
      department: 'Computer Science',
      leaveType: 'Medical',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      duration: 3,
      reason: 'Medical appointment and recovery',
      status: 'pending',
      appliedDate: '2024-01-15',
      emergencyContact: '+1234567890'
    },
    {
      id: 2,
      teacherName: 'Prof. Mike Johnson',
      department: 'Mathematics',
      leaveType: 'Personal',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      duration: 2,
      reason: 'Family function',
      status: 'approved',
      appliedDate: '2024-01-10',
      emergencyContact: '+1234567891'
    },
    {
      id: 3,
      teacherName: 'Dr. Emily Davis',
      department: 'Physics',
      leaveType: 'Vacation',
      startDate: '2024-02-01',
      endDate: '2024-02-05',
      duration: 5,
      reason: 'Annual vacation with family',
      status: 'rejected',
      appliedDate: '2024-01-08',
      emergencyContact: '+1234567892'
    }
  ];

  const filteredApplications = filter === 'all' 
    ? leaveApplications 
    : leaveApplications.filter(app => app.status === filter);

  const handleApprove = (id) => {
    console.log('Approved leave:', id);
    // Update status in backend
  };

  const handleReject = (id) => {
    console.log('Rejected leave:', id);
    // Update status in backend
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'Medical': return 'error';
      case 'Personal': return 'warning';
      case 'Vacation': return 'success';
      default: return 'primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth className="leave-form-dialog">
      <DialogTitle className="form-title">
        <Typography variant="h4" component="div">
          Leave Applications
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage teacher leave requests and approvals
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="leave-form-content">
          {/* Filters */}
          <Box className="filters-section">
            <FormControl className="filter-control">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filter}
                label="Filter by Status"
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="all">All Applications</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary">
              Showing {filteredApplications.length} applications
            </Typography>
          </Box>

          {/* Leave Applications Table */}
          <TableContainer component={Paper} className="leave-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Teacher</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id} className="leave-row">
                    <TableCell>
                      <Typography variant="subtitle2">
                        {application.teacherName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Applied: {new Date(application.appliedDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{application.department}</TableCell>
                    <TableCell>
                      <Chip 
                        label={application.leaveType} 
                        size="small"
                        color={getLeaveTypeColor(application.leaveType)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.duration} days
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(application.startDate).toLocaleDateString()} - {' '}
                        {new Date(application.endDate).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={application.status} 
                        size="small"
                        color={getStatusColor(application.status)}
                        variant={application.status === 'pending' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="action-buttons">
                        <IconButton 
                          size="small" 
                          onClick={() => setSelectedLeave(application)}
                          className="view-button"
                        >
                          <Visibility />
                        </IconButton>
                        {application.status === 'pending' && (
                          <>
                            <IconButton 
                              size="small" 
                              onClick={() => handleApprove(application.id)}
                              className="approve-button"
                            >
                              <Check />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleReject(application.id)}
                              className="reject-button"
                            >
                              <Close />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Leave Details */}
          {selectedLeave && (
            <Card className="leave-details-card">
              <CardContent>
                <Box className="details-header">
                  <Typography variant="h6">
                    Leave Application Details
                  </Typography>
                  <IconButton onClick={() => setSelectedLeave(null)}>
                    <Close />
                  </IconButton>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Teacher Name
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.teacherName}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.department}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Leave Type
                    </Typography>
                    <Chip 
                      label={selectedLeave.leaveType} 
                      color={getLeaveTypeColor(selectedLeave.leaveType)}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.duration} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedLeave.startDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      End Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedLeave.endDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                      Reason
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.reason}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Emergency Contact
                    </Typography>
                    <Typography variant="body1">
                      {selectedLeave.emergencyContact}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      Applied On
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedLeave.appliedDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
                
                {selectedLeave.status === 'pending' && (
                  <Box className="decision-buttons" sx={{ mt: 2 }}>
                    <Button 
                      startIcon={<Check />}
                      className="approve-button"
                      variant="contained"
                      onClick={() => handleApprove(selectedLeave.id)}
                    >
                      Approve Leave
                    </Button>
                    <Button 
                      startIcon={<Close />}
                      className="reject-button"
                      variant="outlined"
                      onClick={() => handleReject(selectedLeave.id)}
                    >
                      Reject Leave
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions className="form-actions">
        <Button onClick={onClose} startIcon={<Cancel />} className="cancel-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SchoolLeaveForm;