import { passwordRecoveryService } from "@/services/password-recovery.service";
import { useNotification } from "./use-notification";
import { getApiErrorMessage } from "@/utils/api-error";
import type { VerifyOtpRequest, ResetPasswordRequest } from "@/types/dtos/auth.dto";

interface ApiErrorWithStatus {
  status?: number;
  message?: string;
  response?: { data?: { message?: string; erros?: Record<string, string> } };
}

function handleApiError(error: unknown, fallback: string): {
  message: string;
  retryAfter?: number;
} {
  const e = error as ApiErrorWithStatus | undefined;
  const status = e?.status;

  if (status === 429) {
    const msg = e?.response?.data?.message ?? e?.message ?? "Demasiados pedidos";
    const match = msg.match(/(\d+)/);
    const retryAfter = match ? parseInt(match[1], 10) : 60;
    return { message: `Demasiados pedidos. Aguarde ${retryAfter} segundos.`, retryAfter };
  }

  if (status === 500) {
    return { message: "Não foi possível acessar o sistema. Tente mais tarde!" };
  }

  if (status === 422) {
    const e2 = e as ApiErrorWithStatus | undefined;
    const erros = e2?.response?.data?.erros;
    if (erros && Object.keys(erros).length > 0) {
      const first = Object.values(erros)[0];
      return { message: first };
    }
  }

  return { message: getApiErrorMessage(error, fallback) };
}

export function usePasswordRecovery() {
  const { toast, loading } = useNotification();

  const sendRequestEmail = async (email: string): Promise<{
    success: boolean;
    retryAfter?: number;
  }> => {
    loading.show("Enviando...");
    try {
      await passwordRecoveryService.requestPasswordRecoveryByEmail(email);
      toast("Requisição feita com sucesso", "success");
      return { success: true };
    } catch (error: any) {
      const { message, retryAfter } = handleApiError(error, "Erro ao enviar código");
      toast(message, "error");
      return { success: false, retryAfter };
    } finally {
      loading.hide();
    }
  };

  const verifyOtp = async (
    data: VerifyOtpRequest,
  ): Promise<{ success: boolean; errorMessage?: string; retryAfter?: number }> => {
    loading.show("Verificando o código...");
    try {
      await passwordRecoveryService.verifyOtp(data);
      toast("Código verificado com sucesso!", "success");
      return { success: true };
    } catch (error: any) {
      const { message, retryAfter } = handleApiError(error, "Código inválido ou expirado");
      toast(message, "error");
      return { success: false, errorMessage: message, retryAfter };
    } finally {
      loading.hide();
    }
  };

  const resetPassword = async (data: ResetPasswordRequest): Promise<{
    success: boolean;
    retryAfter?: number;
  }> => {
    loading.show("Atualizando nova senha...");
    try {
      await passwordRecoveryService.resetPassword(data);
      toast("Senha alterada com sucesso!", "success");
      return { success: true };
    } catch (error: any) {
      const { message, retryAfter } = handleApiError(error, "Erro ao redefinir senha");
      toast(message, "error");
      return { success: false, retryAfter };
    } finally {
      loading.hide();
    }
  };

  return { sendRequestEmail, verifyOtp, resetPassword };
}
