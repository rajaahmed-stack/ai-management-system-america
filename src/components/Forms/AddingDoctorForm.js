// components/doctor/AddingDoctorForm.js
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
  School, 
  Work, 
  LocationOn,
  Email,
  Phone,
  Badge,
  Business,
  Security,
  LocalHospital,
  MedicalServices
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/health/AddingDoctorForm.css';

const AddingDoctorForm = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedDoctorId, setGeneratedDoctorId] = useState('');
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
    specialization: '',
    qualification: '',
    licenseNumber: '',
    experience: '',
    joinDate: '',
    salary: '',
    
    // Medical Details
    medicalSchool: '',
    residency: '',
    boardCertification: '',
    languages: '',
    
    // Additional Details
    address: '',
    emergencyContact: '',
    profilePicture: '',
    
    // System Generated
    doctorId: '',
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
        
        // Generate doctor ID when organization data is available
        if (parsedData.organizationId) {
          generateDoctorId(parsedData.organizationId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        showSnackbar('Error loading organization data', 'error');
      }
    }
  }, [open]);

  // Generate unique doctor ID linked to organization
  const generateDoctorId = async (orgId) => {
    try {
      // Check existing doctors to ensure uniqueness
      const doctorsRef = collection(db, 'doctors');
      const q = query(doctorsRef, where('organizationId', '==', orgId));
      const querySnapshot = await getDocs(q);
      const doctorCount = querySnapshot.size + 1;
      
      const timestamp = Date.now().toString(36).toUpperCase();
      const doctorId = `DOC_${orgId}_${doctorCount.toString().padStart(4, '0')}_${timestamp}`;
      
      setGeneratedDoctorId(doctorId);
      setFormData(prev => ({
        ...prev,
        doctorId: doctorId,
        organizationId: orgId,
        organizationName: userData?.organizationName || ''
      }));
    } catch (error) {
      console.error('Error generating doctor ID:', error);
      // Fallback ID generation
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substr(2, 5).toUpperCase();
      const doctorId = `DOC_${orgId}_${timestamp}_${random}`;
      
      setGeneratedDoctorId(doctorId);
      setFormData(prev => ({
        ...prev,
        doctorId: doctorId,
        organizationId: orgId,
        organizationName: userData?.organizationName || ''
      }));
    }
  };

  // Generate secure password for doctor
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

  const steps = ['Personal Info', 'Professional Details', 'Medical Background', 'Review & Create'];

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Oncology',
    'Dermatology',
    'Psychiatry',
    'Radiology',
    'Surgery',
    'Emergency Medicine',
    'Internal Medicine',
    'Gynecology',
    'Urology',
    'Endocrinology'
  ];

  const specializations = [
    'Cardiac Surgery',
    'Neuro Surgery',
    'Pediatric Cardiology',
    'Orthopedic Surgery',
    'Medical Oncology',
    'Clinical Psychology',
    'Interventional Radiology',
    'General Surgery'
  ];

  const qualifications = [
    'MD (Doctor of Medicine)',
    'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
    'DO (Doctor of Osteopathic Medicine)',
    'PhD in Medical Sciences',
    'Board Certified Specialist',
    'Fellowship Trained'
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
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.qualification) newErrors.qualification = 'Qualification is required';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'Medical license number is required';
        if (!formData.experience) newErrors.experience = 'Experience is required';
        if (!formData.joinDate) newErrors.joinDate = 'Join date is required';
        break;
        
      case 2: // Medical Background
        if (!formData.medicalSchool) newErrors.medicalSchool = 'Medical school is required';
        if (!formData.residency) newErrors.residency = 'Residency information is required';
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

  const saveDoctorToFirebase = async (doctorData) => {
    try {
      // Reference to the doctors collection in Firestore
      const doctorsCollection = collection(db, 'doctors');
      
      // Add document to Firestore
      const docRef = await addDoc(doctorsCollection, {
        ...doctorData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        role: 'doctor',
        // Ensure organization linkage
        organizationId: userData?.organizationId,
        organizationName: userData?.organizationName,
        // Add searchable fields
        searchName: `${doctorData.firstName} ${doctorData.lastName}`.toLowerCase(),
        searchEmail: doctorData.email.toLowerCase(),
        searchDoctorId: doctorData.doctorId.toLowerCase(),
        // Add login credentials collection
        loginCredentials: {
          username: doctorData.doctorId,
          password: doctorData.password,
          role: 'doctor',
          organizationId: userData?.organizationId,
          status: 'active',
          createdAt: serverTimestamp()
        }
      });
      
      // Also save to login credentials collection for authentication
      const loginCollection = collection(db, 'loginCredentials');
      await addDoc(loginCollection, {
        username: doctorData.doctorId,
        password: doctorData.password, // In production, hash this password
        role: 'doctor',
        organizationId: userData?.organizationId,
        doctorId: docRef.id,
        status: 'active',
        createdAt: serverTimestamp()
      });
      
      console.log('Doctor saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving doctor to Firebase:', error);
      throw new Error(`Failed to save doctor: ${error.message}`);
    }
  };

  const saveDoctorToLocalStorage = (doctorData) => {
    try {
      const existingDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
      existingDoctors.push(doctorData);
      localStorage.setItem('doctors', JSON.stringify(existingDoctors));
      console.log('Doctor saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSubmit = async () => {
    // Generate password if not already generated
    if (!formData.password) {
      generatePassword();
    }

    const doctorData = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      role: 'doctor',
      // Ensure organization data is included
      organizationId: userData?.organizationId,
      organizationName: userData?.organizationName,
      // Add full name for easier searching
      fullName: `${formData.firstName} ${formData.lastName}`,
      // Add display fields
      displayName: `Dr. ${formData.firstName} ${formData.lastName}`
    };

    console.log('Submitting Doctor Data:', doctorData);

    setLoading(true);

    try {
      // Save to Firebase Firestore
      const firebaseId = await saveDoctorToFirebase(doctorData);
      
      // Also save to localStorage for offline access
      saveDoctorToLocalStorage({
        ...doctorData,
        firebaseId: firebaseId // Store Firebase document ID for reference
      });

      showSnackbar('Doctor added successfully to database!', 'success');
      
      // Reset form and close
      setTimeout(() => {
        onClose();
        setActiveStep(0);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          department: '',
          specialization: '',
          qualification: '',
          licenseNumber: '',
          experience: '',
          joinDate: '',
          salary: '',
          medicalSchool: '',
          residency: '',
          boardCertification: '',
          languages: '',
          address: '',
          emergencyContact: '',
          profilePicture: '',
          doctorId: '',
          organizationId: '',
          organizationName: '',
          password: ''
        });
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error saving doctor:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
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
              <MedicalServices sx={{ mr: 1 }} />
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
                <FormControl fullWidth error={!!errors.specialization}>
                  <InputLabel>Specialization</InputLabel>
                  <Select
                    value={formData.specialization}
                    label="Specialization"
                    onChange={handleChange('specialization')}
                  >
                    {specializations.map(spec => (
                      <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                    ))}
                  </Select>
                  {errors.specialization && <FormHelperText>{errors.specialization}</FormHelperText>}
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
                  label="Medical License Number"
                  value={formData.licenseNumber}
                  onChange={handleChange('licenseNumber')}
                  error={!!errors.licenseNumber}
                  helperText={errors.licenseNumber}
                  placeholder="e.g., MED123456"
                />
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
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <School sx={{ mr: 1 }} />
              Medical Background
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Medical School"
                  value={formData.medicalSchool}
                  onChange={handleChange('medicalSchool')}
                  error={!!errors.medicalSchool}
                  helperText={errors.medicalSchool}
                  placeholder="e.g., Harvard Medical School"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Residency"
                  value={formData.residency}
                  onChange={handleChange('residency')}
                  error={!!errors.residency}
                  helperText={errors.residency}
                  placeholder="e.g., General Surgery at Mayo Clinic"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Board Certification"
                  value={formData.boardCertification}
                  onChange={handleChange('boardCertification')}
                  placeholder="e.g., American Board of Surgery"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Languages Spoken"
                  value={formData.languages}
                  onChange={handleChange('languages')}
                  placeholder="e.g., English, Spanish, French"
                  helperText="Separate languages with commas"
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

      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Security sx={{ mr: 1 }} />
              Review & Credentials
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Please review all information before creating the doctor account. 
              The system will generate unique credentials for the doctor.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="review-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Doctor Information
                    </Typography>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">Dr. {formData.firstName} {formData.lastName}</Typography>
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
                      <Typography variant="subtitle2" color="textSecondary">Specialization</Typography>
                      <Typography variant="body1">{formData.specialization}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                      <Typography variant="body1">{formData.experience} years</Typography>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">License Number</Typography>
                      <Typography variant="body1">{formData.licenseNumber}</Typography>
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
                        Doctor ID
                      </Typography>
                      <Typography variant="body1" className="doctor-id">
                        {generatedDoctorId}
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
                        This password will be sent to the doctor's email
                      </FormHelperText>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Important:</strong> Please ensure the doctor saves their credentials securely. 
              They will use their Doctor ID and password to access the system.
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
        className="doctor-form-dialog"
      >
        <DialogTitle className="form-header">
          <Box className="header-content">
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LocalHospital sx={{ fontSize: 32 }} />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" component="div" className="form-title">
                Add New Doctor
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Create doctor account for {userData?.organizationName}
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
                  {loading ? 'Saving...' : 'Create Doctor Account'}
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

      {/* Snackbar for notifications */}
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

export default AddingDoctorForm;