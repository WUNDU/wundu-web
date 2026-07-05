import { passwordRecoveryService } from "@/services/password-recovery.service";
import { useNotification } from "./use-notification";
import { getApiErrorMessage } from "@/utils/api-error";
import type { VerifyOtpRequest, ResetPasswordRequest } from "@/types/dtos/auth.dto";

export function usePasswordRecovery() {
  const { toast, loading } = useNotification();

  const sendRequestEmail = async (email: string): Promise<boolean> => {
    loading.show("Enviando...");
    try {
      await passwordRecoveryService.requestPasswordRecoveryByEmail(email);
      toast("Requisição feita com sucesso", "success");
      return true;
    } catch (error: any) {
      const err =
        error?.status === 500
          ? "Não foi possível acessar o sistema. Tente mais tarde!"
          : getApiErrorMessage(error, "Email não encontrado");
      toast(err, "error");
      return false;
    } finally {
      loading.hide();
    }
  };

  const verifyOtp = async (
    data: VerifyOtpRequest,
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    loading.show("Verificando o código...");
    try {
      await passwordRecoveryService.verifyOtp(data);
      toast("Código verificado com sucesso!", "success");
      return { success: true };
    } catch (error: any) {
      const err =
        error?.status === 500
          ? "Não foi possível acessar o sistema. Tente mais tarde!"
          : getApiErrorMessage(error, "Código inválido ou expirado");
      toast(err, "error");
      return { success: false, errorMessage: err };
    } finally {
      loading.hide();
    }
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<boolean> => {
    loading.show("Atualizando nova senha...");
    try {
      await passwordRecoveryService.resetPassword(data);
      toast("Senha alterada com sucesso!", "success");
      return true;
    } catch (error: any) {
      const err =
        error?.status === 500
          ? "Não foi possível acessar o sistema. Tente mais tarde!"
          : getApiErrorMessage(error, "Erro ao redefinir senha");
      toast(err, "error");
      return false;
    } finally {
      loading.hide();
    }
  };

  return { sendRequestEmail, verifyOtp, resetPassword };
}
