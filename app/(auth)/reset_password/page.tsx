import PasswordResetScreen from "@/modules/auth/screens/password-screen";
import { PasswordResetProvider } from "@/contexts/password-reset-context";

export default function PasswordReset() {
  return (
    <PasswordResetProvider>
      <PasswordResetScreen />
    </PasswordResetProvider>
  );
}
