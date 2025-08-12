// src/contexts/InventoryContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Correctly importing firestore

const InventoryContext = createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const inventoryCollection = collection(firestore, 'inventory');
    const unsubscribe = onSnapshot(inventoryCollection, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(items);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const addDrug = async (drug) => {
    return await addDoc(collection(firestore, 'inventory'), drug);
  };

  const updateDrug = async (id, updatedDrug) => {
    return await updateDoc(doc(firestore, 'inventory', id), updatedDrug);
  };

  const deleteDrug = async (id) => {
    return await deleteDoc(doc(firestore, 'inventory', id));
  };

  const getDrugById = (id) => {
    return inventory.find((item) => item.id === id);
  };

  const updateStock = async (id, quantity) => {
    const item = getDrugById(id);
    if (item) {
      const newStock = item.stock - quantity;
      if (newStock < 0) {
        throw new Error('Insufficient stock'); // Prevent negative stock
      }
      await updateDoc(doc(firestore, 'inventory', id), { stock: newStock });
    }
  };

  const value = {
    inventory,
    addDrug,
    updateDrug,
    deleteDrug,
    getDrugById,
    updateStock, // Expose updateStock method
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
