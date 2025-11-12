"use client";
import { ReactNode } from "react";
import { LoadingSpinner } from "@/ui/atoms";
import { useAuthGuard } from "@/hooks/auth/useAuthGuard";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, checked } = useAuthGuard();

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading || !checked) {
    return (
      <div className="flex flex-1 justify-center h-screen items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
