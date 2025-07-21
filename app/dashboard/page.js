"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import Dashboard from '../../components/dashboard';

function DashboardRoute() {
  const { user } = useSelector((state) => state.auth);
  
  return (
    <div>
      <Dashboard userRole={user?.role || 'customer'} />
    </div>
  );
}

export default DashboardRoute;
