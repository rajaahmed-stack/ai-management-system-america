// components/ai-features/PredictiveAnalytics/PredictiveAnalytics.js
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  ShowChart,
  Timeline,
  Warning,
  CheckCircle,
  AutoAwesome
} from '@mui/icons-material';
import '../../../styles/finance/PredictiveAnalytics.css';

const PredictiveAnalytics = () => {
  const [timeframe, setTimeframe] = useState('6months');
  const [predictions, setPredictions] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, [timeframe]);

  const loadPredictions = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const predictionData = {
      cashFlow: {
        current: 45200,
        predicted: 48700,
        confidence: 88,
        trend: 'up'
      },
      expenses: {
        current: 28500,
        predicted: 30200,
        confidence: 92,
        trend: 'up'
      },
      savings: {
        current: 16700,
        predicted: 18500,
        confidence: 85,
        trend: 'up'
      },
      investments: {
        current: 124500,
        predicted: 138200,
        confidence: 78,
        trend: 'up'
      }
    };

    const scenarioData = [
      {
        name: 'Optimistic Growth',
        probability: '35%',
        description: 'Market outperforms expectations',
        impact: '+15% Returns',
        color: 'success'
      },
      {
        name: 'Base Case',
        probability: '50%',
        description: 'Steady market conditions',
        impact: '+8% Returns',
        color: 'primary'
      },
      {
        name: 'Recession Scenario',
        probability: '15%',
        description: 'Economic downturn',
        impact: '-5% Returns',
        color: 'error'
      }
    ];

    setPredictions(predictionData);
    setScenarios(scenarioData);
    setLoading(false);
  };

  const MetricCard = ({ title, current, predicted, confidence, trend, icon }) => (
    <Card className="metric-card">
      <CardContent>
        <Box className="metric-header">
          <Avatar className="metric-icon">
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" className="metric-title">
              {title}
            </Typography>
            <Chip 
              label={`${confidence}% Confidence`}
              size="small"
              className="confidence-chip"
            />
          </Box>
        </Box>
        
        <Box className="metric-values">
          <Box className="value-current">
            <Typography variant="body2" className="value-label">
              Current
            </Typography>
            <Typography variant="h4" className="value-amount">
              ${current.toLocaleString()}
            </Typography>
          </Box>
          
          <Box className="value-predicted">
            <Typography variant="body2" className="value-label">
              Predicted
            </Typography>
            <Box className="prediction-display">
              {trend === 'up' ? <TrendingUp className="trend-icon up" /> : <TrendingDown className="trend-icon down" />}
              <Typography variant="h4" className="value-amount predicted">
                ${predicted.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={confidence} 
          className="confidence-bar"
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#f1f5f9',
            '& .MuiLinearProgress-bar': {
              background: confidence >= 80 ? 
                'linear-gradient(45deg, #10b981, #059669)' :
                confidence >= 70 ?
                'linear-gradient(45deg, #f59e0b, #d97706)' :
                'linear-gradient(45deg, #ef4444, #dc2626)'
            }
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box className="predictive-analytics">
      <Card className="analytics-header-card">
        <CardContent>
          <Box className="header-content">
            <Avatar className="analytics-avatar">
              <Analytics />
            </Avatar>
            <Box className="header-text">
              <Typography variant="h4" className="analytics-title">
                AI Predictive Analytics
              </Typography>
              <Typography variant="body1" className="analytics-subtitle">
                Machine learning forecasts and scenario analysis for smarter financial decisions
              </Typography>
            </Box>
            <FormControl className="timeframe-select">
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="3months">3 Months</MenuItem>
                <MenuItem value="6months">6 Months</MenuItem>
                <MenuItem value="1year">1 Year</MenuItem>
                <MenuItem value="2years">2 Years</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box className="loading-state">
          <AutoAwesome className="loading-icon" />
          <Typography variant="h6" className="loading-text">
            AI is generating predictions...
          </Typography>
          <LinearProgress className="loading-progress" />
        </Box>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <Grid container spacing={3} className="metrics-grid">
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Cash Flow"
                current={predictions.cashFlow.current}
                predicted={predictions.cashFlow.predicted}
                confidence={predictions.cashFlow.confidence}
                trend={predictions.cashFlow.trend}
                icon={<Timeline />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Monthly Expenses"
                current={predictions.expenses.current}
                predicted={predictions.expenses.predicted}
                confidence={predictions.expenses.confidence}
                trend={predictions.expenses.trend}
                icon={<TrendingDown />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Savings Growth"
                current={predictions.savings.current}
                predicted={predictions.savings.predicted}
                confidence={predictions.savings.confidence}
                trend={predictions.savings.trend}
                icon={<TrendingUp />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Investment Value"
                current={predictions.investments.current}
                predicted={predictions.investments.predicted}
                confidence={predictions.investments.confidence}
                trend={predictions.investments.trend}
                icon={<ShowChart />}
              />
            </Grid>
          </Grid>

          {/* Scenario Analysis */}
          <Grid container spacing={3} className="scenarios-grid">
            <Grid item xs={12} lg={8}>
              <Card className="scenarios-card">
                <CardContent>
                  <Typography variant="h5" className="scenarios-title">
                    Scenario Analysis
                  </Typography>
                  <Typography variant="body2" className="scenarios-subtitle">
                    Probability-weighted outcomes based on market conditions
                  </Typography>
                  
                  <TableContainer className="scenarios-table">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Scenario</TableCell>
                          <TableCell>Probability</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Expected Impact</TableCell>
                          <TableCell>AI Recommendation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scenarios.map((scenario, index) => (
                          <TableRow key={index} className="scenario-row">
                            <TableCell>
                              <Box className="scenario-name">
                                <Chip 
                                  label={scenario.name}
                                  color={scenario.color}
                                  size="small"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1" className="probability-value">
                                {scenario.probability}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" className="scenario-description">
                                {scenario.description}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography 
                                variant="body1" 
                                className={`impact-value ${scenario.color}`}
                              >
                                {scenario.impact}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {scenario.color === 'success' && (
                                <Chip 
                                  icon={<CheckCircle />}
                                  label="Aggressive Growth"
                                  color="success"
                                  size="small"
                                />
                              )}
                              {scenario.color === 'primary' && (
                                <Chip 
                                  icon={<TrendingUp />}
                                  label="Moderate Strategy"
                                  color="primary"
                                  size="small"
                                />
                              )}
                              {scenario.color === 'error' && (
                                <Chip 
                                  icon={<Warning />}
                                  label="Defensive Position"
                                  color="error"
                                  size="small"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card className="recommendations-card">
                <CardContent>
                  <Typography variant="h6" className="recommendations-title">
                    AI Recommendations
                  </Typography>
                  
                  <Box className="recommendations-list">
                    {[
                      {
                        title: "Increase Emergency Fund",
                        description: "Boost savings to cover 6 months of expenses",
                        priority: "High",
                        impact: "Risk Reduction"
                      },
                      {
                        title: "Diversify Investments",
                        description: "Add international exposure to portfolio",
                        priority: "Medium",
                        impact: "Growth Potential"
                      },
                      {
                        title: "Refinance Debt",
                        description: "Consolidate high-interest loans",
                        priority: "High",
                        impact: "Cost Savings"
                      }
                    ].map((rec, index) => (
                      <Box key={index} className="recommendation-item">
                        <Box className="rec-header">
                          <Typography variant="subtitle1" className="rec-title">
                            {rec.title}
                          </Typography>
                          <Chip 
                            label={rec.priority}
                            size="small"
                            className={`priority-chip ${rec.priority.toLowerCase()}`}
                          />
                        </Box>
                        <Typography variant="body2" className="rec-description">
                          {rec.description}
                        </Typography>
                        <Box className="rec-footer">
                          <Chip 
                            label={rec.impact}
                            size="small"
                            variant="outlined"
                            className="impact-chip"
                          />
                          <Button size="small" className="action-button">
                            Implement
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Risk Assessment */}
          <Card className="risk-card">
            <CardContent>
              <Typography variant="h5" className="risk-title">
                Risk Assessment
              </Typography>
              
              <Grid container spacing={3} className="risk-metrics">
                {[
                  { name: "Market Risk", value: 65, level: "Medium", color: "warning" },
                  { name: "Liquidity Risk", value: 30, level: "Low", color: "success" },
                  { name: "Credit Risk", value: 45, level: "Low", color: "success" },
                  { name: "Inflation Risk", value: 75, level: "High", color: "error" }
                ].map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box className="risk-metric">
                      <Typography variant="body2" className="risk-name">
                        {metric.name}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.value} 
                        className="risk-progress"
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': {
                            background: metric.color === 'error' ? 
                              'linear-gradient(45deg, #ef4444, #dc2626)' :
                              metric.color === 'warning' ?
                              'linear-gradient(45deg, #f59e0b, #d97706)' :
                              'linear-gradient(45deg, #10b981, #059669)'
                          }
                        }}
                      />
                      <Box className="risk-info">
                        <Typography variant="body1" className="risk-value">
                          {metric.value}%
                        </Typography>
                        <Chip 
                          label={metric.level}
                          size="small"
                          color={metric.color}
                          className="risk-level"
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default PredictiveAnalytics;