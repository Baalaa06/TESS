import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration - replace with your config from Firebase Console
const firebaseConfig = {
   apiKey: "AIzaSyBMQNRT37E-tGh2IrhRcsrUagafWfbdYpU",
   authDomain: "googol-3357a.firebaseapp.com",
   projectId: "googol-3357a",
   storageBucket: "googol-3357a.firebasestorage.app",
   messagingSenderId: "437659793744",
   appId: "1:437659793744:web:9b82dd7759e9b56a0d5455"
};

let app = null;
let db = null;
let isFirebaseEnabled = false;

try {
  // Only initialize if config is provided
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseEnabled = true;
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase config not provided - using local storage fallback');
  }
} catch (error) {
  console.warn('Firebase initialization failed - using local storage fallback:', error);
  isFirebaseEnabled = false;
}

export { db, isFirebaseEnabled };