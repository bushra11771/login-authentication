"use client";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SuperAdminDashboard from '../components/SuperAdminDashboard';

function DashboardRoute() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      {user?.role === 'superadmin' ? (
        <SuperAdminDashboard />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          You don't have permission to access this page
        </div>
      )}
    </div>
  );
}

export default DashboardRoute;