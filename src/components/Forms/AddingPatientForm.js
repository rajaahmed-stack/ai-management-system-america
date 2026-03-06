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
  Snackbar,
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  FormLabel,
  Autocomplete,
} from '@mui/material';
import { 
  PhotoCamera, 
  Save, 
  Cancel, 
  Person, 
  MedicalServices, 
  LocalHospital, 
  LocationOn,
  Email,
  Phone,
  Badge,
  Business,
  Security,
  Favorite,
  MonitorHeart,
  Psychology,
  Vaccines,
  Allergy,
  History,
  Emergency,
  Bloodtype,
  Height,
  FitnessCenter, // FIXED: Replaced Weight with FitnessCenter
  Male,
  Female,
  Transgender
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

// FIXED: Accept doctorData and organizationData as props
const AddingPatientForm = ({ open, onClose, doctorData, organizationData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [generatedPatientId, setGeneratedPatientId] = useState('');
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
    maritalStatus: '',
    emergencyContact: '',
    address: '',
    
    // Medical Information
    bloodGroup: '',
    height: '',
    weight: '',
    bmi: '',
    primaryPhysician: '',
    
    // Medical History
    allergies: [],
    currentMedications: [],
    pastMedications: [],
    chronicConditions: [],
    surgicalHistory: [],
    familyHistory: [],
    
    // Lifestyle & Habits
    smokingStatus: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    dietType: '',
    occupation: '',
    
    // Insurance Information
    insuranceProvider: '',
    insuranceId: '',
    policyNumber: '',
    
    // System Generated
    patientId: '',
    organizationId: '',
    organizationName: '',
    medicalRecordNumber: '',
    // FIXED: Added doctor reference
    doctorId: '',
    doctorName: ''
  });

  const [errors, setErrors] = useState({});

  // Medical data options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  const smokingStatuses = ['Never', 'Former', 'Current', 'Occasional'];
  const alcoholFrequencies = ['Never', 'Occasionally', 'Weekly', 'Daily'];
  const exerciseFrequencies = ['Sedentary', 'Light (1-2x/week)', 'Moderate (3-4x/week)', 'Active (5+ times/week)'];
  const dietTypes = ['Omnivore', 'Vegetarian', 'Vegan', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Other'];
  
  // Common medical conditions for autocomplete
  const commonAllergies = ['Penicillin', 'Aspirin', 'Ibuprofen', 'Sulfa', 'Codeine', 'Latex', 'Peanuts', 'Shellfish', 'Dairy', 'Eggs', 'Wheat', 'Soy'];
  const commonConditions = ['Hypertension', 'Diabetes', 'Asthma', 'Arthritis', 'Heart Disease', 'Cancer', 'Stroke', 'COPD', 'Depression', 'Anxiety'];
  const commonMedications = ['Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Amlodipine', 'Metoprolol', 'Omeprazole', 'Albuterol'];

  // Fetch organization data - FIXED: Use props instead of localStorage
  useEffect(() => {
    if (open) {
      // Use props data if available, otherwise fallback to localStorage
      if (organizationData && doctorData) {
        const userData = {
          organizationId: organizationData.id || organizationData.organizationId,
          organizationName: organizationData.name || organizationData.organizationName
        };
        setUserData(userData);
        generatePatientId(userData.organizationId, doctorData);
      } else {
        // Fallback to localStorage
        const storedUserData = localStorage.getItem('lastOrganizationCredentials');
        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            if (parsedData.organizationId) {
              generatePatientId(parsedData.organizationId, doctorData);
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
            showSnackbar('Error loading organization data', 'error');
          }
        }
      }
    }
  }, [open, organizationData, doctorData]);

  // Generate unique patient ID - FIXED: Include doctor data
  const generatePatientId = (orgId, doctorData) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const patientId = `PAT_${orgId}_${timestamp}_${random}`;
    const medicalRecordNumber = `MRN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    setGeneratedPatientId(patientId);
    setFormData(prev => ({
      ...prev,
      patientId: patientId,
      medicalRecordNumber: medicalRecordNumber,
      organizationId: orgId,
      organizationName: userData?.organizationName || organizationData?.name || '',
      // FIXED: Add doctor reference
      doctorId: doctorData?.id || doctorData?.doctorId || '',
      doctorName: doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : ''
    }));
  };

  // Calculate BMI
  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData(prev => ({ ...prev, bmi }));
    }
  };

  useEffect(() => {
    calculateBMI();
  }, [formData.height, formData.weight]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const steps = ['Personal Info', 'Medical History', 'Lifestyle & Insurance', 'Review & Create'];

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field) => (event, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Personal Info
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
        
      case 1: // Medical History
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.height) newErrors.height = 'Height is required';
        if (!formData.weight) newErrors.weight = 'Weight is required';
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

  const savePatientToFirebase = async (patientData) => {
    try {
      const patientsCollection = collection(db, 'patients');
      
      const docRef = await addDoc(patientsCollection, {
        ...patientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        // Organization linkage for AI analysis
        organizationId: userData?.organizationId || organizationData?.id,
        organizationName: userData?.organizationName || organizationData?.name,
        // Doctor linkage
        doctorId: doctorData?.id || doctorData?.doctorId,
        doctorName: doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : '',
        // Searchable fields
        searchName: `${patientData.firstName} ${patientData.lastName}`.toLowerCase(),
        searchEmail: patientData.email?.toLowerCase() || '',
        searchPatientId: patientData.patientId.toLowerCase(),
        // AI analysis fields
        aiAnalysisStatus: 'pending',
        riskFactors: [],
        predictedConditions: [],
        healthScore: null
      });
      
      console.log('Patient saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving patient to Firebase:', error);
      throw new Error(`Failed to save patient: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    const patientData = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
      // Ensure organization linkage
      organizationId: userData?.organizationId || organizationData?.id,
      organizationName: userData?.organizationName || organizationData?.name,
      // Ensure doctor linkage
      doctorId: doctorData?.id || doctorData?.doctorId,
      doctorName: doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : '',
      // Calculate age for AI analysis
      age: calculateAge(formData.dateOfBirth),
      // Full name for searching
      fullName: `${formData.firstName} ${formData.lastName}`
    };

    console.log('Submitting Patient Data for AI Analysis:', patientData);

    setLoading(true);

    try {
      const firebaseId = await savePatientToFirebase(patientData);
      
      showSnackbar('Patient added successfully! AI analysis in progress...', 'success');
      
      setTimeout(() => {
        onClose();
        setActiveStep(0);
        setActiveTab(0);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          maritalStatus: '',
          emergencyContact: '',
          address: '',
          bloodGroup: '',
          height: '',
          weight: '',
          bmi: '',
          primaryPhysician: '',
          allergies: [],
          currentMedications: [],
          pastMedications: [],
          chronicConditions: [],
          surgicalHistory: [],
          familyHistory: [],
          smokingStatus: '',
          alcoholConsumption: '',
          exerciseFrequency: '',
          dietType: '',
          occupation: '',
          insuranceProvider: '',
          insuranceId: '',
          policyNumber: '',
          patientId: '',
          organizationId: '',
          organizationName: '',
          medicalRecordNumber: '',
          doctorId: '',
          doctorName: ''
        });
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Error saving patient:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
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
                  label="First Name *"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name *"
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
                  label="Phone *"
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
                  label="Date of Birth *"
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
                  <InputLabel>Gender *</InputLabel>
                  <Select
                    value={formData.gender}
                    label="Gender *"
                    onChange={handleChange('gender')}
                  >
                    {genders.map(gender => (
                      <MenuItem key={gender} value={gender}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {gender === 'Male' && <Male />}
                          {gender === 'Female' && <Female />}
                          {gender === 'Other' && <Transgender />}
                          {gender}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    value={formData.maritalStatus}
                    label="Marital Status"
                    onChange={handleChange('maritalStatus')}
                  >
                    {maritalStatuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleChange('emergencyContact')}
                  placeholder="Name and phone number"
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
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <MedicalServices sx={{ mr: 1 }} />
              Medical Information & History
            </Typography>

            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="Vitals" icon={<MonitorHeart />} iconPosition="start" />
              <Tab label="Medical History" icon={<History />} iconPosition="start" />
              <Tab label="Allergies & Medications"  iconPosition="start" /> {/* FIXED: Added icon */}
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth error={!!errors.bloodGroup}>
                    <InputLabel>Blood Group *</InputLabel>
                    <Select
                      value={formData.bloodGroup}
                      label="Blood Group *"
                      onChange={handleChange('bloodGroup')}
                    >
                      {bloodGroups.map(group => (
                        <MenuItem key={group} value={group}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Bloodtype />
                            {group}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bloodGroup && <FormHelperText>{errors.bloodGroup}</FormHelperText>}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Height (cm) *"
                    type="number"
                    value={formData.height}
                    onChange={handleChange('height')}
                    error={!!errors.height}
                    helperText={errors.height}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Height color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Weight (kg) *"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange('weight')}
                    error={!!errors.weight}
                    helperText={errors.weight}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      // FIXED: Replaced Weight with FitnessCenter
                      startAdornment: (
                        <InputAdornment position="start">
                          <FitnessCenter color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="BMI"
                    value={formData.bmi}
                    InputProps={{ readOnly: true }}
                    helperText={formData.bmi ? getBMICategory(formData.bmi) : 'Calculate by entering height and weight'}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Primary Physician"
                    value={formData.primaryPhysician}
                    onChange={handleChange('primaryPhysician')}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={commonConditions}
                    value={formData.chronicConditions}
                    onChange={handleArrayChange('chronicConditions')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chronic Conditions"
                        placeholder="Add chronic conditions"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.surgicalHistory}
                    onChange={handleArrayChange('surgicalHistory')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Surgical History"
                        placeholder="List previous surgeries"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.familyHistory}
                    onChange={handleArrayChange('familyHistory')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Family Medical History"
                        placeholder="Family history of diseases"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={commonAllergies}
                    value={formData.allergies}
                    onChange={handleArrayChange('allergies')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Allergies"
                        placeholder="List all allergies"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={commonMedications}
                    value={formData.currentMedications}
                    onChange={handleArrayChange('currentMedications')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Current Medications"
                        placeholder="List current medications"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={commonMedications}
                    value={formData.pastMedications}
                    onChange={handleArrayChange('pastMedications')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Past Medications"
                        placeholder="List past medications"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Psychology sx={{ mr: 1 }} />
              Lifestyle & Insurance Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Smoking Status</InputLabel>
                  <Select
                    value={formData.smokingStatus}
                    label="Smoking Status"
                    onChange={handleChange('smokingStatus')}
                  >
                    {smokingStatuses.map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Alcohol Consumption</InputLabel>
                  <Select
                    value={formData.alcoholConsumption}
                    label="Alcohol Consumption"
                    onChange={handleChange('alcoholConsumption')}
                  >
                    {alcoholFrequencies.map(freq => (
                      <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Exercise Frequency</InputLabel>
                  <Select
                    value={formData.exerciseFrequency}
                    label="Exercise Frequency"
                    onChange={handleChange('exerciseFrequency')}
                  >
                    {exerciseFrequencies.map(freq => (
                      <MenuItem key={freq} value={freq}>{freq}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Diet Type</InputLabel>
                  <Select
                    value={formData.dietType}
                    label="Diet Type"
                    onChange={handleChange('dietType')}
                  >
                    {dietTypes.map(diet => (
                      <MenuItem key={diet} value={diet}>{diet}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={formData.occupation}
                  onChange={handleChange('occupation')}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  <Business sx={{ mr: 1 }} />
                  Insurance Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={handleChange('insuranceProvider')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Insurance ID"
                  value={formData.insuranceId}
                  onChange={handleChange('insuranceId')}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Policy Number"
                  value={formData.policyNumber}
                  onChange={handleChange('policyNumber')}
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
              Review Patient Information
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Review all information before creating the patient record. 
              This data will be used for AI-powered health analysis and diagnosis.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <Person sx={{ mr: 1 }} />
                    Personal Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Name:</strong> {formData.firstName} {formData.lastName}</Typography>
                    <Typography><strong>Age:</strong> {formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : 'N/A'}</Typography>
                    <Typography><strong>Gender:</strong> {formData.gender}</Typography>
                    <Typography><strong>Contact:</strong> {formData.phone}</Typography>
                    <Typography><strong>Email:</strong> {formData.email || 'N/A'}</Typography>
                  </Box>
                </Card>

                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <MedicalServices sx={{ mr: 1 }} />
                    Medical Summary
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Blood Group:</strong> {formData.bloodGroup || 'N/A'}</Typography>
                    <Typography><strong>BMI:</strong> {formData.bmi || 'N/A'} {formData.bmi && `(${getBMICategory(formData.bmi)})`}</Typography>
                    <Typography><strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(', ') : 'None'}</Typography>
                    <Typography><strong>Chronic Conditions:</strong> {formData.chronicConditions.length > 0 ? formData.chronicConditions.join(', ') : 'None'}</Typography>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <Business sx={{ mr: 1 }} />
                    System Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Organization:</strong> {userData?.organizationName || organizationData?.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {userData?.organizationId || organizationData?.id}
                    </Typography>
                    <Typography><strong>Assigned Doctor:</strong> {doctorData ? `Dr. ${doctorData.firstName} ${doctorData.lastName}` : 'N/A'}</Typography>
                    <Typography><strong>Patient ID:</strong> 
                      <Chip label={generatedPatientId} size="small" color="primary" sx={{ ml: 1 }} />
                    </Typography>
                    <Typography><strong>Medical Record #:</strong> 
                      <Chip label={formData.medicalRecordNumber} size="small" variant="outlined" sx={{ ml: 1 }} />
                    </Typography>
                  </Box>
                </Card>

                <Card variant="outlined" sx={{ p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Typography variant="h6" gutterBottom>
                    <Psychology sx={{ mr: 1 }} />
                    AI Analysis Ready
                  </Typography>
                  <Typography variant="body2">
                    This patient data will be analyzed by our AI system to:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    <li>Identify health risks and patterns</li>
                    <li>Suggest preventive measures</li>
                    <li>Provide diagnostic insights</li>
                    <li>Monitor treatment effectiveness</li>
                  </Box>
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
        sx={{
          backdropFilter: 'blur(10px)',
          '& .MuiDialog-paper': {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #2E8B57 0%, #4682B4 100%)', 
          color: 'white',
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', width: 56, height: 56 }}>
              <LocalHospital sx={{ fontSize: 32, color: '#2E8B57' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="bold">
                Add New Patient
              </Typography>
              <Typography variant="subtitle1">
                Complete patient profile for AI-powered health analysis
              </Typography>
              {doctorData && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.9 }}>
                  Assigned Doctor: Dr. {doctorData.firstName} {doctorData.lastName}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button 
              onClick={onClose} 
              startIcon={<Cancel />}
              color="inherit"
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button 
                  onClick={handleSubmit}
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2E8B57 0%, #4682B4 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #26734d 0%, #3a6fa1 100%)',
                    }
                  }}
                >
                  {loading ? 'Creating Patient...' : 'Create Patient Record'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext}
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2E8B57 0%, #4682B4 100%)',
                  }}
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
      />
    </>
  );
};

export default AddingPatientForm;