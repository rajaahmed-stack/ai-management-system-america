// AuthContext.js - Complete fixed version
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  enableNetwork
} from 'firebase/firestore';
import emailjs from '@emailjs/browser';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      console.log('🟢 App came online');
      setIsOnline(true);
      enableNetwork(db).catch(console.error);
    };
    const handleOffline = () => {
      console.log('🔴 App went offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const generateCredentials = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    const orgId = 'ORG_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return { password, orgId };
  };

  const getIndustrySettings = (industry) => {
    const settings = {
      Healthcare: {
        aiModels: ['patient_diagnosis', 'medical_imaging', 'treatment_recommendation'],
        features: ['hipaa_compliance', 'patient_data_analytics', 'medical_records'],
        permissions: ['manage_patients', 'view_medical_data', 'generate_reports'],
        dataIsolation: 'strict',
        compliance: ['HIPAA', 'GDPR']
      },
      Finance: {
        aiModels: ['fraud_detection', 'risk_assessment', 'investment_analytics'],
        features: ['pci_compliance', 'transaction_monitoring', 'risk_management'],
        permissions: ['view_financial_data', 'manage_transactions', 'generate_reports'],
        dataIsolation: 'strict',
        compliance: ['PCI-DSS', 'SOX', 'GDPR']
      },
    };
    
    return settings[industry] || {
      aiModels: ['custom_models', 'data_analytics', 'process_automation'],
      features: ['basic_analytics', 'reporting', 'automation'],
      permissions: ['view_data', 'generate_reports'],
      dataIsolation: 'standard',
      compliance: ['GDPR']
    };
  };
  const testEmailJSSetup = async () => {
  try {
    console.log('🧪 Testing EmailJS complete setup...');
    
    // Test 1: Check if EmailJS is properly loaded
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS not loaded');
    }
    
    // Test 2: Initialize with your public key
    emailjs.init("rGT_mi5Q3yBg3CR9E");
    console.log('✅ EmailJS initialized');
    
    // Test 3: Send a simple test email
    const testParams = {
      to_email: "test@example.com",
      admin_name: "Test User",
      organization_name: "Test Organization",
      organization_id: "TEST_123",
      password: "testpass123",
      login_url: "http://localhost:3000/login"
    };
    
    console.log('📤 Sending test email with params:', testParams);
    
    const result = await emailjs.send(
      'service_ak1vmxu',
      'template_777d4ls',
      testParams
    );
    
    console.log('✅ EmailJS test successful!', result);
    return true;
    
  } catch (error) {
    console.error('❌ EmailJS setup test failed:', {
      status: error.status,
      text: error.text,
      message: error.message,
      fullError: error
    });
    return false;
  }
};

  const sendWelcomeEmail = async (email, organizationId, password, organizationName, adminName) => {
  try {
    console.log('📧 Starting email sending process...');
    console.log('📧 Recipient email:', email);
    
    // Validate email first
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address: ' + email);
    }

    // Log credentials to console
    console.log('=== ORGANIZATION CREDENTIALS ===');
    console.log('Organization ID:', organizationId);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('================================');

    // Store credentials in localStorage
    const credentialsData = {
      email,
      organizationId,
      password,
      organizationName,
      adminName,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('lastOrganizationCredentials', JSON.stringify(credentialsData));

    let emailSent = false;

    try {
      console.log('🔄 Initializing EmailJS...');
      
      // Initialize EmailJS with your public key
      emailjs.init("rGT_mi5Q3yBg3CR9E");

      // CRITICAL FIX: Match EXACT variable names from your template
      const templateParams = {
        to_email: email,           // Matches {{to_email}} in template
        admin_name: adminName,     // Matches {{admin_name}} in template  
        organization_name: organizationName, // Matches {{organization_name}}
        organization_id: organizationId,     // Matches {{organization_id}}
        password: password,        // Matches {{password}}
        // Add any other variables your template uses
        login_url: `${window.location.origin}/organization-login`,
        from_name: 'NexusAI Team'
      };

      console.log('📤 Sending email via EmailJS with exact template variables:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        'service_ak1vmxu',    // Your Service ID
        'template_777d4ls',   // Your Template ID
        templateParams
      );

      console.log('✅ Email sent successfully!', result);
      emailSent = true;
      
      setEmailStatus({ 
        success: true, 
        message: 'Welcome email sent successfully! Check your inbox.' 
      });

    } catch (emailError) {
      console.error('❌ EmailJS failed with details:', {
        status: emailError.status,
        text: emailError.text,
        message: emailError.message
      });
      
      // Fallback method
      const subject = `Welcome to NexusAI - ${organizationName}`;
      const body = `Hello ${adminName},

Your organization "${organizationName}" has been successfully created!

🔐 Login Credentials:
Organization ID: ${organizationId}
Password: ${password}
Email: ${email}

🌐 Access Your Dashboard:
${window.location.origin}/organization-login

Best regards,
NexusAI Team`;

      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      localStorage.setItem('lastEmailDraft', mailtoLink);
      
      setEmailStatus({ 
        success: false, 
        message: `Automatic email failed. Use the options below to email credentials.`,
        fallbackDraft: mailtoLink
      });
    }

    return emailSent;

  } catch (error) {
    console.error('❌ Email setup failed:', error);
    setEmailStatus({ 
      success: false, 
      message: 'Email system error. Please use the download options.' 
    });
    return false;
  }
};

  // Enhanced signup with better error handling
 const signupWithOrganization = async (userData) => {
  console.log('🚀 Starting organization signup process...');
  
  if (!isOnline) {
    throw new Error('No internet connection. Please check your network and try again.');
  }

  let userCredential;
  
  try {
    // Generate credentials
    const credentials = generateCredentials();
    
    console.log('👤 Creating user with email:', userData.email);
    
    // Create user with generated password
    userCredential = await createUserWithEmailAndPassword(auth, userData.email, credentials.password);
    const user = userCredential.user;

    console.log('✅ User created successfully:', user.uid);

    // Create organization document
    console.log('🏢 Creating organization document...');
    const orgData = {
      name: userData.organizationName,
      industry: userData.industry,
      size: userData.organizationSize,
      adminId: user.uid,
      organizationId: credentials.orgId,
      // ✅ CRITICAL FIX: Save the password to Firestore
      password: credentials.password, // This is what's missing!
      createdAt: new Date(),
      settings: getIndustrySettings(userData.industry),
      subscription: userData.subscribeNewsletter ? 'free_trial' : 'free',
      trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      employees: [],
      aiModels: [],
      isActive: true,
      email: userData.email,
      adminName: userData.fullName
    };

    console.log('📊 Organization data to save:', orgData);
    
    // Create organization document
    const orgCollection = collection(db, 'organizations');
    const orgDocRef = await addDoc(orgCollection, orgData);
    console.log('✅ Organization created in Firestore with ID:', orgDocRef.id);

    // Create user document
    console.log('📄 Creating user document...');
    const userDocData = {
      fullName: userData.fullName,
      email: userData.email,
      role: 'admin',
      organizationName: userData.organizationName,
      industry: userData.industry,
      organizationSize: userData.organizationSize,
      organizationId: orgDocRef.id,
      systemOrganizationId: credentials.orgId,
      // ✅ Also save password in user document for backup
      password: credentials.password,
      createdAt: new Date(),
      lastLogin: new Date(),
      permissions: ['admin_all'],
      emailVerified: false,
      subscription: userData.subscribeNewsletter ? 'free_trial' : 'free'
    };

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userDocData);
    console.log('✅ User document saved to Firestore');

    // Set user data in context
    setUserData(userDocData);

    // Send welcome email
    console.log('📧 Sending welcome email...');
    const emailSent = await sendWelcomeEmail(
      userData.email,
      credentials.orgId,
      credentials.password,
      userData.organizationName,
      userData.fullName
    );

    console.log('🎉 Signup process completed successfully!');

    return {
      userCredential,
      credentials: {
        orgId: credentials.orgId,
        password: credentials.password,
        emailSent: emailSent
      },
      emailStatus
    };

  } catch (error) {
    console.error('❌ Signup failed:', error);
    
    let errorMessage = error.message;
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Database permission denied. Please check Firestore security rules.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use a different email.';
    } else if (error.code === 'firestore/unavailable') {
      errorMessage = 'Database is temporarily unavailable. Please try again.';
    }
    
    throw new Error(errorMessage);
  }
};

  // Regular Email Login
  const login = async (email, password) => {
    try {
      if (!isOnline) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Organization ID Login
const loginWithOrganization = async (organizationId, password) => {
  try {
    if (!isOnline) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    console.log('🔍 Searching for:', organizationId);

    let userData = null;
    let userType = null;

    // SEARCH 1: Check teachers collection by teacherId
    const teachersQuery = query(
      collection(db, 'teachers'), 
      where('teacherId', '==', organizationId)
    );
    const teachersSnapshot = await getDocs(teachersQuery);
    
    if (!teachersSnapshot.empty) {
      userData = teachersSnapshot.docs[0].data();
      userType = 'teacher';
      console.log('✅ Teacher found:', userData.fullName);
    }
    const doctorssQuery = query(
      collection(db, 'doctors'), 
      where('doctorId', '==', organizationId)
    );
    const doctorsSnapshot = await getDocs(doctorssQuery);
    
    if (!doctorsSnapshot.empty) {
      userData = doctorsSnapshot.docs[0].data();
      userType = 'doctor';
      console.log('✅ Doctor found:', userData.fullName);
    }
    const employeesQuery = query(
      collection(db, 'finance_employees'), 
      where('employeeId', '==', organizationId)
    );
    const employeeSnapshot = await getDocs(employeesQuery);
    
    if (!employeeSnapshot.empty) {
      userData = employeeSnapshot.docs[0].data();
      userType = 'employee';
      console.log('✅ Employee found:', userData.fullName);
    }

    // SEARCH 2: Check organizations collection by organizationId
    if (!userData) {
      const orgsQuery = query(
        collection(db, 'organizations'), 
        where('organizationId', '==', organizationId)
      );
      const orgsSnapshot = await getDocs(orgsQuery);
      
      if (!orgsSnapshot.empty) {
        userData = orgsSnapshot.docs[0].data();
        userType = 'organization';
        console.log('✅ Organization found:', userData.name);
      }
    }

    // SEARCH 3: Check users collection by systemOrganizationId
    if (!userData) {
      const usersQuery = query(
        collection(db, 'users'), 
        where('systemOrganizationId', '==', organizationId)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      if (!usersSnapshot.empty) {
        userData = usersSnapshot.docs[0].data();
        userType = 'user';
        console.log('✅ User found:', userData.email);
      }
    }

    if (!userData) {
      throw new Error('Invalid Organization ID or Teacher ID');
    }

    console.log('🔑 Checking password...');

    // SIMPLE PASSWORD CHECK - Compare with Firestore password
    const storedPassword = userData.password;
    
    if (!storedPassword) {
      throw new Error('No password set for this account. Please contact administrator.');
    }

    if (password !== storedPassword) {
      throw new Error('Incorrect password. Please try again.');
    }

    console.log('✅ Password correct! Login successful');

    // Store user data (NO FIREBASE AUTH NEEDED)
    setUserData(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userType', userType);
    localStorage.setItem('isLoggedIn', 'true');

    // Set current user to simulate auth
    setCurrentUser({
      uid: organizationId,
      email: userData.email,
      displayName: userData.fullName || userData.name
    });

    return { success: true, user: userData };

  } catch (error) {
    console.error('❌ Login failed:', error);
    throw error;
  }
};
  // Logout function
  const logout = () => {
  setUserData(null);
  setCurrentUser(null);
  setEmailStatus(null);
  localStorage.removeItem('userData');
  localStorage.removeItem('userType');
  localStorage.removeItem('isLoggedIn');
  // No need to call signOut(auth) since we're not using Firebase Auth
};

  useEffect(() => {
  // Check if user is logged in via localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const storedUserData = localStorage.getItem('userData');
  
  if (isLoggedIn === 'true' && storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      setUserData(userData);
      setCurrentUser({
        uid: userData.teacherId || userData.organizationId,
        email: userData.email,
        displayName: userData.fullName || userData.name
      });
      console.log('✅ User loaded from localStorage');
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }
  
  setLoading(false);
}, []);

  // Make sure ALL functions are included in the value object
  const value = {
    currentUser,
    userData,
    signupWithOrganization, // This must be included
    login,
    loginWithOrganization,
    logout,
    generateCredentials,
    emailStatus,
    isOnline,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}