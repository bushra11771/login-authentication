"use client";
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function layout() {
  const user = useSelector((state) => state.auth.user);
    const router = useRouter();
  
  return (
    <div>

<main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Todo App</h1>
      {user ? (
        <Link 
          href="/todos"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Your Todos
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link 
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      )}
    </main>   
    
     </div>
  )
}

export default layout
