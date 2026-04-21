"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/store/user-store";
import EmailVerificationBanner from "@/components/email-verification-banner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useUserStore();
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

  if (isLoading || !checked) {
    return null;
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <EmailVerificationBanner />
      {children}
    </>
  );
}
