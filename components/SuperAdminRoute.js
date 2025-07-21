"use client";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SuperAdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'superadmin') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'superadmin') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return children;
}