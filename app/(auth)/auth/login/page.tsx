'use client'
import LoginScreen from "@/src/components/pages/auth/LoginScreen";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { RegisterProvider } from "@/src/contexts/RegisterContext";

export default function Login() {
  return (
    <LoginScreen />
  )
}