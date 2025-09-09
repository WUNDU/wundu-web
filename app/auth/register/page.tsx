import RegisterScreen from "@/src/components/pages/RegisterScreen";
import { RegisterProvider } from "@/src/contexts/RegisterContext";

export default function Register() {
  return (
    <RegisterProvider>
      <RegisterScreen />
    </RegisterProvider>

  )
}