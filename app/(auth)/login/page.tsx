"use client";
import LoginScreen from "@/screens/auth/LoginScreen";
import { AuthProvider } from "@/contexts/AuthContext";
import { RegisterProvider } from "@/contexts/RegisterContext";

export default function Login() {
  return <LoginScreen />;
}
