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
  IconButton,
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
  Snackbar
} from '@mui/material';
import { 
  PhotoCamera, 
  Save, 
  Cancel, 
  Person, 
  Work, 
  LocationOn,
  Email,
  Phone,
  Badge,
  Business,
  Security,
  AttachMoney,
  AssignmentInd
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/health/AddingStaffForm.css';

const AddingStaffForm = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedStaffId, setGeneratedStaffId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    department: '',
    position: '',
    qualification: '',
    experience: '',
    joinDate: '',
    salary: '',
    
    // Additional Details
    address: '',
    emergencyContact: '',
    profilePicture: '',
    
    // System Generated
    staffId: '',
    employeeId: '',
    organizationId: '',
    organizationName: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Fetch organization data on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('lastOrganizationCredentials');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        
        // Generate staff ID when organization data is available
        if (parsedData.organizationId) {
          generateStaffId(parsedData.organizationId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        showSnackbar('Error loading organization data', 'error');
      }
    }
  }, [open]);

  // Generate unique staff ID linked to organization
  const generateStaffId = (orgId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const staffId = `STAFF_${orgId}_${timestamp}_${random}`;
    const employeeId = `EMP${Date.now().toString().slice(-6)}`;
    
    setGeneratedStaffId(staffId);
    setFormData(prev => ({
      ...prev,
      staffId: staffId,
      employeeId: employeeId,
      organizationId: orgId,
      organizationName: userData?.organizationName || ''
    }));
  };

  // Generate secure password for staff
  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setFormData(prev => ({
      ...prev,
      password: password
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const steps = ['Personal Info', 'Professional Details', 'Review & Create'];

  const departments = [
    'Administrative',
    'Technical',
    'Support',
    'Cleaning',
    'Security',
    'Maintenance',
    'IT Support',
    'Human Resources',
    'Finance',
    'Reception'
  ];

  const positions = {
    'Administrative': ['Admin Manager', 'Office Assistant', 'Data Entry Operator', 'Receptionist'],
    'Technical': ['Lab Technician', 'IT Specialist', 'Medical Technician', 'System Administrator'],
    'Support': ['Support Staff', 'Helper', 'Assistant', 'Coordinator'],
    'Cleaning': ['Cleaner', 'Sanitation Worker', 'Housekeeping Staff'],
    'Security': ['Security Guard', 'Security Officer', 'Security Supervisor'],
    'Maintenance': ['Maintenance Worker', 'Electrician', 'Plumber', 'Technician'],
    'IT Support': ['IT Support Specialist', 'Network Administrator', 'System Analyst'],
    'Human Resources': ['HR Manager', 'HR Assistant', 'Recruiter'],
    'Finance': ['Accountant', 'Finance Officer', 'Billing Specialist'],
    'Reception': ['Receptionist', 'Front Desk Officer', 'Information Desk Staff']
  };

  const qualifications = [
    'High School',
    'Diploma',
    'Associate Degree',
    'Bachelors Degree',
    'Masters Degree',
    'Professional Certification',
    'Other'
  ];

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
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
      case 0: // Personal Info
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        break;
        
      case 1: // Professional Details
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.position) newErrors.position = 'Position is required';
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
        if (!formData.salary) newErrors.salary = 'Salary is required';
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

  const saveStaffToFirebase = async (staffData) => {
    try {
      const staffCollection = collection(db, 'staff');
      
      const docRef = await addDoc(staffCollection, {
        ...staffData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        role: 'staff',
        // Ensure organization linkage
        organizationId: userData?.organizationId,
        organizationName: userData?.organizationName,
        // Add searchable fields
        searchName: `${staffData.firstName} ${staffData.lastName}`.toLowerCase(),
        searchEmail: staffData.email.toLowerCase(),
        searchStaffId: staffData.staffId.toLowerCase(),
        searchEmployeeId: staffData.employeeId.toLowerCase()
      });
      
      console.log('Staff saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving staff to Firebase:', error);
      throw new Error(`Failed to save staff: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    if (!formData.password) {
      generatePassword();
    }

    const staffData = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      role: 'staff',
      organizationId: userData?.organizationId,
      organizationName: userData?.organizationName,
      fullName: `${formData.firstName} ${formData.lastName}`
    };

    console.log('Submitting Staff Data:', staffData);

    setLoading(true);

    try {
      await saveStaffToFirebase(staffData);
      showSnackbar('Staff member added successfully!', 'success');
      
      setTimeout(() => {
        onClose();
        setActiveStep(0);
        resetForm();
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error saving staff:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      department: '',
      position: '',
      qualification: '',
      experience: '',
      joinDate: '',
      salary: '',
      address: '',
      emergencyContact: '',
      profilePicture: '',
      staffId: '',
      employeeId: '',
      organizationId: '',
      organizationName: '',
      password: ''
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Person sx={{ mr: 1 }} />
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange('dateOfBirth')}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender"
                    onChange={handleChange('gender')}
                  >
                    {genders.map(gender => (
                      <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                    ))}
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Work sx={{ mr: 1 }} />
              Professional Information
            </Typography>
            
            <Grid container spacing={3}>
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
                <FormControl fullWidth error={!!errors.position}>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={formData.position}
                    label="Position"
                    onChange={handleChange('position')}
                    disabled={!formData.department}
                  >
                    {formData.department && positions[formData.department]?.map(position => (
                      <MenuItem key={position} value={position}>{position}</MenuItem>
                    ))}
                  </Select>
                  {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.qualification}>
                  <InputLabel>Qualification</InputLabel>
                  <Select
                    value={formData.qualification}
                    label="Qualification"
                    onChange={handleChange('qualification')}
                  >
                    {qualifications.map(qual => (
                      <MenuItem key={qual} value={qual}>{qual}</MenuItem>
                    ))}
                  </Select>
                  {errors.qualification && <FormHelperText>{errors.qualification}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Years of Experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange('experience')}
                  error={!!errors.experience}
                  helperText={errors.experience}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange('joinDate')}
                  error={!!errors.joinDate}
                  helperText={errors.joinDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange('salary')}
                  error={!!errors.salary}
                  helperText={errors.salary}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleChange('address')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange('emergencyContact')}
                  placeholder="Name and phone number of emergency contact"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Security sx={{ mr: 1 }} />
              Review & Credentials
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all information before creating the staff account. 
              The system will generate unique credentials for the staff member.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="review-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Staff Information
                    </Typography>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">{formData.firstName} {formData.lastName}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{formData.email}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                      <Chip label={formData.department} size="small" color="primary" />
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Position</Typography>
                      <Typography variant="body1">{formData.position}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Salary</Typography>
                      <Typography variant="body1">${formData.salary}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="credentials-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      System Credentials
                    </Typography>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        <Business sx={{ fontSize: 16, mr: 0.5 }} />
                        Organization
                      </Typography>
                      <Typography variant="body2">{userData?.organizationName}</Typography>
                      <Chip 
                        label={`ID: ${userData?.organizationId}`} 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        <Badge sx={{ fontSize: 16, mr: 0.5 }} />
                        Staff ID
                      </Typography>
                      <Typography variant="body1" className="staff-id">
                        {generatedStaffId}
                      </Typography>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        <AssignmentInd sx={{ fontSize: 16, mr: 0.5 }} />
                        Employee ID
                      </Typography>
                      <Typography variant="body1" className="employee-id">
                        {formData.employeeId}
                      </Typography>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">
                        Login Password
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" className="password-display">
                          {formData.password || 'Not generated yet'}
                        </Typography>
                        <Button 
                          size="small" 
                          onClick={generatePassword}
                          variant="outlined"
                        >
                          Generate
                        </Button>
                      </Box>
                      <FormHelperText>
                        This password will be provided to the staff member
                      </FormHelperText>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Important:</strong> Please ensure the staff member saves their credentials securely. 
              They will use their Employee ID and password to access the system.
            </Alert>
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
        className="staff-form-dialog"
      >
        <DialogTitle className="form-header">
          <Box className="header-content">
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" component="div" className="form-title">
                Add New Staff Member
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Create staff account for {userData?.organizationName}
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
                  disabled={!formData.password || loading}
                >
                  {loading ? 'Saving...' : 'Create Staff Account'}
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

export default AddingStaffForm;