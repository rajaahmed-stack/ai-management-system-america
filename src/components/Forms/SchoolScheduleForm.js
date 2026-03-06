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
  RadioGroup,
  Radio,
  FormLabel,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Avatar,
  InputAdornment,
  Divider,
  CircularProgress,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  Schedule, 
  Person, 
  School, 
  MeetingRoom,
  CalendarToday,
  AccessTime,
  Group,
  CheckCircle,
  Warning,
  AutoAwesome,
  Refresh
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../styles/education/ScheduleForm.css';

const SchoolScheduleForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    courseId: '',
    teacherId: '',
    className: '',
    room: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    recurrence: 'weekly',
    maxStudents: 30,
    isActive: true,
    description: ''
  });

  const [activeStep, setActiveStep] = useState(0);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [conflictCheck, setConflictCheck] = useState({ checked: false, hasConflict: false, conflicts: [] });
  const [organizationData, setOrganizationData] = useState(null);

  const classes = [
    'Grade 10-A',
    'Grade 10-B',
    'Grade 11-A',
    'Grade 11-B',
    'Grade 12-A',
    'Grade 12-B'
  ];

  const rooms = [
    'Room 101 - Main Building',
    'Room 102 - Main Building',
    'Room 201 - Science Wing',
    'Room 202 - Science Wing',
    'Science Lab A',
    'Science Lab B',
    'Computer Lab 1',
    'Computer Lab 2',
    'Art Studio',
    'Music Room',
    'Auditorium',
    'Library Conference Room'
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const recurrencePatterns = [
    { value: 'weekly', label: 'Weekly', description: 'Every week on the same day' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Every two weeks' },
    { value: 'daily', label: 'Daily', description: 'Every weekday (Monday-Friday)' },
    { value: 'monthly', label: 'Monthly', description: 'First week of each month' },
    { value: 'custom', label: 'Custom', description: 'Custom recurrence pattern' }
  ];

  // Load organization data and fetch courses/teachers
  useEffect(() => {
    if (open) {
      const storedUserData = localStorage.getItem('lastOrganizationCredentials');
      if (storedUserData) {
        try {
          const orgData = JSON.parse(storedUserData);
          setOrganizationData(orgData);
          fetchCoursesAndTeachers(orgData.organizationId);
        } catch (error) {
          console.error('Error parsing organization data:', error);
          showSnackbar('Error loading organization data', 'error');
        }
      }
    }
  }, [open]);

  const fetchCoursesAndTeachers = async (organizationId) => {
    setLoading(true);
    try {
      // Fetch courses from Firebase
      const coursesQuery = query(
        collection(db, 'courses'),
        where('organizationId', '==', organizationId)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(coursesData);

      // Fetch teachers from Firebase
      const teachersQuery = query(
        collection(db, 'teachers'),
        where('organizationId', '==', organizationId)
      );
      const teachersSnapshot = await getDocs(teachersQuery);
      const teachersData = teachersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTeachers(teachersData);

    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error loading courses and teachers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Reset conflict check when schedule changes
    if (['courseId', 'teacherId', 'room', 'dayOfWeek', 'startTime', 'endTime'].includes(field)) {
      setConflictCheck({ checked: false, hasConflict: false, conflicts: [] });
    }
  };

  const checkForConflicts = async () => {
    if (!formData.dayOfWeek || !formData.startTime || !formData.endTime) {
      showSnackbar('Please select day and time first', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Simulate conflict check - in real app, query existing schedules
      const conflictsQuery = query(
        collection(db, 'schedules'),
        where('organizationId', '==', organizationData.organizationId),
        where('dayOfWeek', '==', formData.dayOfWeek),
        where('room', '==', formData.room)
      );
      
      const conflictsSnapshot = await getDocs(conflictsQuery);
      const conflicts = conflictsSnapshot.docs.map(doc => doc.data());

      const hasConflict = conflicts.some(schedule => {
        const scheduleStart = schedule.startTime;
        const scheduleEnd = schedule.endTime;
        return timeOverlap(formData.startTime, formData.endTime, scheduleStart, scheduleEnd);
      });

      setConflictCheck({
        checked: true,
        hasConflict,
        conflicts: hasConflict ? conflicts : []
      });

      if (hasConflict) {
        showSnackbar('Scheduling conflicts detected!', 'warning');
      } else {
        showSnackbar('No scheduling conflicts found', 'success');
      }

    } catch (error) {
      console.error('Error checking conflicts:', error);
      showSnackbar('Error checking for conflicts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const timeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 < end1;
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const saveScheduleToFirebase = async (scheduleData) => {
    try {
      const schedulesCollection = collection(db, 'schedules');
      
      const docRef = await addDoc(schedulesCollection, {
        ...scheduleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: scheduleData.isActive ? 'Active' : 'Inactive',
        organizationId: organizationData?.organizationId,
        organizationName: organizationData?.organizationName,
        // Add searchable fields
        searchCourse: scheduleData.courseId.toLowerCase(),
        searchTeacher: scheduleData.teacherId.toLowerCase(),
        searchRoom: scheduleData.room.toLowerCase()
      });
      
      console.log('Schedule saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving schedule to Firebase:', error);
      throw new Error(`Failed to save schedule: ${error.message}`);
    }
  };

  const saveScheduleToLocalStorage = (scheduleData) => {
    try {
      const existingSchedules = JSON.parse(localStorage.getItem('schedules') || '[]');
      existingSchedules.push(scheduleData);
      localStorage.setItem('schedules', JSON.stringify(existingSchedules));
      console.log('Schedule saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSubmit = async () => {
    if (conflictCheck.hasConflict) {
      showSnackbar('Please resolve scheduling conflicts before saving', 'error');
      return;
    }

    const scheduleData = {
      ...formData,
      createdAt: new Date().toISOString(),
      status: formData.isActive ? 'Active' : 'Inactive',
      organizationId: organizationData?.organizationId,
      organizationName: organizationData?.organizationName
    };

    console.log('Submitting Schedule Data:', scheduleData);

    setLoading(true);

    try {
      // Save to Firebase Firestore
      const firebaseId = await saveScheduleToFirebase(scheduleData);
      
      // Also save to localStorage for offline access
      saveScheduleToLocalStorage({
        ...scheduleData,
        firebaseId: firebaseId
      });

      showSnackbar('Schedule created successfully!', 'success');
      
      // Reset form and close
      setTimeout(() => {
        setFormData({
          courseId: '',
          teacherId: '',
          className: '',
          room: '',
          dayOfWeek: '',
          startTime: '',
          endTime: '',
          startDate: '',
          endDate: '',
          recurrence: 'weekly',
          maxStudents: 30,
          isActive: true,
          description: ''
        });
        setActiveStep(0);
        setConflictCheck({ checked: false, hasConflict: false, conflicts: [] });
        setLoading(false);
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error saving schedule:', error);
      showSnackbar(`Error: ${error.message}`, 'error');
      setLoading(false);
    }
  };

  const steps = ['Basic Info', 'Schedule Timing', 'Review & Create'];

  const getSelectedCourse = () => courses.find(c => c.id === formData.courseId);
  const getSelectedTeacher = () => teachers.find(t => t.id === formData.teacherId);

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
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
                        Create schedule for your organization
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={formData.courseId}
                  label="Select Course"
                  onChange={handleChange('courseId')}
                  startAdornment={
                    <InputAdornment position="start">
                      <School color="action" />
                    </InputAdornment>
                  }
                >
                  {courses.map(course => (
                    <MenuItem key={course.id} value={course.id}>
                      <Box>
                        <Typography variant="body1">{course.courseName}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {course.courseCode} • {course.department}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Assign Teacher</InputLabel>
                <Select
                  value={formData.teacherId}
                  label="Assign Teacher"
                  onChange={handleChange('teacherId')}
                  startAdornment={
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  }
                >
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      <Box>
                        <Typography variant="body1">{teacher.firstName} {teacher.lastName}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {teacher.department} • {teacher.qualification}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Select Class</InputLabel>
                <Select
                  value={formData.className}
                  label="Select Class"
                  onChange={handleChange('className')}
                  startAdornment={
                    <InputAdornment position="start">
                      <Group color="action" />
                    </InputAdornment>
                  }
                >
                  {classes.map(cls => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Room/Lab</InputLabel>
                <Select
                  value={formData.room}
                  label="Room/Lab"
                  onChange={handleChange('room')}
                  startAdornment={
                    <InputAdornment position="start">
                      <MeetingRoom color="action" />
                    </InputAdornment>
                  }
                >
                  {rooms.map(room => (
                    <MenuItem key={room} value={room}>{room}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange('description')}
                className="form-field"
                placeholder="Add any additional notes about this schedule..."
                disabled={loading}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" className="section-title" gutterBottom>
                <AccessTime sx={{ mr: 1 }} />
                Schedule Timing
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth className="form-field" disabled={loading}>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={formData.dayOfWeek}
                  label="Day of Week"
                  onChange={handleChange('dayOfWeek')}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarToday color="action" />
                    </InputAdornment>
                  }
                >
                  {daysOfWeek.map(day => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={handleChange('startTime')}
                InputLabelProps={{ shrink: true }}
                className="form-field"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTime color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={handleChange('endTime')}
                InputLabelProps={{ shrink: true }}
                className="form-field"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" className="section-title" gutterBottom>
                Date Range
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={handleChange('startDate')}
                InputLabelProps={{ shrink: true }}
                className="form-field"
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                InputLabelProps={{ shrink: true }}
                className="form-field"
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" className="section-title" gutterBottom>
                Recurrence Pattern
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={formData.recurrence}
                  onChange={handleChange('recurrence')}
                >
                  <Grid container spacing={2}>
                    {recurrencePatterns.map(pattern => (
                      <Grid item xs={12} sm={6} key={pattern.value}>
                        <Card 
                          variant={formData.recurrence === pattern.value ? "outlined" : "elevation"}
                          sx={{ 
                            p: 2, 
                            cursor: 'pointer',
                            border: formData.recurrence === pattern.value ? '2px solid' : '1px solid',
                            borderColor: formData.recurrence === pattern.value ? 'primary.main' : 'divider',
                            backgroundColor: formData.recurrence === pattern.value ? 'primary.50' : 'background.paper'
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, recurrence: pattern.value }))}
                        >
                          <FormControlLabel
                            value={pattern.value}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1">{pattern.label}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {pattern.description}
                                </Typography>
                              </Box>
                            }
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" className="section-title" gutterBottom>
                Additional Settings
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Students"
                type="number"
                value={formData.maxStudents}
                onChange={handleChange('maxStudents')}
                className="form-field"
                inputProps={{ min: 1, max: 50 }}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Group color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
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
                label="Active Schedule"
              />
            </Grid>

            {/* Conflict Check */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={loading ? <CircularProgress size={20} /> : <Schedule />}
                      onClick={checkForConflicts}
                      disabled={loading || !formData.dayOfWeek || !formData.startTime || !formData.endTime}
                    >
                      Check for Conflicts
                    </Button>
                    
                    {conflictCheck.checked && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {conflictCheck.hasConflict ? (
                          <>
                            <Warning color="warning" />
                            <Typography variant="body2" color="warning.main">
                              Scheduling conflicts detected
                            </Typography>
                          </>
                        ) : (
                          <>
                            <CheckCircle color="success" />
                            <Typography variant="body2" color="success.main">
                              No conflicts found
                            </Typography>
                          </>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  <Tooltip title="Refresh Data">
                    <IconButton onClick={() => fetchCoursesAndTeachers(organizationData.organizationId)}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {conflictCheck.hasConflict && conflictCheck.conflicts.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Conflicts Found:
                    </Typography>
                    <ul>
                      {conflictCheck.conflicts.map((conflict, index) => (
                        <li key={index}>
                          {conflict.courseId} in {conflict.room} at {conflict.startTime} - {conflict.endTime}
                        </li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </Card>
            </Grid>
          </Grid>
        );

      case 2:
        const selectedCourse = getSelectedCourse();
        const selectedTeacher = getSelectedTeacher();
        
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Review the schedule details before creating
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card elevation={2} className="review-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <School sx={{ mr: 1 }} />
                    Course & Teacher
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ReviewItem label="Course" value={selectedCourse?.courseName || 'N/A'} />
                    <ReviewItem label="Course Code" value={selectedCourse?.courseCode || 'N/A'} />
                    <ReviewItem label="Department" value={selectedCourse?.department || 'N/A'} />
                    <ReviewItem label="Teacher" value={selectedTeacher ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}` : 'N/A'} />
                    <ReviewItem label="Teacher Department" value={selectedTeacher?.department || 'N/A'} />
                    <ReviewItem label="Class" value={formData.className} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={2} className="review-card">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <Schedule sx={{ mr: 1 }} />
                    Schedule Details
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <ReviewItem label="Room" value={formData.room} />
                    <ReviewItem label="Day" value={formData.dayOfWeek} />
                    <ReviewItem label="Time" value={`${formData.startTime} - ${formData.endTime}`} />
                    <ReviewItem label="Date Range" value={`${formData.startDate} to ${formData.endDate}`} />
                    <ReviewItem label="Recurrence" value={recurrencePatterns.find(p => p.value === formData.recurrence)?.label} />
                    <ReviewItem label="Max Students" value={formData.maxStudents} />
                    <ReviewItem label="Status" value={formData.isActive ? 'Active' : 'Inactive'} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {conflictCheck.hasConflict && (
              <Grid item xs={12}>
                <Alert severity="error">
                  Cannot create schedule - conflicts detected! Please go back and resolve them.
                </Alert>
              </Grid>
            )}

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
        className="schedule-form-dialog"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle className="form-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Schedule />
            </Avatar>
            <Box>
              <Typography variant="h4" component="div" fontWeight="600">
                Create Class Schedule
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {organizationData?.organizationName ? 
                  `Schedule for ${organizationData.organizationName}` : 
                  'Assign courses to teachers and schedule classes'
                }
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box className="schedule-form-content">
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
                  disabled={loading || !formData.courseId || !formData.teacherId}
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
                  disabled={loading || conflictCheck.hasConflict}
                >
                  {loading ? 'Creating...' : 'Create Schedule'}
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

export default SchoolScheduleForm;