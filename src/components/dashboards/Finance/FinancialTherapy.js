// components/ai-features/FinancialTherapy/FinancialTherapy.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  Slider,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider
} from '@mui/material';
import {
  Psychology,
  Mood,
  SentimentDissatisfied,
  EmojiEvents,
  Insights,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import '../../../styles/finance/FinancialTherapy.css';

const FinancialTherapy = () => {
  const [userMood, setUserMood] = useState(7);
  const [financialStress, setFinancialStress] = useState(5);
  const [spendingTriggers, setSpendingTriggers] = useState([]);
  const [insights, setInsights] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const spendingTriggersList = [
    'Stress at work',
    'Boredom',
    'Social pressure',
    'Emotional distress',
    'Celebration',
    'Retail therapy',
    'Impulse buying',
    'FOMO (Fear Of Missing Out)'
  ];

  const moodData = [
    { level: 1, icon: <SentimentDissatisfied />, label: 'Very Stressed', color: '#ef4444' },
    { level: 4, icon: <SentimentDissatisfied />, label: 'Stressed', color: '#f59e0b' },
    { level: 7, icon: <Mood />, label: 'Neutral', color: '#eab308' },
    { level: 10, icon: <EmojiEvents />, label: 'Confident', color: '#10b981' }
  ];

  const analyzeFinancialBehavior = () => {
    // Simulate AI analysis
    const newInsights = [
      {
        type: 'behavioral',
        title: 'Emotional Spending Pattern Detected',
        description: 'You tend to spend 35% more on weekends, particularly when stressed.',
        confidence: 87,
        recommendation: 'Try implementing a 24-hour cooling-off period for non-essential purchases.',
        impact: 'High',
        icon: <Psychology />
      },
      {
        type: 'psychological',
        title: 'Stress-Related Spending',
        description: 'Financial stress levels correlate with increased impulse purchases.',
        confidence: 92,
        recommendation: 'Practice mindfulness exercises before making purchasing decisions.',
        impact: 'Medium',
        icon: <Insights />
      },
      {
        type: 'positive',
        title: 'Strong Savings Discipline',
        description: 'You maintain excellent savings habits during stable emotional periods.',
        confidence: 95,
        recommendation: 'Leverage this strength by automating more savings during good weeks.',
        impact: 'Low',
        icon: <TrendingUp />
      }
    ];

    setInsights(newInsights);
    setAnalysisComplete(true);
  };

  const getMoodIcon = (level) => {
    return moodData.find(mood => level <= mood.level)?.icon || <Mood />;
  };

  const getMoodColor = (level) => {
    return moodData.find(mood => level <= mood.level)?.color || '#eab308';
  };

  return (
    <Box className="financial-therapy">
      <Card className="therapy-header-card">
        <CardContent>
          <Box className="header-content">
            <Avatar className="therapy-avatar">
              <Psychology />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" className="therapy-title">
                Financial Therapy AI
              </Typography>
              <Typography variant="body1" className="therapy-subtitle">
                Understand your money mindset and build healthier financial habits
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3} className="therapy-grid">
        {/* Mood Assessment */}
        <Grid item xs={12} md={6}>
          <Card className="assessment-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                Current Financial Mood
              </Typography>
              <Typography variant="body2" className="card-description">
                How are you feeling about your finances right now?
              </Typography>
              
              <Box className="mood-slider-container">
                <Box className="mood-labels">
                  <Typography variant="caption">Very Stressed</Typography>
                  <Typography variant="caption">Very Confident</Typography>
                </Box>
                <Slider
                  value={userMood}
                  onChange={(e, newValue) => setUserMood(newValue)}
                  min={1}
                  max={10}
                  step={1}
                  className="mood-slider"
                  sx={{
                    color: getMoodColor(userMood),
                    height: 8,
                    '& .MuiSlider-thumb': {
                      background: getMoodColor(userMood),
                    }
                  }}
                />
                <Box className="mood-display">
                  <Avatar className="mood-icon" sx={{ bgcolor: getMoodColor(userMood) }}>
                    {getMoodIcon(userMood)}
                  </Avatar>
                  <Typography variant="h6" className="mood-value">
                    {userMood}/10
                  </Typography>
                  <Chip 
                    label={moodData.find(mood => userMood <= mood.level)?.label || 'Neutral'}
                    className="mood-chip"
                    sx={{ bgcolor: getMoodColor(userMood), color: 'white' }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Stress Assessment */}
        <Grid item xs={12} md={6}>
          <Card className="assessment-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                Financial Stress Level
              </Typography>
              <Typography variant="body2" className="card-description">
                How much stress do your finances cause you?
              </Typography>
              
              <Box className="stress-meter">
                <LinearProgress 
                  variant="determinate" 
                  value={financialStress * 10} 
                  className="stress-progress"
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      background: financialStress >= 7 ? 
                        'linear-gradient(45deg, #ef4444, #dc2626)' :
                        financialStress >= 4 ?
                        'linear-gradient(45deg, #f59e0b, #d97706)' :
                        'linear-gradient(45deg, #10b981, #059669)'
                    }
                  }}
                />
                <Box className="stress-labels">
                  <Typography variant="caption">Low Stress</Typography>
                  <Typography variant="h6" className="stress-value">
                    {financialStress}/10
                  </Typography>
                  <Typography variant="caption">High Stress</Typography>
                </Box>
              </Box>

              {financialStress >= 7 && (
                <Box className="stress-warning">
                  <Warning className="warning-icon" />
                  <Typography variant="body2">
                    High stress detected. Consider speaking with a financial counselor.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Spending Triggers */}
        <Grid item xs={12}>
          <Card className="triggers-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                Spending Triggers
              </Typography>
              <Typography variant="body2" className="card-description">
                Select situations that often lead to unplanned spending
              </Typography>
              
              <Grid container spacing={1} className="triggers-grid">
                {spendingTriggersList.map((trigger, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={spendingTriggers.includes(trigger)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSpendingTriggers([...spendingTriggers, trigger]);
                            } else {
                              setSpendingTriggers(spendingTriggers.filter(t => t !== trigger));
                            }
                          }}
                          className="trigger-checkbox"
                        />
                      }
                      label={trigger}
                      className="trigger-label"
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Analysis Button */}
        <Grid item xs={12}>
          <Box className="analysis-action">
            <Button
              variant="contained"
              size="large"
              startIcon={<Psychology />}
              onClick={analyzeFinancialBehavior}
              className="analyze-button"
              disabled={spendingTriggers.length === 0}
            >
              Analyze My Financial Behavior
            </Button>
          </Box>
        </Grid>

        {/* AI Insights */}
        {analysisComplete && (
          <Grid item xs={12}>
            <Card className="insights-card">
              <CardContent>
                <Typography variant="h5" className="insights-title">
                  AI Behavioral Insights
                </Typography>
                <Typography variant="body2" className="insights-subtitle">
                  Personalized recommendations based on your financial psychology
                </Typography>
                
                <Grid container spacing={3} className="insights-grid">
                  {insights.map((insight, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card className={`insight-card ${insight.type}`}>
                        <CardContent>
                          <Box className="insight-header">
                            <Avatar className={`insight-icon ${insight.type}`}>
                              {insight.icon}
                            </Avatar>
                            <Chip 
                              label={`${insight.confidence}% Confidence`}
                              size="small"
                              className="confidence-chip"
                            />
                          </Box>
                          
                          <Typography variant="h6" className="insight-card-title">
                            {insight.title}
                          </Typography>
                          
                          <Typography variant="body2" className="insight-description">
                            {insight.description}
                          </Typography>
                          
                          <Box className="insight-recommendation">
                            <Typography variant="subtitle2" className="recommendation-title">
                              Recommendation:
                            </Typography>
                            <Typography variant="body2" className="recommendation-text">
                              {insight.recommendation}
                            </Typography>
                          </Box>
                          
                          <Box className="insight-footer">
                            <Chip 
                              label={`${insight.impact} Impact`}
                              size="small"
                              className={`impact-chip ${insight.impact.toLowerCase()}`}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Action Plan */}
                <Box className="action-plan">
                  <Typography variant="h6" className="action-plan-title">
                    7-Day Financial Wellness Plan
                  </Typography>
                  <Grid container spacing={2} className="action-steps">
                    {[
                      "Day 1: Track every purchase and note your emotional state",
                      "Day 2: Practice 10-minute financial meditation",
                      "Day 3: Review and categorize last month's spending",
                      "Day 4: Set up spending limits for trigger categories",
                      "Day 5: Celebrate one positive financial habit",
                      "Day 6: Plan next week's spending intentionally",
                      "Day 7: Reflect on progress and adjust goals"
                    ].map((step, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box className="action-step">
                          <Avatar className="step-number">
                            {index + 1}
                          </Avatar>
                          <Typography variant="body2" className="step-text">
                            {step}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FinancialTherapy;