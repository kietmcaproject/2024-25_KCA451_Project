import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Button, Typography } from '@mui/material';
import { useInventory } from '../../contexts/InventoryContext';

export default function DeleteDrugPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteDrug } = useInventory();

  const handleDelete = async () => {
    try {
      await deleteDrug(id);
      alert('Drug deleted successfully');
      navigate('/inventory');
    } catch (error) {
      alert('Error deleting drug');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Delete Drug</Typography>
      <Typography variant="body1">Are you sure you want to delete this drug?</Typography>
      <Button variant="contained" color="secondary" onClick={handleDelete}>
        Yes, Delete
      </Button>
      <Button variant="outlined" onClick={() => navigate('/inventory')}>
        No, Go Back
      </Button>
    </Container>
  );
}
