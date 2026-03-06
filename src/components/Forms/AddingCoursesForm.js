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
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  Slider,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  IconButton,
  InputAdornment,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  Add, 
  School, 
  Code, 
  Info, 
  Group,
  Payment,
  Description,
  Checklist,
  Assessment,
  Settings,
  AutoAwesome
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/education/AddingCoursesForm.css';

const AddingCoursesForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    department: '',
    credits: 3,
    duration: '15 weeks',
    description: '',
    prerequisites: [],
    learningObjectives: [],
    assessmentMethods: [],
    isActive: true,
    maxStudents: 30,
    fee: 0,
    level: 'Undergraduate',
    semester: 'Fall 2024'
  });

  const [activeStep, setActiveStep] = useState(0);
  const [generatedCourseId, setGeneratedCourseId] = useState('');
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Literature',
    'History & Social Studies',
    'Economics & Business',
    'Arts & Music',
    'Physical Education',
    'Languages',
    'Special Education'
  ];

  const assessmentMethods = [
    'Exams',
    'Assignments',
    'Projects',
    'Presentations',
    'Quizzes',
    'Lab Work',
    'Research Paper',
    'Case Studies',
    'Portfolio',
    'Peer Assessment'
  ];

  const levels = ['Undergraduate', 'Graduate', 'Doctoral', 'Certificate'];
  const semesters = ['Fall 2024', 'Spring 2024', 'Summer 2024', 'Fall 2025'];

  // Load organization data and generate course ID
  useEffect(() => {
    if (open) {
      const storedUserData = localStorage.getItem('lastOrganizationCredentials');
      if (storedUserData) {
        try {
          const orgData = JSON.parse(storedUserData);
          setOrganizationData(orgData);
          generateCourseId(orgData);
        } catch (error) {
          console.error('Error parsing organization data:', error);
          showSnackbar('Error loading organization data', 'error');
        }
      }
    }
  }, [open]);

  // Generate unique course ID based on organization
  const generateCourseId = (orgData) => {
    if (!orgData) return;
    
    const orgPrefix = orgData.organizationId 
      ? orgData.organizationId.slice(0, 4).toUpperCase() 
      : 'EDU';
    
    const timestamp = Date.now().toString().slice(-4);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const newCourseId = `${orgPrefix}-CRS-${timestamp}${randomNum}`;
    setGeneratedCourseId(newCourseId);
    
    // Auto-fill course code if empty
    setFormData(prev => ({
      ...prev,
      courseCode: prev.courseCode || newCourseId
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleArrayChange = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const saveCourseToFirebase = async (courseData) => {
    try {
      // Reference to the courses collection in Firestore
      const coursesCollection = collection(db, 'courses');
      
      // Add document to Firestore
      const docRef = await addDoc(coursesCollection, {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: courseData.isActive ? 'Active' : 'Inactive',
        // Ensure organization linkage
        organizationId: organizationData?.organizationId,
        organizationName: organizationData?.organizationName,
        // Add searchable fields
        searchCourseCode: courseData.courseCode.toLowerCase(),
        searchCourseName: courseData.courseName.toLowerCase(),
        searchCourseId: courseData.courseId.toLowerCase(),
        searchDepartment: courseData.department.toLowerCase()
      });
      
      console.log('Course saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving course to Firebase:', error);
      throw new Error(`Failed to save course: ${error.message}`);
    }
  };

  const saveCourseToLocalStorage = (courseData) => {
    try {
      const existingCourses = JSON.parse(localStorage.getItem('courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('courses', JSON.stringify(existingCourses));
      console.log('Course saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSubmit = async () => {
    const courseData = {
      ...formData,
      courseId: generatedCourseId,
      organizationId: organizationData?.organizationId,
      organizationName: organizationData?.organizationName,
      createdAt: new Date().toISOString(),
      enrolledStudents: 0,
      status: formData.isActive ? 'Active' : 'Inactive'
    };

    console.log('Submitting Course Data:', courseData);

    setLoading(true);

    try {
      // Save to Firebase Firestore
      const firebaseId = await saveCourseToFirebase(courseData);
      
      // Also save to localStorage for offline access
      saveCourseToLocalStorage({
        ...courseData,
        firebaseId: firebaseId // Store Firebase document ID for reference
      });

      showSnackbar('Course created successfully and saved to database!', 'success');
      
      // Reset form and close
      setTimeout(() => {
        setFormData({
          courseCode: '',
          courseName: '',
          department: '',
          credits: 3,
          duration: '15 weeks',
          description: '',
          prerequisites: [],
          learningObjectives: [],
          assessmentMethods: [],
          isActive: true,
          maxStudents: 30,
          fee: 0,
          level: 'Undergraduate',
          semester: 'Fall 2024'
        });
        setActiveStep(0);
        setLoading(false);
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error saving course:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const steps = ['Basic Information', 'Course Details', 'Objectives & Assessment', 'Review & Create'];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Organization Info */}
            <Grid item xs={12}>
              <Card className="org-info-card" elevation={1}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <School />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {organizationData?.organizationName || 'Educational Institution'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Organization ID: {organizationData?.organizationId || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Course ID Display */}
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                icon={<Code />}
                action={
                  <IconButton 
                    onClick={() => generateCourseId(organizationData)} 
                    size="small"
                    disabled={loading}
                  >
                    <AutoAwesome />
                  </IconButton>
                }
              >
                <Typography variant="subtitle2" gutterBottom>
                  Course ID: <strong>{generatedCourseId}</strong>
                </Typography>
                <Typography variant="body2">
                  This unique ID connects the course to your organization
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                value={formData.courseCode}
                onChange={handleChange('courseCode')}
                className="form-field"
                placeholder="e.g., CS101"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Code />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={formData.courseName}
                onChange={handleChange('courseName')}
                className="form-field"
                placeholder="e.g., Introduction to Programming"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <School />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
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
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={formData.level}
                  label="Level"
                  onChange={handleChange('level')}
                >
                  {levels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credits"
                type="number"
                value={formData.credits}
                onChange={handleChange('credits')}
                className="form-field"
                inputProps={{ min: 1, max: 6 }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={formData.semester}
                  label="Semester"
                  onChange={handleChange('semester')}
                >
                  {semesters.map(semester => (
                    <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={handleChange('duration')}
                className="form-field"
                placeholder="e.g., 15 weeks"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Fee"
                type="number"
                value={formData.fee}
                onChange={handleChange('fee')}
                className="form-field"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange('description')}
                className="form-field"
                placeholder="Describe the course content, learning outcomes, and key topics..."
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="section-title" gutterBottom>
                Prerequisites
              </Typography>
              <Box className="chips-container">
                {formData.prerequisites.map((prereq, index) => (
                  <Chip
                    key={index}
                    label={prereq}
                    onDelete={() => !loading && removeArrayItem('prerequisites', index)}
                    className="chip"
                    color="primary"
                    variant="outlined"
                    disabled={loading}
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Add prerequisite course (Press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value && !loading) {
                      handleArrayChange('prerequisites', e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="chip-input"
                  sx={{ minWidth: 200 }}
                  disabled={loading}
                />
              </Box>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="section-title" gutterBottom>
                Learning Objectives
              </Typography>
              <Box className="chips-container">
                {formData.learningObjectives.map((objective, index) => (
                  <Chip
                    key={index}
                    label={objective}
                    onDelete={() => !loading && removeArrayItem('learningObjectives', index)}
                    className="chip"
                    color="secondary"
                    variant="outlined"
                    disabled={loading}
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Add learning objective (Press Enter)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value && !loading) {
                      handleArrayChange('learningObjectives', e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="chip-input"
                  sx={{ minWidth: 250 }}
                  disabled={loading}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" className="section-title" gutterBottom>
                Assessment Methods
              </Typography>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Select Assessment Methods</InputLabel>
                <Select
                  multiple
                  value={formData.assessmentMethods}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    assessmentMethods: e.target.value
                  }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} className="chip" color="info" size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {assessmentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      <Checklist sx={{ mr: 1, fontSize: 18 }} />
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" className="section-title" gutterBottom>
                Course Settings
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isActive: e.target.checked
                        }))}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label="Active Course"
                  />
                  <Typography variant="caption" color="textSecondary" display="block">
                    Course will be available for enrollment
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography gutterBottom variant="body2">
                      Maximum Students: <strong>{formData.maxStudents}</strong>
                    </Typography>
                    <Slider
                      value={formData.maxStudents}
                      onChange={(e, newValue) => setFormData(prev => ({
                        ...prev,
                        maxStudents: newValue
                      }))}
                      min={10}
                      max={100}
                      step={5}
                      valueLabelDisplay="auto"
                      disabled={loading}
                      marks={[
                        { value: 10, label: '10' },
                        { value: 50, label: '50' },
                        { value: 100, label: '100' }
                      ]}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Ready to create course for {organizationData?.organizationName}
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={2} className="review-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Course Information
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ReviewItem label="Course ID" value={generatedCourseId} />
                    <ReviewItem label="Course Code" value={formData.courseCode} />
                    <ReviewItem label="Course Name" value={formData.courseName} />
                    <ReviewItem label="Department" value={formData.department} />
                    <ReviewItem label="Level" value={formData.level} />
                    <ReviewItem label="Credits" value={formData.credits} />
                    <ReviewItem label="Semester" value={formData.semester} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2} className="review-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Course Details
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ReviewItem label="Duration" value={formData.duration} />
                    <ReviewItem label="Course Fee" value={`$${formData.fee}`} />
                    <ReviewItem label="Max Students" value={formData.maxStudents} />
                    <ReviewItem label="Status" value={formData.isActive ? 'Active' : 'Inactive'} />
                    <ReviewItem 
                      label="Prerequisites" 
                      value={formData.prerequisites.length > 0 ? formData.prerequisites.join(', ') : 'None'} 
                    />
                    <ReviewItem 
                      label="Assessment Methods" 
                      value={formData.assessmentMethods.join(', ')} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {formData.description && (
              <Grid item xs={12}>
                <Card elevation={2} className="review-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Description
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formData.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        );

      default:
        return null;
    }
  };

  const ReviewItem = ({ label, value }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #f0f0f0' }}>
      <Typography variant="body2" color="textSecondary">{label}:</Typography>
      <Typography variant="body2" fontWeight="500">{value}</Typography>
    </Box>
  );

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth 
        className="course-form-dialog"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle className="form-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <School />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="600">
                Create New Course
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {organizationData?.organizationName ? 
                  `For ${organizationData.organizationName}` : 
                  'Define course details and requirements'
                }
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box className="course-form-content">
            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 1 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Step Content */}
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        
        <DialogActions className="form-actions">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: 2 }}>
            <Button 
              onClick={activeStep === 0 ? onClose : handleBack} 
              startIcon={<Cancel />} 
              className="cancel-button"
              disabled={loading}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {activeStep < steps.length - 1 && (
                <Button 
                  onClick={handleNext} 
                  variant="contained" 
                  className="next-button"
                  endIcon={<AutoAwesome />}
                  disabled={loading}
                >
                  Next
                </Button>
              )}
              
              {activeStep === steps.length - 1 && (
                <Button 
                  onClick={handleSubmit} 
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />} 
                  className="submit-button" 
                  variant="contained"
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Course'}
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

export default AddingCoursesForm;