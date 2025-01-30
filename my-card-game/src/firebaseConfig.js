// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkJnIYVyI4tHZrs1OrrVNvRMYZFg9im8E",
  authDomain: "king-s-court.firebaseapp.com",
  projectId: "king-s-court",
  storageBucket: "king-s-court.firebasestorage.app",
  messagingSenderId: "943957346007",
  appId: "1:943957346007:web:1f195fd3724da7ede85292",
  measurementId: "G-9119ZVRG15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {database};