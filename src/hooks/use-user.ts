import { useUserStore } from "@/store/user-store";
import { userService } from "@/services/user.service";
import { notify } from "@/hooks/use-notification";
import type { UserRequest } from "@/types/dtos/user.dto";

export function useUser() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    logoutUser,
    checkAuthStatus,
    clearError,
  } = useUserStore();

  const updateUser = async (payload: Partial<UserRequest>): Promise<boolean> => {
    if (!user?.id) return false;
    try {
      await userService.update(user.id, payload);
      await checkAuthStatus();
      notify.success("Perfil atualizado com sucesso!");
      return true;
    } catch (err: any) {
      const message = err?.response?.data?.message || "Erro ao atualizar perfil";
      notify.error(message);
      return false;
    }
  };

  const getUserById = async (id: string) => {
    try {
      return await userService.getById(id);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Utilizador não encontrado";
      notify.error(message);
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout: logoutUser,
    clearError,
    updateUser,
    getUserById,
    refreshUser: checkAuthStatus,
  };
}
