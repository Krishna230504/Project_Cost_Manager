
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase config is properly loaded
const isFirebaseConfigValid = () => {
  return (
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "undefined" && 
    firebaseConfig.projectId && 
    firebaseConfig.projectId !== "undefined"
  );
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } else {
    console.error("Firebase configuration is incomplete. Please check your environment variables.");
    throw new Error("Invalid Firebase configuration");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { auth, db };
export default app;
