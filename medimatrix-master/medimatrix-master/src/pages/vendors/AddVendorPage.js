import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useVendors } from '../../contexts/VendorContext';

export default function AddVendorPage() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const { addVendor } = useVendors();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVendor({ name, contactInfo });
      alert('Vendor added successfully');
    } catch (error) {
      alert('Error adding vendor');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Add New Vendor</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          label="Vendor Name"
          fullWidth
          required
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="Contact Info"
          fullWidth
          required
          margin="normal"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
          Add Vendor
        </Button>
      </form>
    </Container>
  );
}
