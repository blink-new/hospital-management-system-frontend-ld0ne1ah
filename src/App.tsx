import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from './components/ui/sonner';
// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PharmacyPage from './pages/PharmacyPage';
import LaboratoryPage from './pages/LaboratoryPage';
import StaffPage from './pages/StaffPage';
import FinancialPage from './pages/FinancialPage';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppContent: React.FC = () => {

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route 
            path="patients" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                <PatientsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="appointments" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                <AppointmentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="pharmacy" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'pharmacist', 'doctor']}>
                <PharmacyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="laboratory" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'lab_technician', 'doctor']}>
                <LaboratoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StaffPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="financial" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FinancialPage />
              </ProtectedRoute>
            } 
          />
          <Route path="notifications" element={
            <div className="p-6">
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground mt-2">Notification center coming soon...</p>
            </div>
          } />
          <Route path="settings" element={
            <div className="p-6">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground mt-2">Settings panel coming soon...</p>
            </div>
          } />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;