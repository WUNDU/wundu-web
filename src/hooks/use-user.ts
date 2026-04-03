import { useUserStore } from "@/store/user-store";

export function useUser() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    logoutUser,
    setToken,
    clearError,
  } = useUserStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout: logoutUser,
    setUser: setToken,
    clearError,
  };
}
