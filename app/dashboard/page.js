"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { loadUserFromStorage, logout } from '@app/redux/authSlice';

axios.defaults.baseURL = 'http://localhost:5000';

function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {  user, isAuthenticated } = useSelector((state) => state.auth);


useEffect(()=>{
console.log('Checking user authentication status...', isAuthenticated);
if(!isAuthenticated) {  
  router.push('/login'); 

}
  // dispatch(loadUserFromStorage());
},[isAuthenticated])



  const handleLogout = async () => {
    setIsLoggingOut(true);
    dispatch(logout());
    router.push('/login'); 
    setIsLoggingOut(false);
  };
  
console.log('User data:', user);   
  return (
    
    <div>
      <div>
        <h1>Welcome to your Dashboard</h1>
        <p><strong>Name:</strong> { user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
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