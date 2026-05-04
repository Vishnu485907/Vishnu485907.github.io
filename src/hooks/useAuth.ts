import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";
import { isPreviewBuild } from "@/lib/runtime";

export type UnifiedUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
  avatar?: string | null;
  source: "oauth" | "local";
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !isPreviewBuild,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !isPreviewBuild,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const isLoading = oauthLoading || localLoading;

  const user: UnifiedUser | null = useMemo(() => {
    if (oauthUser) {
      return {
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        role: oauthUser.role,
        avatar: oauthUser.avatar,
        source: "oauth" as const,
      };
    }
    if (localUser) {
      return {
        id: localUser.id,
        name: localUser.name || localUser.displayName || localUser.username,
        email: localUser.email,
        role: localUser.role,
        source: "local" as const,
      };
    }
    return null;
  }, [oauthUser, localUser]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isAdmin,
      logout,
    }),
    [user, isAuthenticated, isLoading, isAdmin, logout]
  );
}
