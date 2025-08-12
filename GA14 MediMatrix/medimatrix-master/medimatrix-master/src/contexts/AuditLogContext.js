import React, { createContext, useContext, useState, useEffect } from 'react';
import { firestore } from '../firebase';  // Import db from your Firebase config file
import { collection, onSnapshot, addDoc } from 'firebase/firestore';  // Modular Firestore functions

const AuditLogContext = createContext();

export function useAuditLogs() {
  return useContext(AuditLogContext);
}

export function AuditLogProvider({ children }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Use Firestore's modular functions to subscribe to audit logs collection
    const auditLogCollection = collection(firestore, 'auditLogs');
    const unsubscribe = onSnapshot(auditLogCollection, (snapshot) => {
      const auditLogList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(auditLogList);
    });

    return unsubscribe;  // Cleanup the subscription on unmount
  }, []);

  const addLog = (log) => {
    // Use addDoc to add a new log to the collection
    return addDoc(collection(firestore, 'auditLogs'), log);
  };

  const value = {
    logs,
    addLog
  };

  return (
    <AuditLogContext.Provider value={value}>
      {children}
    </AuditLogContext.Provider>
  );
}
