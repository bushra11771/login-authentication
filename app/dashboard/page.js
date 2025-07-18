"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import Dashboard from '../../components/dashboard';
import { useRouter } from 'next/navigation'; 

function DashboardRoute() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  // Add role-based protection
  React.useEffect(() => {
    if (!user) {
      router.push('/login'); 
    } else if (user.role !== 'superadmin') {
      // Redirect or show error if not superadmin
      router.push('/unauthorized');
    }
  }, [user, router]);

  if (!user || user.role !== 'superadmin') {
    return null; 
  }

  return (
    <div>
      <Dashboard userRole={user.role} />
    </div>
  );
}

export default DashboardRoute;