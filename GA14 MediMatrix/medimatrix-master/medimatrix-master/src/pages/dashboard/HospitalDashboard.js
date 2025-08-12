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
  Inventory,
  Receipt,
  Assessment,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { Line ,Bar ,Pie} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import InventoryOverview from '../inventory/InventoryOverview';
import OrderListPage from '../orders/OrderListPage';
import NewOrderPage from '../orders/NewOrderPage';
import TrackShipmentPage from '../shipments/TrackShipmentPage';
import logo from '../../assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function HospitalDashboard() {
  const [selectedSection, setSelectedSection] = useState('overview');
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // Perform any additional logout actions here, like clearing session data
    navigate('/'); // Redirect to the login page
  };

  const statistics = {
    totalPatients: 300,
    totalInventoryValue: 50000,
    totalOrders: 100,
  };
  
  const profitLossData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [8000, 9000, 7000, 10000, 12000],
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Expenses',
        data: [5000, 6000, 4000, 8000, 6000],
        fill: false,
        backgroundColor: 'rgba(255,0,0,1)',
        borderColor: 'rgba(255,0,0,1)',
      },
    ],
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'inventory':
        return (
          <Box>
            <Typography variant="h5">Inventory Management</Typography>
            <InventoryOverview />
          </Box>
        );
      case 'orders':
        return (
          <Box>
            <Typography variant="h5">Order Management</Typography>
            <NewOrderPage />
            <OrderListPage />
          </Box>
        );
      case 'shipments':
        return (
          <Box>
            <Typography variant="h5">Track Shipments</Typography>
            <TrackShipmentPage />
          </Box>
        );
        case 'reports':
          return (
            <Box>
              <Typography variant="h5" gutterBottom>
                Reports & Analytics
              </Typography>
              <Grid container spacing={3}>
                {/* Sales Report */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Sales Performance
                    </Typography>
                    <Line
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                          {
                            label: 'Sales (in $)',
                            data: [12000, 15000, 10000, 20000, 18000],
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Purchase Report */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Purchase Statistics
                    </Typography>
                    <Line
                      data={{
                        labels: ['January', 'February', 'March', 'April', 'May'],
                        datasets: [
                          {
                            label: 'Purchases (in $)',
                            data: [8000, 7000, 12000, 15000, 11000],
                            backgroundColor: 'rgba(255, 159, 64, 0.5)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Vendor Performance */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Vendor Performance
                    </Typography>
                    <Line
                      data={{
                        labels: ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'],
                        datasets: [
                          {
                            label: 'Order Fulfillment Rate (%)',
                            data: [95, 80, 90, 85],
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Inventory Overview */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Inventory Breakdown
                    </Typography>
                    <Line
                      data={{
                        labels: ['Drug A', 'Drug B', 'Drug C', 'Drug D'],
                        datasets: [
                          {
                            label: 'Stock Levels',
                            data: [120, 80, 45, 95],
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Pie Chart for Expense Breakdown */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Expense Breakdown
                    </Typography>
                    <Pie
                      data={{
                        labels: ['Inventory', 'Staff Salaries', 'Utilities', 'Miscellaneous'],
                        datasets: [
                          {
                            label: 'Expenses',
                            data: [5000, 2000, 1500, 500],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.5)',
                              'rgba(54, 162, 235, 0.5)',
                              'rgba(255, 206, 86, 0.5)',
                              'rgba(75, 192, 192, 0.5)',
                            ],
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Shipment Reports */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Shipment Performance
                    </Typography>
                    <Bar
                      data={{
                        labels: ['Delivered', 'In Transit', 'Delayed', 'Cancelled'],
                        datasets: [
                          {
                            label: 'Shipment Status Count',
                            data: [200, 50, 30, 20],
                            backgroundColor: [
                              'rgba(75, 192, 192, 0.7)',
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                              'rgba(255, 99, 132, 0.7)',
                            ],
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: { display: true },
                        },
                      }}
                    />
                  </Paper>
                </Grid>
        
                {/* Average Delivery Time */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Average Delivery Time (Days)
                    </Typography>
                    <Bar
                      data={{
                        labels: ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'],
                        datasets: [
                          {
                            label: 'Avg Delivery Time',
                            data: [3, 5, 4, 6],
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          );
        
      default:
        return (
          <Box>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Overview</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', transition: '0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' } }}>
                  <Typography variant="h6">Total Patients</Typography>
                  <Typography variant="h4">{statistics.totalPatients}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', transition: '0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' } }}>
                  <Typography variant="h6">Inventory Value</Typography>
                  <Typography variant="h4">${statistics.totalInventoryValue}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center', transition: '0.3s', '&:hover': { boxShadow: '0 8px 16px rgba(0,0,0,0.3)' } }}>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{statistics.totalOrders}</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box sx={{ marginTop: 4 }}>
              <Typography variant="h5">Income & Expenses Summary</Typography>
              <Line data={profitLossData} />
            </Box>
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
            backgroundColor: '#3f51b5',
            color: '#ffffff',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setSelectedSection('overview')} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Dashboard Overview" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('inventory')} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><Inventory /></ListItemIcon>
            <ListItemText primary="Inventory Management" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('orders')} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><Receipt /></ListItemIcon>
            <ListItemText primary="Order Management" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('shipments')} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><Assessment /></ListItemIcon>
            <ListItemText primary="Track Shipments" />
          </ListItem>
          <ListItem button onClick={() => setSelectedSection('reports')} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><AccountCircle /></ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={handleLogout} sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#5c6bc0' } }}>
            <ListItemIcon sx={{ color: '#ffffff' }}><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Container sx={{ flexGrow: 1, padding: 4 }}>
        {/* Top Bar */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#3f51b5' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logo}
                alt="Medimatrix Logo"
                style={{ height: 40, marginRight: 10 }}
              />
              <Typography variant="h5" noWrap sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, letterSpacing: '1px' }}>
                Medimatrix
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Toolbar />
        {renderContent()}
      </Container>
    </div>
  );
}
