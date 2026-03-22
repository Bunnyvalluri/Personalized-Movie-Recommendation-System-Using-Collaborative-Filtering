import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "MOCK_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agriscan-app.firebaseapp.com",
  projectId: "agriscan-app",
  storageBucket: "agriscan-app.firebasestorage.app",
  messagingSenderId: "87418876733",
  appId: "1:87418876733:web:16d254d0dd097703e78b54",
  measurementId: "G-E8BFNQQYYX"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
