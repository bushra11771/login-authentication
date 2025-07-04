"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [status, isAuthenticated, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;
