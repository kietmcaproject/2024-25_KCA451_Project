import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Dashboard,
  Receipt,
  Assessment,
  ExitToApp,
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import VendorOrdersPage from '../orders/VendorOrdersPage';
import ShipmentListPage from '../shipments/ShipmentListPage';
import logo from '../../assets/logo.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement // Register ArcElement for Pie chart
);

export default function VendorDashboard() {
  const [selectedSection, setSelectedSection] = useState('overview');
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const statistics = {
    totalOrders: 150,
    totalSales: 50000,
  };

  const profitLossData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Profit',
        data: [4000, 5000, 3000, 7000, 6000],
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Loss',
        data: [2000, 1000, 3000, 2000, 1500],
        fill: false,
        backgroundColor: 'rgba(255,0,0,1)',
        borderColor: 'rgba(255,0,0,1)',
      },
    ],
  };

  const orderStatusData = {
    labels: ['Pending', 'Shipped', 'Delivered'],
    datasets: [
      {
        data: [60, 30, 10], // Example data for order statuses
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  const salesByMonthData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: [5000, 10000, 8000, 12000, 15000],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'supplyOrders':
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Supply Orders</Typography>
            <VendorOrdersPage />
            <ShipmentListPage />
          </Box>
        );
      case 'performance':
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Performance Metrics</Typography>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <Line data={profitLossData} />
            </Paper>
          </Box>
        );
      case 'reports':
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Reports</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Order Status Distribution</Typography>
                  <Pie data={orderStatusData} />
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Sales by Month</Typography>
                  <Bar data={salesByMonthData} />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>Vendor Dashboard Overview</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{statistics.totalOrders}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography variant="h4">${statistics.totalSales}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setSelectedSection('overview')} selected={selectedSection === 'overview'}>
            <ListItemIcon><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard Overview" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('supplyOrders')} selected={selectedSection === 'supplyOrders'}>
            <ListItemIcon><Receipt /></ListItemIcon>
            <ListItemText primary="Supply Orders" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('performance')} selected={selectedSection === 'performance'}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Performance" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('reports')} selected={selectedSection === 'reports'}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Container sx={{ flexGrow: 1, padding: 4 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#3f51b5' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Medimatrix Logo" style={{ height: 40, marginRight: 10 }} />
              <Typography variant="h5" noWrap sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, letterSpacing: '1px' }}>
                Medimatrix
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Toolbar />
        {renderContent()}
      </Container>
    </div>
  );
}
