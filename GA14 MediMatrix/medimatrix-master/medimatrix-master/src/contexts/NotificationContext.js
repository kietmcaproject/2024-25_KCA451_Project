import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsCollection = collection(firestore, 'notifications');
    const unsubscribe = onSnapshot(notificationsCollection, (snapshot) => {
      const notificationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notificationList);
    });
    return () => unsubscribe();
  }, []);

  const addNotification = async (notification) => {
    return await addDoc(collection(firestore, 'notifications'), notification);
  };

  const value = {
    notifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
