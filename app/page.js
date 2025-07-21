"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Dashboard from "../components/dashboard";
import React from "react";

export default function HomePage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return <Dashboard userRole={user?.role} />;
}
