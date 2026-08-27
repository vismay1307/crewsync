import { useQuery } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";

export const currentUserQueryKey = ["auth", "me"] as const;

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: authService.getCurrentUser,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}