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

const AddingDoctorForm = ({ open, onClose, organizationId, organizationName }) => {
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

  // Load organization data from props first, fallback to localStorage
  useEffect(() => {
    // Priority: props > localStorage
    let orgId = organizationId;
    let orgName = organizationName;

    if (!orgId) {
      const storedUserData = localStorage.getItem('lastOrganizationCredentials');
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          setUserData(parsedData);
          orgId = parsedData.organizationId;
          orgName = parsedData.organizationName;
        } catch (error) {
          console.error('Error parsing user data:', error);
          showSnackbar('Error loading organization data', 'error');
        }
      }
    } else {
      // Use props to set userData
      setUserData({ organizationId: orgId, organizationName: orgName });
    }

    if (orgId) {
      generateDoctorId(orgId);
    }
  }, [open, organizationId, organizationName]);

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
        organizationName: userData?.organizationName || organizationName || ''
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
        organizationName: userData?.organizationName || organizationName || ''
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
        // Ensure organization linkage (use props if available)
        organizationId: organizationId || doctorData.organizationId,
        organizationName: organizationName || doctorData.organizationName,
        // Add searchable fields
        searchName: `${doctorData.firstName} ${doctorData.lastName}`.toLowerCase(),
        searchEmail: doctorData.email.toLowerCase(),
        searchDoctorId: doctorData.doctorId.toLowerCase(),
        // Add login credentials collection (we'll save separately)
      });
      
      // Also save to login credentials collection for authentication
      const loginCollection = collection(db, 'loginCredentials');
      await addDoc(loginCollection, {
        username: doctorData.doctorId,
        password: doctorData.password, // In production, hash this password
        role: 'doctor',
        organizationId: organizationId || doctorData.organizationId,
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

    // Ensure organizationId and organizationName are set (prefer props)
    const finalOrgId = organizationId || formData.organizationId;
    const finalOrgName = organizationName || formData.organizationName;

    const doctorData = {
      ...formData,
      organizationId: finalOrgId,
      organizationName: finalOrgName,
      createdAt: new Date().toISOString(),
      status: 'active',
      role: 'doctor',
      fullName: `${formData.firstName} ${formData.lastName}`,
      displayName: `Dr. ${formData.firstName} ${formData.lastName}`
    };

    console.log('Submitting Doctor Data:', doctorData);

    if (!finalOrgId) {
      showSnackbar('Organization ID is missing. Cannot save doctor.', 'error');
      return;
    }

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
    // ... (keep the existing renderStepContent function exactly as you have it)
    // I'll omit it here for brevity, but you should keep your existing implementation.
    // Make sure to use the same JSX you already have.
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
                Create doctor account for {organizationName || userData?.organizationName || 'your organization'}
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