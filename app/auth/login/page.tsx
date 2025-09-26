import LoginScreen from "@/src/components/pages/LoginScreen";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { RegisterProvider } from "@/src/contexts/RegisterContext";

export default function Login() {
  return (
    <AuthProvider>
      <RegisterProvider>
        <LoginScreen />
      </RegisterProvider>
    </AuthProvider>
  )
}