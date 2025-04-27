// Import the necessary Firebase services you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm88GQ9F0Zc90TR7KEg9xACM930KTeYUI",
  authDomain: "daily-journal-app-ad71c.firebaseapp.com",
  projectId: "daily-journal-app-ad71c",
  storageBucket: "daily-journal-app-ad71c.appspot.com",
  messagingSenderId: "203225071080",
  appId: "1:203225071080:web:3721c13dd06c5a7f6af85d",
  measurementId: "G-VZLTG2HFJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
