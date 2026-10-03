import { useUserStore } from "@/store/user-store";
import { userService } from "@/services/user.service";
import { notify } from "@/hooks/use-notification";
import type { ProfileUpdateRequest, UserRequest } from "@/types/dtos/user.dto";

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

  const updateProfile = async (payload: ProfileUpdateRequest): Promise<boolean> => {
    try {
      await userService.updateProfile(payload);
      await checkAuthStatus();
      notify.success("Perfil atualizado com sucesso!");
      return true;
    } catch {
      notify.error("Erro ao atualizar perfil");
      return false;
    }
  };

  const uploadPhoto = async (file: File): Promise<boolean> => {
    try {
      await userService.uploadPhoto(file);
      await checkAuthStatus();
      notify.success("Foto atualizada com sucesso!");
      return true;
    } catch {
      notify.error("Não foi possível carregar a foto.");
      return false;
    }
  };

  const removePhoto = async (): Promise<boolean> => {
    try {
      await userService.deletePhoto();
      await checkAuthStatus();
      notify.success("Foto removida.");
      return true;
    } catch {
      notify.error("Não foi possível remover a foto.");
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
    updateProfile,
    uploadPhoto,
    removePhoto,
    getUserById,
    refreshUser: checkAuthStatus,
  };
}
