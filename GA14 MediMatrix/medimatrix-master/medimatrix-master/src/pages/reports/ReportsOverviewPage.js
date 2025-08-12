// src/pages/reports/ReportsOverviewPage.js

import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import InventoryChart from './InventoryChart';
import VendorPerformanceChart from './VendorPerformanceChart';
import OrderChart from './OrderChart';

export default function ReportsOverviewPage() {
  return (
    <Container>
      <Typography variant="h4">Reports Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <Typography variant="h6">Inventory Reports</Typography>
            <InventoryChart />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <Typography variant="h6">Vendor Performance</Typography>
            <VendorPerformanceChart />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <Typography variant="h6">Order Reports</Typography>
            <OrderChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
