// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-6544e.firebaseapp.com",
  projectId: "interviewiq-6544e",
  storageBucket: "interviewiq-6544e.firebasestorage.app",
  messagingSenderId: "575377458611",
  appId: "1:575377458611:web:3086cf686ab165b4ff77c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };