// src/Utility/Firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// You can replace these with import.meta.env.* later for Netlify deployment
const firebaseConfig = {
  apiKey: "AIzaSyDi07Xbk5UVEzVTUSXpo8F8QYR-n1ZBYsQ",
  authDomain: "clone-c4ebb.firebaseapp.com",
  projectId: "clone-c4ebb",
  storageBucket: "clone-c4ebb.firebasestorage.app",
  messagingSenderId: "221170163939",
  appId: "1:221170163939:web:b56cebcd4bf036572f25d6"
};

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
