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

export function useLoginMutation() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      dispatch(authAuthenticated(user));
      router.replace("/dashboard");
    },
  });
}

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),
    onSuccess: () => {
      router.replace("/login");
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
