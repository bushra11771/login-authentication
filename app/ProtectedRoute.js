"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated)
    if (status === "loading") return;
    // debugger

    // if (error?.status === 401 || !isAuthenticated) {
    //   router.replace("/login");
    // }
  }, [status, isAuthenticated, error, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;