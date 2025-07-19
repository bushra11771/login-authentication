"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  logout, loadUserFromStorage } from '../../../redux/authSlice';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user, dashboardData, dashboardStatus, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(loadUserFromStorage());
    }
    dispatch(loadUserFromStorage());
  }, [dispatch, user]);

  const handleRefresh = () => {
    dispatch(loadUserFromStorage());
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🏠</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">ServiceHub</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
          <p className="text-gray-600">Book and manage your home services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
                <p className="text-2xl font-bold text-blue-600">{dashboardData?.activeBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Completed Services</h3>
                <p className="text-2xl font-bold text-green-600">{dashboardData?.completedServices || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
                <p className="text-2xl font-bold text-purple-600">${dashboardData?.totalSpent || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {dashboardData?.recentBookings?.map((booking, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{booking.service}</p>
                    <p className="text-sm text-gray-500">{booking.provider} • {booking.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              )) || <p className="text-gray-500">No recent bookings</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                <span className="text-2xl block mb-2">🔧</span>
                <span className="text-sm font-medium text-blue-800">Book Plumbing</span>
              </button>
              <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center">
                <span className="text-2xl block mb-2">⚡</span>
                <span className="text-sm font-medium text-yellow-800">Book Electrical</span>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                <span className="text-2xl block mb-2">❄️</span>
                <span className="text-sm font-medium text-green-800">Book AC Service</span>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
                <span className="text-2xl block mb-2">🔨</span>
                <span className="text-sm font-medium text-purple-800">Book Handyman</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;