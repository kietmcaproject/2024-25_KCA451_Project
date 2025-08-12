// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBe1FhkLg1xxrYFnJxpniBc8h3wTYcedRM",
  authDomain: "aiagent-d1a0e.firebaseapp.com",
  projectId: "aiagent-d1a0e",
  storageBucket: "aiagent-d1a0e.firebasestorage.app",
  messagingSenderId: "1029143684558",
  appId: "1:1029143684558:web:905c58d8df5dc07ca9779f",
  measurementId: "G-5P5CRS0K0G"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);