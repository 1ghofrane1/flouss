// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzWySwQNXlv9Wbm-EoXzzRmcmrLoGIwpQ",
  authDomain: "expense-tracker-77578.firebaseapp.com",
  projectId: "expense-tracker-77578",
  storageBucket: "expense-tracker-77578.firebasestorage.app",
  messagingSenderId: "369778671557",
  appId: "1:369778671557:web:a539a2a2bcab52e53f15ac",
  measurementId: "G-GTP7RV29YR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };