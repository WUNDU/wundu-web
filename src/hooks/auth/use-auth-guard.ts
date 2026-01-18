"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import useRegisterContext from "@/contexts/use-register-context";

export interface AuthGuardResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  checked: boolean;
}

export const useAuthGuard = (): AuthGuardResult => {
  const { isAuthenticated, isLoading } = useRegisterContext();
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      }
      setChecked(true);
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading, checked };
};
