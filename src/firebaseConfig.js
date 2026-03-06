// firebaseConfig.js - Clean version
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB0BW7uzsQONctb84CS5UMIaKNgb0WRm70",
  authDomain: "nexus-ai-app-e1df1.firebaseapp.com",
  projectId: "nexus-ai-app-e1df1",
  storageBucket: "nexus-ai-app-e1df1.firebasestorage.app",
  messagingSenderId: "1002477286877",
  appId: "1:1002477286877:web:13fbf1ab005e3d3d1df234",
  measurementId: "G-LZPEK28ZDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connection monitoring
export const checkFirebaseConnection = async () => {
  try {
    await enableNetwork(db);
    console.log('✅ Firebase Firestore connection enabled');
    return true;
  } catch (error) {
    console.error('❌ Firebase Firestore connection failed:', error);
    return false;
  }
};