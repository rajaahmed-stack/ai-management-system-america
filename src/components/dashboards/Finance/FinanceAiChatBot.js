// components/ai-features/AIChatBot/AIChatBot.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Avatar,
  Fab,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Send,
  SmartToy,
  Close,
  AutoAwesome,
  Psychology,
  TrendingUp,
  Savings,
  Analytics
} from '@mui/icons-material';
import '../../../styles/finance/FinanceAiChatBot.css';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI Service
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      'budget': "Based on your spending patterns, I recommend allocating 50% to needs, 30% to wants, and 20% to savings. Consider reducing dining out expenses by 15%.",
      'investment': "Your portfolio shows good diversification. I suggest increasing tech sector exposure by 5% for better growth potential.",
      'savings': "You're saving 18% of your income - great job! To reach your $10K goal faster, try automating an extra $200 monthly transfer.",
      'debt': "Your debt-to-income ratio is healthy. Focus on paying off the 7.5% loan first while making minimum payments on others.",
      'default': "I've analyzed your financial data. Here are my recommendations:\n\n1. Optimize subscription services - save ~$85/month\n2. Refinance auto loan - potential 1.2% rate reduction\n3. Increase 401K contribution to get full employer match\n4. Consider tax-loss harvesting opportunities"
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;
    
    if (lowerMessage.includes('budget')) response = responses.budget;
    else if (lowerMessage.includes('invest')) response = responses.investment;
    else if (lowerMessage.includes('save')) response = responses.savings;
    else if (lowerMessage.includes('debt')) response = responses.debt;

    setIsTyping(false);
    return response;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      type: 'user', 
      content: input, 
      timestamp: new Date(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const aiResponse = await generateAIResponse(input);
    const aiMessage = { 
      type: 'ai', 
      content: aiResponse, 
      timestamp: new Date(),
      id: Date.now() + 1
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const sampleQuestions = [
    { 
      question: "How can I improve my budget?", 
      icon: <Analytics />,
      type: "budget"
    },
    { 
      question: "Should I invest in stocks?", 
      icon: <TrendingUp />,
      type: "investment"
    },
    { 
      question: "Help me save more money", 
      icon: <Savings />,
      type: "savings"
    },
    { 
      question: "Analyze my spending patterns", 
      icon: <Psychology />,
      type: "analysis"
    }
  ];

  const handleQuickQuestion = async (question) => {
    setInput(question);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        className={`chat-fab ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <SmartToy />
      </Fab>

      {/* Chat Window */}
      {isOpen && (
        <Card className="ai-chat-window">
          <CardContent className="chat-header">
            <Box className="chat-title">
              <Avatar className="ai-avatar">
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="h6">FinSight AI Assistant</Typography>
                <Typography variant="caption" className="online-status">
                  ● Online - Real-time Analysis
                </Typography>
              </Box>
            </Box>
            <Box className="header-actions">
              <Tooltip title="AI Insights">
                <AutoAwesome className="insight-icon" />
              </Tooltip>
              <IconButton onClick={() => setIsOpen(false)} className="close-btn">
                <Close />
              </IconButton>
            </Box>
          </CardContent>

          <CardContent className="chat-messages">
            {messages.length === 0 ? (
              <Box className="welcome-message">
                <Avatar className="welcome-avatar">
                  <SmartToy />
                </Avatar>
                <Typography variant="h6" className="welcome-title">
                  Hello! I'm your AI Financial Assistant
                </Typography>
                <Typography variant="body2" className="welcome-subtitle">
                  I can analyze your finances, provide personalized advice, and help you make better financial decisions.
                </Typography>
                
                <Box className="sample-questions">
                  <Typography variant="subtitle2" className="questions-title">
                    Quick Questions:
                  </Typography>
                  {sampleQuestions.map((item, index) => (
                    <Chip
                      key={index}
                      icon={item.icon}
                      label={item.question}
                      onClick={() => handleQuickQuestion(item.question)}
                      className="question-chip"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <>
                {messages.map((message) => (
                  <Box key={message.id} className={`message ${message.type}`}>
                    {message.type === 'ai' && (
                      <Avatar className="message-avatar">
                        <SmartToy />
                      </Avatar>
                    )}
                    <Box className="message-content">
                      <Typography variant="body2" className="message-text">
                        {message.content}
                      </Typography>
                      <Typography variant="caption" className="timestamp">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Typography>
                    </Box>
                    {message.type === 'user' && (
                      <Avatar className="message-avatar user">
                        {/* {userData?.adminName?.charAt(0) || 'U'} */}
                      </Avatar>
                    )}
                  </Box>
                ))}
                {isTyping && (
                  <Box className="message ai typing">
                    <Avatar className="message-avatar">
                      <SmartToy />
                    </Avatar>
                    <Box className="message-content">
                      <Box className="typing-indicator">
                        <CircularProgress size={16} />
                        <Typography variant="body2" className="typing-text">
                          AI is analyzing your finances...
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardContent className="chat-input-container">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask about your finances, investments, or budgeting..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="message-input"
              multiline
              maxRows={3}
            />
            <IconButton 
              onClick={handleSend} 
              className="send-button"
              disabled={!input.trim() || isTyping}
            >
              <Send />
            </IconButton>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIChatBot;