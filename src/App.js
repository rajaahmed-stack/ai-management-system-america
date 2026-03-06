import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './context/LoginPage';
import Signup from './context/Signup';
import OrganizationLogin from './context/OrganizationLogin';
// import AdminDashboard from './pages/Dashboard/AdminDashboard';
// import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';
import DashboardRouter from './components/dashboards/DashboardRouter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/organization-login" element={<OrganizationLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                  <DashboardRouter/>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;