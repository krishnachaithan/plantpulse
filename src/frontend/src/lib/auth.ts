import { useInternetIdentity } from "@/hooks/useInternetIdentity";

export function useAuthClient() {
  const { identity, login, clear, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isAuthenticated ? identity.getPrincipal() : null;

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    logout: clear,
    principal,
    identity,
  };
}
