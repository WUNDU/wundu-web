import RegisterScreen from "@/src/components/pages/RegisterScreen";
import { RegisterProvider } from "@/src/hooks/context";

export default function Register() {
  return (
    <RegisterProvider>
      <RegisterScreen />
    </RegisterProvider>

  )
}