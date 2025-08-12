import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Ensure Firebase is properly set up
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Store the currently logged-in user
  const [loading, setLoading] = useState(true); // Track if auth state is being loaded

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Stop loading once user is determined
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  // Login function
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Register function
  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  // Logout function
  const logout = () => signOut(auth);

  // Update user profile
  const updateProfile = (userData) => {
    if (auth.currentUser) {
      return auth.currentUser.updateProfile(userData);
    }
    return Promise.reject(new Error("No user is currently logged in"));
  };

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Ensure no children are rendered during auth loading */}
    </AuthContext.Provider>
  );
};
