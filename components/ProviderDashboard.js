"use client";
import { useDispatch, useSelector } from "react-redux";
import { User } from "lucide-react";
import { logout, loadUserFromStorage } from "../redux/authSlice";
import { useEffect } from "react";
import ProtectedRoute from "@app/app/ProtectedRoute";

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const { user, dashboardData, dashboardStatus, error } = useSelector((state) => state.auth);
  
  const roles = [User.Provider];

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(loadUserFromStorage());
  };

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = '/login';
    }
  };

  if (dashboardStatus === 'loading' && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute roles={roles}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl">🔧</span>
                <h1 className="ml-2 text-xl font-bold text-gray-900">ServiceHub Provider</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.name || user?.username}</span>
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

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Provider Dashboard</h2>
            <p className="text-gray-600">Manage your services and bookings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today&#39;s Bookings</h3>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData?.todaysBookings || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Completed Jobs</h3>
                  <p className="text-2xl font-bold text-green-600">{dashboardData?.completedJobs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardData?.averageRating || 0}/5</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
              <div className="space-y-3">
                {dashboardData?.upcomingBookings?.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{booking.service}</p>
                      <p className="text-sm text-gray-500">{booking.customer} • {booking.time}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {booking.status}
                    </span>
                  </div>
                )) || <p className="text-gray-500">No upcoming bookings</p>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
                <button
                  onClick={handleRefresh}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">This Week</span>
                  <span className="font-semibold text-gray-900">${dashboardData?.weeklyEarnings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">This Month</span>
                  <span className="font-semibold text-gray-900">${dashboardData?.monthlyEarnings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total Earnings</span>
                  <span className="font-semibold text-gray-900">${dashboardData?.totalEarnings || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProviderDashboard;