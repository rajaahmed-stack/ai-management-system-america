// components/finance/EmployeeDepartmentForm.js
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
  FormLabel,
  Switch
} from '@mui/material';
import { 
  PhotoCamera, 
  Save, 
  Cancel, 
  Person, 
  Business, 
  Work, 
  LocationOn,
  Email,
  Phone,
  Badge,
  Security,
  AccountBalance,
  TrendingUp,
  Psychology,
  Groups,
  Department,
  AttachMoney,
  Calculate
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/finance/EmployeeAddingForm.css';

const EmployeeDepartmentForm = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Form data for Employee
  const [employeeData, setEmployeeData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Professional Information
    employeeId: '',
    department: '',
    position: '',
    salary: '',
    joinDate: '',
    employmentType: 'full-time',
    
    // Financial Information
    baseSalary: '',
    bonusPotential: '',
    stockOptions: '',
    benefits: '',
    
    // Financial Profile
    riskTolerance: 'moderate',
    financialGoals: '',
    investmentExperience: 'beginner',
    debtAmount: '',
    savingsAmount: '',
    
    // System Generated
    organizationId: '',
    organizationName: '',
    password: ''
  });

  // Form data for Department
  const [departmentData, setDepartmentData] = useState({
    departmentName: '',
    departmentCode: '',
    manager: '',
    budget: '',
    teamSize: '',
    location: '',
    financialGoals: '',
    riskAppetite: 'medium',
    investmentFocus: 'growth',
    performanceMetrics: ''
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);

  // Fetch organization data and existing departments
  useEffect(() => {
    const storedUserData = localStorage.getItem('lastOrganizationCredentials');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        
        if (parsedData.organizationId) {
          generateEmployeeId(parsedData.organizationId);
          loadExistingDepartments(parsedData.organizationId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        showSnackbar('Error loading organization data', 'error');
      }
    }
  }, [open]);

  // Load existing departments from database
  const loadExistingDepartments = async (orgId) => {
    try {
      // Simulate API call to fetch departments
      const mockDepartments = [
        'Engineering & Technology',
        'Sales & Business Development',
        'Marketing & Communications',
        'Finance & Accounting',
        'Human Resources',
        'Operations & Logistics',
        'Research & Development',
        'Customer Success',
        'Product Management',
        'Executive Leadership'
      ];
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  // Generate unique employee ID
  const generateEmployeeId = (orgId) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    const employeeId = `EMP_${orgId}_${timestamp}_${random}`;
    
    setGeneratedEmployeeId(employeeId);
    setEmployeeData(prev => ({
      ...prev,
      employeeId: employeeId,
      organizationId: orgId,
      organizationName: userData?.organizationName || ''
    }));
  };

  // Generate department code
  const generateDepartmentCode = () => {
    const code = departmentData.departmentName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
    
    setDepartmentData(prev => ({
      ...prev,
      departmentCode: code
    }));
  };

  // Generate secure password
  const generatePassword = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setEmployeeData(prev => ({
      ...prev,
      password: password
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const steps = ['Basic Information', 'Financial Profile', 'Review & Create'];

  const positions = [
    'Software Engineer',
    'Senior Developer',
    'Team Lead',
    'Project Manager',
    'Product Manager',
    'Data Analyst',
    'Financial Analyst',
    'Sales Executive',
    'Marketing Specialist',
    'HR Manager',
    'Operations Manager',
    'Executive Director'
  ];

  const employmentTypes = [
    'full-time',
    'part-time',
    'contract',
    'intern',
    'freelance'
  ];

  const riskToleranceLevels = [
    { value: 'conservative', label: 'Conservative', description: 'Prefers low-risk investments' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk approach' },
    { value: 'aggressive', label: 'Aggressive', description: 'High-risk, high-reward focus' }
  ];

  const investmentExperienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to investing' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some investment experience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced investor' }
  ];

  const riskAppetiteOptions = [
    { value: 'low', label: 'Low Risk', color: 'success' },
    { value: 'medium', label: 'Medium Risk', color: 'warning' },
    { value: 'high', label: 'High Risk', color: 'error' }
  ];

  const investmentFocusOptions = [
    'Growth',
    'Value',
    'Income',
    'Balanced',
    'Aggressive Growth',
    'Conservative'
  ];

  const handleEmployeeChange = (field) => (event) => {
    setEmployeeData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDepartmentChange = (field) => (event) => {
    setDepartmentData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEmployeeStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!employeeData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!employeeData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!employeeData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(employeeData.email)) {
          newErrors.email = 'Email is invalid';
        }
        if (!employeeData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!employeeData.position) newErrors.position = 'Position is required';
        if (!employeeData.department) newErrors.department = 'Department is required';
        break;
        
      case 1:
        if (!employeeData.baseSalary) newErrors.baseSalary = 'Base salary is required';
        if (!employeeData.riskTolerance) newErrors.riskTolerance = 'Risk tolerance is required';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDepartmentStep = () => {
    const newErrors = {};
    
    if (!departmentData.departmentName.trim()) newErrors.departmentName = 'Department name is required';
    if (!departmentData.budget) newErrors.budget = 'Budget is required';
    if (!departmentData.manager.trim()) newErrors.manager = 'Manager is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeTab === 0 && validateEmployeeStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Save employee to Firebase
  const saveEmployeeToFirebase = async (employeeData) => {
    try {
      const employeesCollection = collection(db, 'finance_employees');
      
      const docRef = await addDoc(employeesCollection, {
        ...employeeData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        role: 'employee',
        // Financial wellness metrics
        financialWellnessScore: calculateWellnessScore(employeeData),
        lastAssessment: serverTimestamp(),
        // Search optimization
        searchName: `${employeeData.firstName} ${employeeData.lastName}`.toLowerCase(),
        searchEmail: employeeData.email.toLowerCase(),
        searchEmployeeId: employeeData.employeeId.toLowerCase()
      });
      
      console.log('Employee saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving employee to Firebase:', error);
      throw new Error(`Failed to save employee: ${error.message}`);
    }
  };

  // Save department to Firebase
  const saveDepartmentToFirebase = async (departmentData) => {
    try {
      const departmentsCollection = collection(db, 'finance_departments');
      
      const docRef = await addDoc(departmentsCollection, {
        ...departmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        organizationId: userData?.organizationId,
        organizationName: userData?.organizationName,
        // Financial metrics
        currentSpending: 0,
        budgetUtilization: 0,
        // Search optimization
        searchName: departmentData.departmentName.toLowerCase(),
        searchCode: departmentData.departmentCode.toLowerCase()
      });
      
      console.log('Department saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving department to Firebase:', error);
      throw new Error(`Failed to save department: ${error.message}`);
    }
  };

  // Calculate financial wellness score
  const calculateWellnessScore = (data) => {
    let score = 50; // Base score
    
    // Adjust based on risk tolerance
    if (data.riskTolerance === 'conservative') score += 10;
    else if (data.riskTolerance === 'moderate') score += 20;
    else if (data.riskTolerance === 'aggressive') score += 5;
    
    // Adjust based on investment experience
    if (data.investmentExperience === 'intermediate') score += 15;
    else if (data.investmentExperience === 'advanced') score += 25;
    
    // Adjust based on debt (lower debt = higher score)
    const debt = parseFloat(data.debtAmount) || 0;
    if (debt < 10000) score += 20;
    else if (debt < 50000) score += 10;
    
    // Adjust based on savings (higher savings = higher score)
    const savings = parseFloat(data.savingsAmount) || 0;
    if (savings > 20000) score += 25;
    else if (savings > 10000) score += 15;
    else if (savings > 5000) score += 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const handleEmployeeSubmit = async () => {
    if (!employeeData.password) {
      generatePassword();
    }

    const finalEmployeeData = {
      ...employeeData,
      createdAt: new Date().toISOString(),
      status: 'active',
      role: 'employee',
      fullName: `${employeeData.firstName} ${employeeData.lastName}`,
      financialWellnessScore: calculateWellnessScore(employeeData),
      lastAssessment: new Date().toISOString()
    };

    console.log('Submitting Employee Data:', finalEmployeeData);

    setLoading(true);

    try {
      const firebaseId = await saveEmployeeToFirebase(finalEmployeeData);
      showSnackbar('Employee added successfully to finance system!', 'success');
      
      setTimeout(() => {
        onClose();
        resetForms();
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error saving employee:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const handleDepartmentSubmit = async () => {
    if (validateDepartmentStep()) {
      setLoading(true);

      try {
        const firebaseId = await saveDepartmentToFirebase(departmentData);
        showSnackbar('Department created successfully!', 'success');
        
        setTimeout(() => {
          onClose();
          resetForms();
          setLoading(false);
        }, 1500);

      } catch (error) {
        console.error('Error saving department:', error);
        showSnackbar(`Error: ${error.message}`, 'error');
        setLoading(false);
      }
    }
  };

  const resetForms = () => {
    setActiveStep(0);
    setActiveTab(0);
    setEmployeeData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      employeeId: '',
      department: '',
      position: '',
      salary: '',
      joinDate: '',
      employmentType: 'full-time',
      baseSalary: '',
      bonusPotential: '',
      stockOptions: '',
      benefits: '',
      riskTolerance: 'moderate',
      financialGoals: '',
      investmentExperience: 'beginner',
      debtAmount: '',
      savingsAmount: '',
      organizationId: '',
      organizationName: '',
      password: ''
    });
    setDepartmentData({
      departmentName: '',
      departmentCode: '',
      manager: '',
      budget: '',
      teamSize: '',
      location: '',
      financialGoals: '',
      riskAppetite: 'medium',
      investmentFocus: 'growth',
      performanceMetrics: ''
    });
  };

  const renderEmployeeStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <Person sx={{ mr: 1 }} />
              Employee Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={employeeData.firstName}
                  onChange={handleEmployeeChange('firstName')}
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
                  value={employeeData.lastName}
                  onChange={handleEmployeeChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={employeeData.email}
                  onChange={handleEmployeeChange('email')}
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
                  value={employeeData.phone}
                  onChange={handleEmployeeChange('phone')}
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
                <FormControl fullWidth error={!!errors.position}>
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={employeeData.position}
                    label="Position"
                    onChange={handleEmployeeChange('position')}
                  >
                    {positions.map(position => (
                      <MenuItem key={position} value={position}>{position}</MenuItem>
                    ))}
                  </Select>
                  {errors.position && <FormHelperText>{errors.position}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.department}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={employeeData.department}
                    label="Department"
                    onChange={handleEmployeeChange('department')}
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                  {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={employeeData.employmentType}
                    label="Employment Type"
                    onChange={handleEmployeeChange('employmentType')}
                  >
                    {employmentTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Join Date"
                  type="date"
                  value={employeeData.joinDate}
                  onChange={handleEmployeeChange('joinDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title" gutterBottom>
              <AccountBalance sx={{ mr: 1 }} />
              Financial Profile & Compensation
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Salary"
                  type="number"
                  value={employeeData.baseSalary}
                  onChange={handleEmployeeChange('baseSalary')}
                  error={!!errors.baseSalary}
                  helperText={errors.baseSalary}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bonus Potential"
                  type="number"
                  value={employeeData.bonusPotential}
                  onChange={handleEmployeeChange('bonusPotential')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Options"
                  value={employeeData.stockOptions}
                  onChange={handleEmployeeChange('stockOptions')}
                  placeholder="Number of shares or value"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Benefits Package"
                  value={employeeData.benefits}
                  onChange={handleEmployeeChange('benefits')}
                  placeholder="Health insurance, retirement, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Risk Tolerance</FormLabel>
                  <RadioGroup
                    value={employeeData.riskTolerance}
                    onChange={handleEmployeeChange('riskTolerance')}
                    row
                  >
                    {riskToleranceLevels.map(level => (
                      <FormControlLabel
                        key={level.value}
                        value={level.value}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="body1">{level.label}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {level.description}
                            </Typography>
                          </Box>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Investment Experience</InputLabel>
                  <Select
                    value={employeeData.investmentExperience}
                    label="Investment Experience"
                    onChange={handleEmployeeChange('investmentExperience')}
                  >
                    {investmentExperienceLevels.map(level => (
                      <MenuItem key={level.value} value={level.value}>
                        <Box>
                          <Typography variant="body1">{level.label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {level.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Debt"
                  type="number"
                  value={employeeData.debtAmount}
                  onChange={handleEmployeeChange('debtAmount')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Savings"
                  type="number"
                  value={employeeData.savingsAmount}
                  onChange={handleEmployeeChange('savingsAmount')}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Financial Goals"
                  multiline
                  rows={2}
                  value={employeeData.financialGoals}
                  onChange={handleEmployeeChange('financialGoals')}
                  placeholder="Retirement, home purchase, education, etc."
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
              Review Employee Profile
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Review all information before creating the employee account. 
              The system will generate unique credentials and financial wellness assessment.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="review-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Employee Information
                    </Typography>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                      <Typography variant="body1">{employeeData.firstName} {employeeData.lastName}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Position</Typography>
                      <Chip label={employeeData.position} size="small" color="primary" />
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                      <Typography variant="body1">{employeeData.department}</Typography>
                    </Box>
                    
                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Compensation</Typography>
                      <Typography variant="body1">${employeeData.baseSalary} base + ${employeeData.bonusPotential} bonus</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" className="credentials-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Financial Profile
                    </Typography>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Risk Tolerance</Typography>
                      <Chip 
                        label={employeeData.riskTolerance} 
                        size="small" 
                        color={
                          employeeData.riskTolerance === 'conservative' ? 'success' :
                          employeeData.riskTolerance === 'moderate' ? 'warning' : 'error'
                        }
                      />
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Investment Experience</Typography>
                      <Typography variant="body1">{employeeData.investmentExperience}</Typography>
                    </Box>

                    <Box className="review-item">
                      <Typography variant="subtitle2" color="textSecondary">Financial Wellness Score</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress 
                          variant="determinate" 
                          value={calculateWellnessScore(employeeData)} 
                          size={40}
                          color={
                            calculateWellnessScore(employeeData) >= 70 ? 'success' :
                            calculateWellnessScore(employeeData) >= 40 ? 'warning' : 'error'
                          }
                        />
                        <Typography variant="h6">
                          {calculateWellnessScore(employeeData)}/100
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" className="system-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      System Credentials
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
                            <Badge sx={{ fontSize: 16, mr: 0.5 }} />
                            Employee ID
                          </Typography>
                          <Typography variant="body1" className="employee-id">
                            {generatedEmployeeId}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box className="review-item">
                          <Typography variant="subtitle2" color="textSecondary">
                            Login Password
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" className="password-display">
                              {employeeData.password || 'Not generated yet'}
                            </Typography>
                            <Button 
                              size="small" 
                              onClick={generatePassword}
                              variant="outlined"
                            >
                              Generate
                            </Button>
                          </Box>
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

  const renderDepartmentForm = () => (
    <Box className="department-form">
      <Typography variant="h6" className="step-title" gutterBottom>
        <Business sx={{ mr: 1 }} />
        Create New Department
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Create a new department to organize employees and manage budgets within your financial system.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Department Name"
            value={departmentData.departmentName}
            onChange={handleDepartmentChange('departmentName')}
            error={!!errors.departmentName}
            helperText={errors.departmentName}
            onBlur={generateDepartmentCode}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {/* <Department color="action" /> */}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Department Code"
            value={departmentData.departmentCode}
            onChange={handleDepartmentChange('departmentCode')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Badge color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Department Manager"
            value={departmentData.manager}
            onChange={handleDepartmentChange('manager')}
            error={!!errors.manager}
            helperText={errors.manager}
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
            label="Team Size"
            type="number"
            value={departmentData.teamSize}
            onChange={handleDepartmentChange('teamSize')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Groups color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Annual Budget"
            type="number"
            value={departmentData.budget}
            onChange={handleDepartmentChange('budget')}
            error={!!errors.budget}
            helperText={errors.budget}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Risk Appetite</InputLabel>
            <Select
              value={departmentData.riskAppetite}
              label="Risk Appetite"
              onChange={handleDepartmentChange('riskAppetite')}
            >
              {riskAppetiteOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Chip 
                    label={option.label} 
                    size="small" 
                    color={option.color}
                    variant="outlined"
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Investment Focus</InputLabel>
            <Select
              value={departmentData.investmentFocus}
              label="Investment Focus"
              onChange={handleDepartmentChange('investmentFocus')}
            >
              {investmentFocusOptions.map(focus => (
                <MenuItem key={focus} value={focus}>{focus}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={departmentData.location}
            onChange={handleDepartmentChange('location')}
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
            label="Financial Goals"
            multiline
            rows={3}
            value={departmentData.financialGoals}
            onChange={handleDepartmentChange('financialGoals')}
            placeholder="Department-specific financial objectives and targets..."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Performance Metrics"
            multiline
            rows={2}
            value={departmentData.performanceMetrics}
            onChange={handleDepartmentChange('performanceMetrics')}
            placeholder="KPIs, ROI targets, efficiency metrics..."
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        className="finance-form-dialog"
      >
        <DialogTitle className="form-header">
          <Box className="header-content">
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <Groups sx={{ fontSize: 32 }} />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" component="div" className="form-title">
                Finance System Management
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Add employees and departments to {userData?.organizationName}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent className="form-content">
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setActiveStep(0);
            }}
            className="form-tabs"
          >
            <Tab 
              icon={<Person />} 
              label="Add Employee" 
              className={`form-tab ${activeTab === 0 ? 'active' : ''}`}
            />
            <Tab 
              icon={<Business />} 
              label="Create Department" 
              className={`form-tab ${activeTab === 1 ? 'active' : ''}`}
            />
          </Tabs>

          {activeTab === 0 ? (
            <>
              <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {renderEmployeeStepContent(activeStep)}
            </>
          ) : (
            renderDepartmentForm()
          )}
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
              {activeTab === 0 ? (
                <>
                  <Button 
                    onClick={handleBack}
                    disabled={activeStep === 0 || loading}
                    className="back-button"
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button 
                      onClick={handleEmployeeSubmit} 
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      className="submit-button"
                      variant="contained"
                      disabled={!employeeData.password || loading}
                    >
                      {loading ? 'Creating Employee...' : 'Create Employee Account'}
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
                </>
              ) : (
                <Button 
                  onClick={handleDepartmentSubmit} 
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  className="submit-button"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Creating Department...' : 'Create Department'}
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

export default EmployeeDepartmentForm;