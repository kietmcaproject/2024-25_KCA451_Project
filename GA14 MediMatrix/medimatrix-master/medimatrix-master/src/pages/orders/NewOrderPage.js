import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, CircularProgress, Alert } from '@mui/material';
import { useOrders } from '../../contexts/OrderContext';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';

export default function NewOrderPage() {
  const [drugName, setDrugName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [vendorId, setVendorId] = useState('');
  const { addOrder } = useOrders();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorCollection = collection(firestore, 'users');
        const vendorSnapshot = await getDocs(vendorCollection);
        const vendorList = vendorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).filter(vendor => vendor.role === 'vendor'); // Filter vendors by role
        setVendors(vendorList);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!drugName || !quantity || !vendorId) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      // Retrieve the vendor's name based on the selected vendorId
      const selectedVendor = vendors.find(vendor => vendor.id === vendorId);
      const vendorName = selectedVendor ? `${selectedVendor.firstName} ${selectedVendor.lastName || ''}`.trim() : "Unknown Vendor";

      // Create the order with the additional vendorName field
      await addOrder({
        drugName,
        quantity,
        vendorId,
        vendorName, // Include vendor name for easy access
        createdAt: new Date() // Optional: Add created date if needed
      });
      alert('Order placed successfully');
      setDrugName('');
      setQuantity('');
      setVendorId('');
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: '#f5f5f5',
        padding: 4,
        borderRadius: 3,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: '"Roboto", sans-serif', // Default font for the rest of the page
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: 3,
          textAlign: 'center',
          color: '#333',
          fontFamily: '"Poppins", sans-serif', // Custom font for the title
          fontWeight: 'bold', // Make the title bold
          letterSpacing: 1.5, // Add some spacing between letters
          fontSize: '32px', // Set font size for the title
        }}
      >
        Place New Order
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Drug Name"
          fullWidth
          required
          margin="normal"
          value={drugName}
          onChange={(e) => setDrugName(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <TextField
          variant="outlined"
          label="Quantity"
          fullWidth
          required
          margin="normal"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <FormControl fullWidth required margin="normal" sx={{ backgroundColor: '#fff', borderRadius: 2 }}>
          <InputLabel>Vendor</InputLabel>
          <Select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            label="Vendor"
            sx={{
              borderRadius: 2,
            }}
          >
            {vendors.map(vendor => (
              <MenuItem key={vendor.id} value={vendor.id}>
                {`${vendor.firstName} ${vendor.lastName || ''}`.trim() || "Unnamed Vendor"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            marginTop: 2,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#2c6bed', // Custom hover color
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
        </Button>
      </form>
    </Container>
  );
}
