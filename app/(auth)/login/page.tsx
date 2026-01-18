"use client";
import LoginScreen from "@/modules/auth/screens/login-screen";
import { AuthProvider } from "@/contexts/auth-context";
import { RegisterProvider } from "@/contexts/register-context";

export default function Login() {
  return <LoginScreen />;
}
