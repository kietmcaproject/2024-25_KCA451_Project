import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { OrderProvider } from './contexts/OrderContext';
import { ShipmentProvider } from './contexts/ShipmentContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuditLogProvider } from './contexts/AuditLogContext';
import { VendorProvider } from './contexts/VendorContext';

// Page Components
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import HospitalDashboard from './pages/dashboard/HospitalDashboard';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import InventoryOverview from './pages/inventory/InventoryOverview';
import AddDrugPage from './pages/inventory/AddDrugPage';
import EditDrugPage from './pages/inventory/EditDrugPage';
import DeleteDrugPage from './pages/inventory/DeleteDrugPage';
import OrderListPage from './pages/orders/OrderListPage';
import NewOrderPage from './pages/orders/NewOrderPage';
import OrderTrackingPage from './pages/orders/OrderTrackingPage';
import ShipmentListPage from './pages/shipments/ShipmentListPage';
import TrackShipmentPage from './pages/shipments/TrackShipmentPage';
import UserListPage from './pages/users/UserListPage';
import AddUserPage from './pages/users/AddUserPage';
import VendorListPage from './pages/vendors/VendorListPage';
import ReportsOverviewPage from './pages/reports/ReportsOverviewPage';
import NotificationsListPage from './pages/notifications/NotificationsListPage';
import UserProfilePage from './pages/settings/UserProfilePage';
import ChangePasswordPage from './pages/settings/ChangePasswordPage';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // Debugging user state
  console.log('Current User:', currentUser);

  // Redirect to login page if not authenticated
  return currentUser ? children : <Navigate to="/" />;
};

// Main Application Component
function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <OrderProvider>
          <ShipmentProvider>
            <NotificationProvider>
              <AuditLogProvider>
                <VendorProvider>
                  <Router>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                      {/* Private Routes */}
                      <Route
                        path="/dashboard/admin"
                        element={
                          <PrivateRoute>
                            <AdminDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/dashboard/hospital"
                        element={
                          <PrivateRoute>
                            <HospitalDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/dashboard/vendor"
                        element={
                          <PrivateRoute>
                            <VendorDashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/inventory"
                        element={
                          <PrivateRoute>
                            <InventoryOverview />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/inventory/add"
                        element={
                          <PrivateRoute>
                            <AddDrugPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/inventory/edit"
                        element={
                          <PrivateRoute>
                            <EditDrugPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/inventory/delete/:id"
                        element={
                          <PrivateRoute>
                            <DeleteDrugPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <PrivateRoute>
                            <OrderListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/orders/new"
                        element={
                          <PrivateRoute>
                            <NewOrderPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/orders/track/:id"
                        element={
                          <PrivateRoute>
                            <OrderTrackingPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/shipments"
                        element={
                          <PrivateRoute>
                            <ShipmentListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/shipments/track/:id"
                        element={
                          <PrivateRoute>
                            <TrackShipmentPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <PrivateRoute>
                            <UserListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/users/add"
                        element={
                          <PrivateRoute>
                            <AddUserPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/vendors"
                        element={
                          <PrivateRoute>
                            <VendorListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <PrivateRoute>
                            <ReportsOverviewPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <PrivateRoute>
                            <NotificationsListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings/profile"
                        element={
                          <PrivateRoute>
                            <UserProfilePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings/change-password"
                        element={
                          <PrivateRoute>
                            <ChangePasswordPage />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </Router>
                </VendorProvider>
              </AuditLogProvider>
            </NotificationProvider>
          </ShipmentProvider>
        </OrderProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;
