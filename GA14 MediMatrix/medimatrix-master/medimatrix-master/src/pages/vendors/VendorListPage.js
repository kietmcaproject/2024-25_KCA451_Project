import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useVendors } from '../../contexts/VendorContext';

export default function VendorListPage() {
  const { vendors } = useVendors();

  return (
    <Container>
      <Typography variant="h4">Vendors</Typography>
      <Grid container spacing={3}>
        {vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.id}>
            <Paper elevation={3}>
              <Typography variant="h6">Vendor Name: {vendor.name}</Typography>
              <Typography>Performance: {vendor.performanceRating}</Typography>
              {/* Additional vendor details */}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
