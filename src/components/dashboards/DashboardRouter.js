// import React from 'react';
// import { useAuth } from '../../context/AuthContext';

// // Import ONLY the dashboards we actually have
// import EducationDashboard from './EducationDashboard';
// import TeacherDashboard from './TeacherDashBoard';
// import HealthcareDashboard from './Health/HealthcareDashboard';

// const DashboardRouter = () => {
//   const { userData } = useAuth();

//   console.log('🔄 User Data for Routing:', userData);

//   // SUPER SIMPLE: Just check role first, then industry
//   const getDashboard = () => {
//     // If user is a teacher, show Teacher Dashboard
//     if (userData?.role === 'teacher') {
//       console.log('✅ Routing to Teacher Dashboard');
//       return TeacherDashboard;
//     }

//     // If user is in education industry, show Education Dashboard
//     if (userData?.industry === 'Education') {
//       console.log('✅ Routing to Education Dashboard (Admin)');
//       return EducationDashboard;
//     }

//     // Default fallback - Education Dashboard
//     console.log('🔄 Routing to Default Dashboard');
//     return EducationDashboard;
//   };

//   const DashboardComponent = getDashboard();

//   return <DashboardComponent />;
// };

// export default DashboardRouter;
// DashboardRouter.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Import all industry dashboards
import EducationDashboard from './EducationDashboard';
import TeacherDashboard from './TeacherDashBoard';
import HealthcareDashboard from './Health/HealthcareDashboard';
import DoctorDashboard from './Health/DoctorDashboard';
import FinanceDashboard from './Finance/FinanceDashboard';
import EmployeeDashboard from './Finance/EmployeeDashboard';
// import RetailDashboard from './retail/RetailDashboard';
// import ManufacturingDashboard from './manufacturing/ManufacturingDashboard';
import LegalDashboard from './Legal/LegalDashboard';
import MusicDashboard from './Music/MusicDashboard';
// import TechnologyDashboard from './technology/TechnologyDashboard';
// import LogisticsDashboard from './logistics/LogisticsDashboard';
import RealEstateDashboard from './Real Estate/RealEstateDashboard';
// import DefaultDashboard from './DefaultDashboard';

const DashboardRouter = () => {
  const { userData } = useAuth();

  console.log('🔄 User Data for Routing:', userData);

  const getDashboard = () => {
    // Teacher role takes priority
    if (userData?.role === 'teacher') {
      console.log('✅ Routing to Teacher Dashboard');
      return TeacherDashboard;
    }
    if (userData?.role === 'doctor') {
      console.log('✅ Routing to Doctor Dashboard');
      return DoctorDashboard;
    }
    if (userData?.role === 'employee') {
      console.log('✅ Routing to Employee Dashboard');
      return EmployeeDashboard;
    }

    // Route by industry
    const industryMap = {
      'Education': EducationDashboard,
      'Healthcare': HealthcareDashboard,
      'Finance': FinanceDashboard,
      // 'Retail': RetailDashboard,
      // 'Manufacturing': ManufacturingDashboard,
      'Legal': LegalDashboard,
      'Music': MusicDashboard,
      // 'Technology': TechnologyDashboard,
      // 'Logistics': LogisticsDashboard,
      'RealEstate': RealEstateDashboard,
    };

    const DashboardComponent = industryMap[userData?.industry];
    
    if (DashboardComponent) {
      console.log(`✅ Routing to ${userData.industry} Dashboard`);
      return DashboardComponent;
    }

    console.log('🔄 Routing to Default Dashboard');
    // return DefaultDashboard;
  };

  const DashboardComponent = getDashboard();

  return <DashboardComponent />;
};

export default DashboardRouter;