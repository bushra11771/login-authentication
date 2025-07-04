"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth"; 

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === true && user) {
      if (user.role === "Admin") {
        router.push("/admin/dashboard");
      } else if (user.role === "Provider") {
        router.push("/provider/dashboard");
      } else if (user.role === "Customer") {
        router.push("/customer/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null;
  }

  return children;
};
