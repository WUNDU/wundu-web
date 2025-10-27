// src/components/atoms/ProtectedRoute.tsx (or ProtectedLayout.tsx)
"use client";
import { useRegisterContext } from "@/src/hooks/useRegisterContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ROUTES } from "@/src/constants/routes";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading } = useRegisterContext();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(
      "AuthChecker - isAuthenticated:",
      isAuthenticated,
      "user:",
      user,
      "AuthChecker - isLoading:",
      isLoading
    );
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until authenticated
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
