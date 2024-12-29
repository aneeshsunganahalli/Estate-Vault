// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estatevault.firebaseapp.com",
  projectId: "mern-estatevault",
  storageBucket: "mern-estatevault.firebasestorage.app",
  messagingSenderId: "662077432195",
  appId: "1:662077432195:web:da9ca5ea95fdd9105c96b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);