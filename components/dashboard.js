// components/Dashboard.jsx
import React from 'react';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const Dashboard = ({ userRole }) => {
  const renderDashboard = () => {
    switch (userRole) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return <div>{renderDashboard()}</div>;
};

export default Dashboard;