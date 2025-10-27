"use client";
import RegisterScreen from "@/src/components/pages/auth/RegisterScreen";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { RegisterProvider } from "@/src/contexts/RegisterContext";

export default function Register() {
  return <RegisterScreen />;
}
