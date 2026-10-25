
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/features/auth/services/auth.service";
import type {
  LoginRequest,
  SignupRequest,
} from "@/features/auth/types/auth.types";
import { currentUserQueryKey } from "@/features/auth/hooks/use-current-user-query";
import {
  authAuthenticated,
  authUnauthenticated,
} from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";

export function useLoginMutation(returnTo = "/dashboard") {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      dispatch(authAuthenticated(user));

      const safeReturnTo =
        returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : "/dashboard";

      router.replace(safeReturnTo);
    },
  });
}

export function useSignupMutation(returnTo = "/login") {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: () => {
      const safeReturnTo =
        returnTo.startsWith("/") && !returnTo.startsWith("//")
          ? returnTo
          : "/login";

      router.replace(safeReturnTo);
    },
  });
}

export function useLogoutMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.clear();
      dispatch(authUnauthenticated());
      router.replace("/login");
    },
  });
}
