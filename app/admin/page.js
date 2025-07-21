"use client";

import SuperAdminDashboard from "../../components/SuperAdminDashboard";
import ProtectedRoute from "../ProtectedRoute";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
}