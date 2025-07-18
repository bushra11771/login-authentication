"use client";
import { useDispatch, useSelector } from "react-redux";
import { logout, loadUserFromStorage } from "@app/redux/authSlice";
import { useEffect } from "react";
import SuperAdminRoute from "@app/components/SuperAdminRoute";
import SuperAdminDashboard from "@app/components/SuperAdminDashboard";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <SuperAdminRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl">🏠</span>
                <h1 className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <SuperAdminDashboard />
      </div>
    </SuperAdminRoute>
  );
};

export default AdminDashboard;