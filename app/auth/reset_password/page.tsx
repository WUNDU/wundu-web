import PasswordResetScreen from "@/src/components/pages/PasswordScreen";
import { PasswordResetProvider } from "@/src/contexts/PasswordResetContext";

export default function PasswordReset() {
  return (
    <PasswordResetProvider>
      <PasswordResetScreen />
    </PasswordResetProvider>
  )
}