// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpBiwKA9kvx1glYK3X3Z4p6wqLXaIak3A",
  authDomain: "medimatrix-14f80.firebaseapp.com",
  projectId: "medimatrix-14f80",
  storageBucket: "medimatrix-14f80.appspot.com",
  messagingSenderId: "1013051132786",
  appId: "1:1013051132786:web:691bdd00415deafa006beb",
  measurementId: "G-SETMC9X5TB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services you need
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);


