import React, { createContext, useContext, useEffect, useState } from 'react';
import { firestore } from '../firebase'; // Adjust according to your Firebase setup
import { onAuthStateChanged } from 'firebase/auth'; // Firebase Auth
import { auth } from '../firebase'; // Firebase Auth instance
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all users and listen for changes
  useEffect(() => {
    const unsubscribeUsers = firestore.collection('users').onSnapshot((snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    return () => unsubscribeUsers();
  }, []);

  // Check authentication state and fetch user role
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentRole(userDoc.data().role);
        } else {
          setCurrentRole(null);
        }
      } else {
        setCurrentUser(null);
        setCurrentRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <UserContext.Provider value={{ users, currentUser, currentRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

// Private Route Component
export const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, currentRole, loading } = useUsers();

  if (loading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // Redirect if the user role doesn't match the required role
  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
