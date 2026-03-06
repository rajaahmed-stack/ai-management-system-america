import React, { useState, useEffect } from 'react';
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
  Avatar,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment,
  FormHelperText,
  Divider,
  CircularProgress,
  Snackbar,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  LocalHospital, 
  Bed, 
  LocationOn,
  Business,
  Group,
  AttachMoney,
  Speed
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/health/AddingWardForm.css';

const AddingWardForm = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedWardId, setGeneratedWardId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    // Basic Information
    wardName: '',
    wardNumber: '',
    wardType: '',
    department: '',
    floor: '',
    
    // Capacity & Facilities
    totalBeds: '',
    occupiedBeds: '0',
    availableBeds: '',
    hasICU: false,
    hasVentilator: false,
    hasMonitor: false,
    
    // Charges & Management
    chargePerDay: '',
    inChargeNurse: '',
    description: '',
    
    // System Generated
    wardId: '',
    organizationId: '',
    organizationName: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUserData = localStorage.getItem('lastOrganizationCredentials');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        
        if (parsedData.organizationId) {
          generateWardId(parsedData.organizationId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        showSnackbar('Error loading organization data', 'error');
      }
    }
  }, [open]);

  const generateWardId = (orgId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const wardId = `WARD_${orgId}_${timestamp}_${random}`;
    
    setGeneratedWardId(wardId);
    setFormData(prev => ({
      ...prev,
      wardId: wardId,
      organizationId: orgId,
      organizationName: userData?.organizationName || ''
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const steps = ['Basic Information', 'Facilities & Capacity', 'Review & Create'];

  const wardTypes = [
    'General Ward',
    'ICU',
    'CCU',
    'Pediatric Ward',
    'Maternity Ward',
    'Surgical Ward',
    'Orthopedic Ward',
    'Cardiac Ward',
    'Neurology Ward',
    'Oncology Ward',
    'Emergency Ward',
    'Private Ward'
  ];

  const departments = [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Cardiology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Emergency',
    'ICU',
    'Radiology',
    'Pathology'
  ];

  const floors = ['Ground', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-calculate available beds
    if (field === 'totalBeds' || field === 'occupiedBeds') {
      const total = field === 'totalBeds' ? value : formData.totalBeds;
      const occupied = field === 'occupiedBeds' ? value : formData.occupiedBeds;
      const available = Math.max(0, parseInt(total || 0) - parseInt(occupied || 0));
      
      setFormData(prev => ({
        ...prev,
        availableBeds: available.toString()
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Basic Information
        if (!formData.wardName.trim()) newErrors.wardName = 'Ward name is required';
        if (!formData.wardNumber.trim()) newErrors.wardNumber = 'Ward number is required';
        if (!formData.wardType) newErrors.wardType = 'Ward type is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.floor) newErrors.floor = 'Floor is required';
        break;
        
      case 1: // Facilities & Capacity
        if (!formData.totalBeds || formData.totalBeds <= 0) newErrors.totalBeds = 'Total beds must be greater than 0';
        if (parseInt(formData.occupiedBeds) > parseInt(formData.totalBeds)) {
          newErrors.occupiedBeds = 'Occupied beds cannot exceed total beds';
        }
        if (!formData.chargePerDay || formData.chargePerDay <= 0) newErrors.chargePerDay = 'Charge per day is required';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const saveWardToFirebase = async (wardData) => {
    try {
      const wardsCollection = collection(db, 'wards');
      
      const docRef = await addDoc(wardsCollection, {
        ...wardData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        // Ensure organization linkage
        organizationId: userData?.organizationId,
        organizationName: userData?.organizationName,
        // Add calculated fields
        occupancyRate: ((parseInt(wardData.occupiedBeds) / parseInt(wardData.totalBeds)) * 100).toFixed(1),
        // Add searchable fields
        searchName: wardData.wardName.toLowerCase(),
        searchWardId: wardData.wardId.toLowerCase(),
        searchWardNumber: wardData.wardNumber.toLowerCase()
      });
      
      console.log('Ward saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving ward to Firebase:', error);
      throw new Error(`Failed to save ward: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    const wardData = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      organizationId: userData?.organizationId,
      organizationName: userData?.organizationName,
      // Convert string numbers to integers
      totalBeds: parseInt(formData.totalBeds),
      occupiedBeds: parseInt(formData.occupiedBeds),
      availableBeds: parseInt(formData.availableBeds),
      chargePerDay: parseFloat(formData.chargePerDay)
    };

    console.log('Submitting Ward Data:', wardData);

    setLoading(true);

    try {
      await saveWardToFirebase(wardData);
      showSnackbar('Ward added successfully!', 'success');
      
      setTimeout(() => {
        onClose();
        setActiveStep(0);
        resetForm();
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error saving ward:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      wardName: '',
      wardNumber: '',
      wardType: '',
      department: '',
      floor: '',
      totalBeds: '',
      occupiedBeds: '0',
      availableBeds: '',
      hasICU: false,
      hasVentilator: false,
      hasMonitor: false,
      chargePerDay: '',
      inChargeNurse: '',
      description: '',
      wardId: '',
      organizationId: '',
      organizationName: '',
      status: 'active'
    });
  };

  const getOccupancyColor = (occupancy) => {
    if (occupancy >= 90) return 'error';
    if (occupancy >= 70) return 'warning';
    return 'success';
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <LocalHospital sx={{ mr: 1 }} />
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ward Name"
                  value={formData.wardName}
                  onChange={handleChange('wardName')}
                  error={!!errors.wardName}
                  helperText={errors.wardName}
                  placeholder="e.g., East Wing Ward, Cardiac Care Unit"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ward Number"
                  value={formData.wardNumber}
                  onChange={handleChange('wardNumber')}
                  error={!!errors.wardNumber}
                  helperText={errors.wardNumber}
                  placeholder="e.g., W-101, ICU-01"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.wardType}>
                  <InputLabel>Ward Type</InputLabel>
                  <Select
                    value={formData.wardType}
                    label="Ward Type"
                    onChange={handleChange('wardType')}
                  >
                    {wardTypes.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                  {errors.wardType && <FormHelperText>{errors.wardType}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.department}>
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
                  {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.floor}>
                  <InputLabel>Floor</InputLabel>
                  <Select
                    value={formData.floor}
                    label="Floor"
                    onChange={handleChange('floor')}
                  >
                    {floors.map(floor => (
                      <MenuItem key={floor} value={floor}>{floor} Floor</MenuItem>
                    ))}
                  </Select>
                  {errors.floor && <FormHelperText>{errors.floor}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange('description')}
                  placeholder="Additional details about the ward, facilities, special requirements..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Bed sx={{ mr: 1 }} />
              Capacity & Facilities
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Total Beds"
                  type="number"
                  value={formData.totalBeds}
                  onChange={handleChange('totalBeds')}
                  error={!!errors.totalBeds}
                  helperText={errors.totalBeds}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">beds</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Occupied Beds"
                  type="number"
                  value={formData.occupiedBeds}
                  onChange={handleChange('occupiedBeds')}
                  error={!!errors.occupiedBeds}
                  helperText={errors.occupiedBeds}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">beds</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Available Beds"
                  type="number"
                  value={formData.availableBeds}
                  disabled
                  InputProps={{
                    endAdornment: <InputAdornment position="end">beds</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Special Facilities
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasICU}
                          onChange={handleChange('hasICU')}
                          color="primary"
                        />
                      }
                      label="ICU Facilities"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasVentilator}
                          onChange={handleChange('hasVentilator')}
                          color="primary"
                        />
                      }
                      label="Ventilator Support"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.hasMonitor}
                          onChange={handleChange('hasMonitor')}
                          color="primary"
                        />
                      }
                      label="Patient Monitoring"
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Charge Per Day"
                  type="number"
                  value={formData.chargePerDay}
                  onChange={handleChange('chargePerDay')}
                  error={!!errors.chargePerDay}
                  helperText={errors.chargePerDay}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="In-Charge Nurse"
                  value={formData.inChargeNurse}
                  onChange={handleChange('inChargeNurse')}
                  placeholder="Name of responsible nurse"
                />
              </Grid>
            </Grid>

            {formData.totalBeds && formData.occupiedBeds && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Current Occupancy: {((parseInt(formData.occupiedBeds) / parseInt(formData.totalBeds)) * 100).toFixed(1)}%
              </Alert>
            )}
          </Box>
        );

      case 2:
        const occupancyRate = formData.totalBeds ? 
          ((parseInt(formData.occupiedBeds) / parseInt(formData.totalBeds)) * 100).toFixed(1) : 0;

        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Speed sx={{ mr: 1 }} />
              Review & Create Ward
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all ward information before creation.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="review-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Ward Information
                    </Typography>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Ward Name</Typography>
                      <Typography variant="body1">{formData.wardName}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Ward Number</Typography>
                      <Typography variant="body1">{formData.wardNumber}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Ward Type</Typography>
                      <Chip label={formData.wardType} size="small" color="primary" />
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                      <Typography variant="body1">{formData.department}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Floor</Typography>
                      <Typography variant="body1">{formData.floor} Floor</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="details-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Capacity & Facilities
                    </Typography>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Bed Capacity</Typography>
                      <Typography variant="body1">
                        {formData.occupiedBeds} / {formData.totalBeds} occupied
                      </Typography>
                      <Chip 
                        label={`${occupancyRate}% occupancy`}
                        size="small"
                        color={getOccupancyColor(occupancyRate)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Charge Per Day</Typography>
                      <Typography variant="body1" className="charge-amount">
                        ${formData.chargePerDay}
                      </Typography>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Special Facilities</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {formData.hasICU && <Chip label="ICU" size="small" color="primary" variant="outlined" />}
                        {formData.hasVentilator && <Chip label="Ventilator" size="small" color="secondary" variant="outlined" />}
                        {formData.hasMonitor && <Chip label="Monitoring" size="small" color="success" variant="outlined" />}
                        {!formData.hasICU && !formData.hasVentilator && !formData.hasMonitor && (
                          <Typography variant="body2" color="textSecondary">No special facilities</Typography>
                        )}
                      </Box>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">In-Charge Nurse</Typography>
                      <Typography variant="body1">
                        {formData.inChargeNurse || 'Not assigned'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" className="system-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      System Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box className="review-item">
                          <Typography variant="subtitle2" color="textSecondary">
                            <Business sx={{ fontSize: 16, mr: 0.5 }} />
                            Organization
                          </Typography>
                          <Typography variant="body2">{userData?.organizationName}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box className="review-item">
                          <Typography variant="subtitle2" color="textSecondary">
                            Ward ID
                          </Typography>
                          <Typography variant="body1" className="ward-id">
                            {generatedWardId}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        className="ward-form-dialog"
      >
        <DialogTitle className="form-header">
          <Box className="header-content">
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LocalHospital sx={{ fontSize: 32 }} />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" component="div" className="form-title">
                Add New Ward
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Create new ward for {userData?.organizationName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent className="form-content">
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>
        
        <DialogActions className="form-actions">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button 
              onClick={onClose} 
              startIcon={<Cancel />}
              className="cancel-button"
              color="inherit"
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                className="back-button"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button 
                  onClick={handleSubmit} 
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  className="submit-button"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Ward'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  className="next-button"
                  variant="contained"
                  disabled={loading}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default AddingWardForm;