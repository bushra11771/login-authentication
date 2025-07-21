"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@app/components/LoadingSpinner ";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip initial render if we're still loading auth state
    if (status === "loading") return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace("/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }

    // If no specific roles required, grant access
    if (!allowedRoles || allowedRoles.length === 0) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Normalize role comparison (trim whitespace and lowercase)
    const userRole = user?.role?.toString().trim().toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => 
      role.toString().trim().toLowerCase()
    );

    // Check if user has required role
    if (userRole && normalizedAllowedRoles.includes(userRole)) {
      setIsAuthorized(true);
    } else {
      router.replace("/unauthorized");
    }

    setIsChecking(false);
  }, [isAuthenticated, user, status, allowedRoles, router]);

  if (status === "loading" || isChecking) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated || !isAuthorized) {
    return null;
  }

  return children;
};

export default ProtectedRoute;