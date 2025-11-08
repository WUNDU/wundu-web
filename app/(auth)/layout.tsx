"use client";
import { useRegisterContext } from "@/src/hooks/useRegisterContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ROUTES } from "@/src/constants/routes";
import LoadingSpinner from "@/src/components/atoms/LoadingSpinner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useRegisterContext();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        console.log(
          "Usuário já autenticado, redirecionando para:",
          ROUTES.HOME
        );
        router.push(ROUTES.HOME);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !checked) {
    return (
      <div className="flex flex-1 justify-center h-screen items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
