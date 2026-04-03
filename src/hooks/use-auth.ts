import { useUserStore } from "@/store/user-store";

export function useAuth() {
  const { user, isAuthenticated, isLoading, loginUser, logoutUser } =
    useUserStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginUser,
    logout: logoutUser,
  };
}
