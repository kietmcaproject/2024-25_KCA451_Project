// src/contexts/OrderContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const OrderContext = createContext();

export function useOrders() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersCollection = collection(firestore, 'orders');
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });
    return () => unsubscribe();
  }, []);

  const addOrder = async (order) => {
    try {
      await addDoc(collection(firestore, 'orders'), {
        ...order,
        createdAt: new Date(),
        status: 'Pending', // Default status, adjust as needed
      });
    } catch (error) {
      console.error('Error adding order:', error);
      throw error; // Optional: rethrow the error to handle it in the component
    }
  };

  const updateOrder = async (id, updatedOrder) => {
    try {
      await updateDoc(doc(firestore, 'orders', id), updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const deleteOrder = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'orders', id));
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  };

  const getOrderById = (id) => {
    return orders.find((order) => order.id === id);
  };

  const value = {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}
