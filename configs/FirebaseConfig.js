// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBA5g394zv4y8x1HfokE0ANiMFVkSomudg",
  authDomain: "travelsmart-73a2b.firebaseapp.com",
  projectId: "travelsmart-73a2b",
  storageBucket: "travelsmart-73a2b.firebasestorage.app",
  messagingSenderId: "31091085593",
  appId: "1:31091085593:web:8f50d222f6401b5a333588",
  measurementId: "G-ZJBD9QSP56",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
