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
  TextField,
  Button
} from '@mui/material';
import {
  Dashboard,
  Assessment,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import '@fontsource/poppins';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('overview');
  const navigate = useNavigate();

  // Data for reports
  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [5000, 7000, 8000, 6000, 9000],
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Purchases',
        data: [3000, 4000, 5000, 3500, 4500],
        backgroundColor: 'rgba(255,159,64,0.4)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  };

  const userData = {
    labels: ['Admin', 'Vendors', 'Hospitals'],
    datasets: [
      {
        label: 'User Distribution',
        data: [5, 10, 15],
        backgroundColor: ['#3f51b5', '#4caf50', '#ff9800'],
        hoverOffset: 4,
      },
    ],
  };

  const vendorPerformanceData = {
    labels: ['Vendor A', 'Vendor B', 'Vendor C', 'Vendor D'],
    datasets: [
      {
        label: 'Performance (Orders Delivered)',
        data: [120, 150, 100, 170],
        backgroundColor: ['#2196f3', '#4caf50', '#ff5722', '#9c27b0'],
      },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Example: remove token
    navigate('/'); // Redirect to the login page
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'reports':
        return (
          <Box>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Reports</Typography>
            <Grid container spacing={3}>
              {/* Sales and Purchases */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Sales and Purchases</Typography>
                  <Line data={salesData} />
                </Paper>
              </Grid>

              {/* User Distribution */}
              <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">User Distribution</Typography>
                  <Pie data={userData} />
                </Paper>
              </Grid>

              {/* Vendor Performance */}
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">Vendor Performance</Typography>
                  <Bar data={vendorPerformanceData} />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
        case 'profile':
          return (
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>Profile Management</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Profile Details</Typography>
                    <Box component="form">
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            value="Admin Name" // Replace with dynamic value
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value="admin@example.com" // Replace with dynamic value
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Phone"
                            variant="outlined"
                            value="+1234567890" // Replace with dynamic value
                            disabled
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="primary">
                          Save Changes
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Change Password</Typography>
                    <Box component="form">
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            variant="outlined"
                            value=""
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            variant="outlined"
                            value=""
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            variant="outlined"
                            value=""
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="secondary">
                          Change Password
                        </Button>
                      </Box>
                    </Box>
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
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Sales</Typography>
                  <Typography variant="h4">$50,000</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">150</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <div style={{ display: 'flex' }}>
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
          {[
            { text: 'Dashboard Overview', icon: <Dashboard />, section: 'overview' },
            { text: 'Reports', icon: <Assessment />, section: 'reports' },
            { text: 'Profile Management', icon: <AccountCircle />, section: 'profile' },
            { text: 'Logout', icon: <ExitToApp />, action: handleLogout },
          ].map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={item.action || (() => setSelectedSection(item.section))}
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, padding: 4 }}>
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

        <Toolbar />
        {renderContent()}
      </Container>
    </div>
  );
}
