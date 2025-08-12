import { useEffect, useState, createContext, useContext } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';

const ShipmentContext = createContext();

export function useShipments() {
  return useContext(ShipmentContext);
}

export function ShipmentProvider({ children }) {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shipmentCollection = collection(firestore, 'shipments');
    const unsubscribe = onSnapshot(
      shipmentCollection,
      (snapshot) => {
        const shipmentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log("Fetched Shipments:", shipmentsData);
        setShipments(shipmentsData);
        setLoading(false); // Set loading to false once data is fetched
      },
      (err) => {
        console.error("Error fetching shipments: ", err);
        setError(err.message);
        setLoading(false); // Set loading to false if there's an error
      }
    );
    return unsubscribe;
  }, []);

  const getShipmentById = (id) => shipments.find((shipment) => shipment.id === id);

  const createShipmentFromOrder = async (order) => {
    try {
      const shipmentCollection = collection(firestore, 'shipments');
      const newShipmentRef = await addDoc(shipmentCollection, {
        orderId: order.id,
        status: 'Shipped',
        createdAt: new Date(),
        estimatedDelivery: "Not Available", // Default placeholder
      });
      console.log("Shipment Created:", newShipmentRef.id);
      return newShipmentRef.id; // Return the new shipment ID
    } catch (error) {
      console.error("Error creating shipment: ", error);
      setError(error.message);
      return null;
    }
  };

  const updateShipmentStatus = async (shipmentId, status, estimatedDelivery = null) => {
    try {
      const shipmentDoc = doc(firestore, 'shipments', shipmentId);
      const updatedFields = { status };
      if (estimatedDelivery) {
        updatedFields.estimatedDelivery = estimatedDelivery;
      }
      await updateDoc(shipmentDoc, updatedFields);
      console.log("Shipment status updated:", shipmentId);
    } catch (error) {
      console.error("Error updating shipment status: ", error);
      setError(error.message);
    }
  };

  const handleCreateShipment = async (order) => {
    try {
      const shipmentId = await createShipmentFromOrder(order);
      if (shipmentId) {
        // Update the order status to 'Shipped' after creating a shipment
        const orderRef = doc(firestore, 'orders', order.id);
        await updateDoc(orderRef, { status: 'Shipped' });
        console.log("Order status updated to Shipped:", order.id);
      }
    } catch (error) {
      console.error("Error handling shipment creation: ", error);
      setError(error.message);
    }
  };

  return (
    <ShipmentContext.Provider value={{ shipments, handleCreateShipment, updateShipmentStatus, getShipmentById }}>
      {loading ? (
        <div>  </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        children
      )}
    </ShipmentContext.Provider>
  );
}
