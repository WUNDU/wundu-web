"use client";
import LoginScreen from "@/ui/templates/auth/login-screen";
import { AuthProvider } from "@/contexts/auth-context";
import { RegisterProvider } from "@/contexts/register-context";

export default function Login() {
  return <LoginScreen />;
}
