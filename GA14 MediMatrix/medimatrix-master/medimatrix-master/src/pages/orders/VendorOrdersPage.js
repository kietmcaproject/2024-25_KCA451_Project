import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, CircularProgress, Snackbar } from '@mui/material';
import { firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useShipments } from '../../contexts/ShipmentContext';
import { format } from 'date-fns'; 
import * as XLSX from 'xlsx'; // Import xlsx library

const VendorOrdersPage = () => {
  const { currentUser } = useAuth();
  const vendorId = currentUser?.uid;
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { handleCreateShipment } = useShipments();

  useEffect(() => {
    const fetchVendorOrders = async () => {
      if (!vendorId) return;
      try {
        const ordersCollection = collection(firestore, 'orders');
        const ordersQuery = query(ordersCollection, where('vendorId', '==', vendorId));
        const ordersSnapshot = await getDocs(ordersQuery);
        const filteredOrders = ordersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }));
        setVendorOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching vendor orders: ", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, [vendorId]);

  const handleCreateShipmentClick = async (order) => {
    try {
      await handleCreateShipment(order);
      setSuccessMessage('Shipment successfully created!');
    } catch (error) {
      setError("Failed to create shipment");
      console.error("Error creating shipment: ", error);
    }
  };

  const exportToExcel = () => {
    const formattedOrders = vendorOrders.map(order => ({
      OrderID: order.id,
      DrugName: order.drugName || "N/A",
      Quantity: order.quantity || "N/A",
      Status: order.status || "Pending",
      OrderedAt: order.createdAt ? format(order.createdAt.toDate(), 'MM/dd/yyyy HH:mm') : "N/A"
    }));

    const ws = XLSX.utils.json_to_sheet(formattedOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendor Orders');

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, 'Vendor_Orders.xlsx');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Loading orders...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 3 }}>Orders Received</Typography>
        
        {/* Export Button */}
        <Button 
          variant="contained" 
          onClick={exportToExcel} 
          sx={{ marginBottom: 3 }}
        >
          Export to Excel
        </Button>

        {error && <Typography color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
        {vendorOrders.length > 0 ? (
          vendorOrders.map(order => (
            <Paper
              key={order.id}
              sx={{
                marginBottom: 2,
                padding: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Order ID: {order.id}</Typography>
              <Typography sx={{ fontWeight: 500, color: '#1976d2' }}>Drug Name: {order.drugName || "N/A"}</Typography>
              <Typography>Quantity: {order.quantity || "N/A"}</Typography>
              <Typography>Status: {order.status || 'Pending'}</Typography>
              <Typography sx={{ color: 'textSecondary' }}>
                Ordered At:{" "}
                {order.createdAt ? format(order.createdAt.toDate(), 'MM/dd/yyyy HH:mm') : "N/A"}
              </Typography>
              {order.status === 'Pending' && (
                <Button
                  variant="contained"
                  sx={{ marginTop: 2 }}
                  onClick={() => handleCreateShipmentClick(order)}
                >
                  Create Shipment
                </Button>
              )}
            </Paper>
          ))
        ) : (
          <Typography sx={{ fontStyle: 'italic', color: '#888' }}>No orders received yet.</Typography>
        )}
      </Paper>

      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />
      )}
    </Container>
  );
};

export default VendorOrdersPage;
