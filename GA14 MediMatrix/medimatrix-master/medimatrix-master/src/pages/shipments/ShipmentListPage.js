import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useShipments } from '../../contexts/ShipmentContext';
import * as XLSX from 'xlsx'; // Import the xlsx library

export default function ShipmentListPage() {
  const { shipments, updateShipmentStatus } = useShipments();
  const [open, setOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const handleClickOpen = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);  // Set the current status as the default in the dialog
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShipment(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    if (selectedShipment && newStatus) {
      try {
        // Call the function to update the status
        await updateShipmentStatus(selectedShipment.id, newStatus, selectedShipment.estimatedDelivery);
        handleClose();
      } catch (error) {
        console.error('Error updating shipment status:', error);
      }
    } else {
      console.error('Please provide a new status');
    }
  };

  // Function to export shipments to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(shipments); // Convert shipments to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Shipments'); // Append the sheet to the workbook
    XLSX.writeFile(wb, 'shipments.xlsx'); // Download the file as 'shipments.xlsx'
  };

  return (
    <Container sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 4 }}>Shipments</Typography>

      {/* Export Button */}
      <Button
        variant="contained"
        sx={{
          marginBottom: 3,
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
        onClick={exportToExcel} // Trigger export on click
      >
        Export to Excel
      </Button>

      <Grid container spacing={3}>
        {shipments.map((shipment) => (
          <Grid item xs={12} sm={6} md={4} key={shipment.id}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.2)',
                  backgroundColor: '#f9f9f9',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Shipment ID: {shipment.id}</Typography>
              <Typography variant="body1">Order ID: {shipment.orderId}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Status: {shipment.status}</Typography>
              <Typography variant="body2" sx={{ color: 'textSecondary' }}>
                Estimated Delivery: {shipment.estimatedDelivery || "Not Available"}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginTop: 2,
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                onClick={() => handleClickOpen(shipment)}
              >
                Update Status
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Shipment Status</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Status"
            type="text"
            fullWidth
            variant="outlined"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Estimated Delivery"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedShipment?.estimatedDelivery || ""}
            onChange={(e) => setSelectedShipment({
              ...selectedShipment, estimatedDelivery: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#1976d2' }}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
