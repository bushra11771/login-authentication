"use client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardRoute from './dashboard/page';
import ProtectedRoute from './ProtectedRoute';
import SuperAdminDashboard from '../components/SuperAdminDashboard';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;