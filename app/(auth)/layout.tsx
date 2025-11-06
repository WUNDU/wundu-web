// app/(auth)/layout.tsx
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
    // Só verifica após o loading terminar
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

  // Mostra loading enquanto verifica
  if (isLoading || !checked) {
    return (
      <div className="flex flex-1 justify-center h-screen items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Se está autenticado (e já verificou), não renderiza
  if (isAuthenticated) {
    return null;
  }

  // Se não está autenticado, renderiza children (login/register)
  return <>{children}</>;
}
