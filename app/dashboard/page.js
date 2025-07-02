"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; // or 'next/router' for pages directory

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
  localStorage.clear();
  router.push('/login'); // Redirect to login page after logout
    // Optionally, you can dispatch a logout action if you have one
    // await dispatch(logoutUser());
    setIsLoggingOut(false);
  };

  return (
    <div>
      <p>Welcome to the dashboard!</p>
      <button 
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

export default Page;