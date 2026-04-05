import { useUserStore } from "@/store/user-store";

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    logoutUser,
    registerUser,
    clearError,
  } = useUserStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout: logoutUser,
    registerUser,
    clearError,
  };
}
