import PasswordResetScreen from "@/screens/auth/PasswordScreen";
import { PasswordResetProvider } from "@/contexts/PasswordResetContext";

export default function PasswordReset() {
  return (
    <PasswordResetProvider>
      <PasswordResetScreen />
    </PasswordResetProvider>
  );
}
