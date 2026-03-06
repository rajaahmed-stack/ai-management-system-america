// SchoolResoursesForm.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Save, Cancel, Delete, Edit, Add } from '@mui/icons-material';
import '../../styles/education/AddingResoursesForm.css';

const SchoolResoursesForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: '',
    department: '',
    location: '',
    capacity: '',
    status: 'available',
    maintenanceSchedule: '',
    assignedTo: '',
    notes: ''
  });

  const [resources, setResources] = useState([
    {
      id: 1,
      name: 'Science Lab A',
      type: 'Laboratory',
      department: 'Science',
      location: 'Building A, Room 101',
      capacity: 30,
      status: 'available',
      assignedTo: 'Dr. Emily Davis'
    },
    {
      id: 2,
      name: 'Computer Lab 1',
      type: 'Computer Lab',
      department: 'Computer Science',
      location: 'Tech Building, Room 201',
      capacity: 25,
      status: 'in-use',
      assignedTo: 'Prof. Mike Johnson'
    }
  ]);

  const resourceTypes = [
    'Classroom',
    'Laboratory',
    'Computer Lab',
    'Library',
    'Auditorium',
    'Sports Facility',
    'Meeting Room',
    'Special Equipment'
  ];

  const departments = [
    'Computer Science',
    'Mathematics',
    'Science',
    'Humanities',
    'Business',
    'Arts'
  ];

  const statusOptions = [
    'available',
    'in-use',
    'maintenance',
    'reserved',
    'unavailable'
  ];

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = () => {
    if (formData.id) {
      // Update existing resource
      setResources(prev => prev.map(res => 
        res.id === formData.id ? formData : res
      ));
    } else {
      // Add new resource
      const newResource = {
        ...formData,
        id: resources.length + 1
      };
      setResources(prev => [...prev, newResource]);
    }
    setFormData({
      resourceName: '',
      resourceType: '',
      department: '',
      location: '',
      capacity: '',
      status: 'available',
      maintenanceSchedule: '',
      assignedTo: '',
      notes: ''
    });
  };

  const handleEdit = (resource) => {
    setFormData(resource);
  };

  const handleDelete = (id) => {
    setResources(prev => prev.filter(res => res.id !== id));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth className="resource-form-dialog">
      <DialogTitle className="form-title">
        <Typography variant="h4" component="div">
          Resource Management
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage classrooms, labs, and equipment
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box className="resource-form-content">
          <Grid container spacing={3}>
            {/* Add/Edit Resource Form */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="section-title">
                {formData.id ? 'Edit Resource' : 'Add New Resource'}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Resource Name"
                    value={formData.resourceName}
                    onChange={handleChange('resourceName')}
                    className="form-field"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Resource Type</InputLabel>
                    <Select
                      value={formData.resourceType}
                      label="Resource Type"
                      onChange={handleChange('resourceType')}
                    >
                      {resourceTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.department}
                      label="Department"
                      onChange={handleChange('department')}
                    >
                      {departments.map(dept => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={handleChange('location')}
                    className="form-field"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange('capacity')}
                    className="form-field"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={handleChange('status')}
                    >
                      {statusOptions.map(status => (
                        <MenuItem key={status} value={status}>
                          <Chip 
                            label={status} 
                            size="small"
                            color={
                              status === 'available' ? 'success' :
                              status === 'in-use' ? 'primary' :
                              status === 'maintenance' ? 'warning' : 'error'
                            }
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Assigned To"
                    value={formData.assignedTo}
                    onChange={handleChange('assignedTo')}
                    className="form-field"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Maintenance Schedule"
                    value={formData.maintenanceSchedule}
                    onChange={handleChange('maintenanceSchedule')}
                    className="form-field"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange('notes')}
                    className="form-field"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  onClick={handleSubmit} 
                  startIcon={<Save />}
                  className="submit-button"
                  variant="contained"
                  disabled={!formData.resourceName || !formData.resourceType}
                >
                  {formData.id ? 'Update Resource' : 'Add Resource'}
                </Button>
                {formData.id && (
                  <Button 
                    onClick={() => setFormData({
                      resourceName: '',
                      resourceType: '',
                      department: '',
                      location: '',
                      capacity: '',
                      status: 'available',
                      maintenanceSchedule: '',
                      assignedTo: '',
                      notes: ''
                    })}
                    className="cancel-button"
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Resources List */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="section-title">
                Existing Resources ({resources.length})
              </Typography>
              
              <TableContainer component={Paper} className="resources-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{resource.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {resource.location}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={resource.type} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={resource.status} 
                            size="small"
                            color={
                              resource.status === 'available' ? 'success' :
                              resource.status === 'in-use' ? 'primary' :
                              resource.status === 'maintenance' ? 'warning' : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEdit(resource)}
                            className="edit-button"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(resource.id)}
                            className="delete-button"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
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

export default SchoolResoursesForm;