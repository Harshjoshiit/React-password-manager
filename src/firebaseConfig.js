// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQPTVM76uWs9SgBHBacHTSGNrYQ6ACbLo",
  authDomain: "password-manager-68c46.firebaseapp.com",
  projectId: "password-manager-68c46",
  storageBucket: "password-manager-68c46.firebasestorage.app",
  messagingSenderId: "433834478310",
  appId: "1:433834478310:web:5425132618b7a92a00c927",
  measurementId: "G-S3H1KK9CQM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database= getFirestore(app);
const analytics = getAnalytics(app);