"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import { LoadingProvider } from "@/contexts/loading-context";

function AuthInitializerInner({ children }: { children?: React.ReactNode }) {
  const initializeAuth = useUserStore((s) => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}

export function AuthInitializer({ children }: { children?: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AuthInitializerInner>{children}</AuthInitializerInner>
    </LoadingProvider>
  );
}
