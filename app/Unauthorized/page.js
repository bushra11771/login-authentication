"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="mb-6">You don't have permission to access this page</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded">
        Return Home
      </Link>
    </div>
  );
}
