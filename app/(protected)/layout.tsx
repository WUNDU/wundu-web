"use client";
import { RegisterProvider } from "@/src/contexts/RegisterContext";
import { useRegisterContext } from "@/src/hooks/useRegisterContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { ROUTES } from "@/src/constants/routes";
import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
