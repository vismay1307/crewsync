"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import {
  authAuthenticated,
  authFailed,
  authLoading,
  authUnauthenticated,
} from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { useCurrentUserQuery } from "@/features/auth/hooks/use-current-user-query";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

const isAuthPage =
  pathname === "/login" ||
  pathname === "/signup";

const currentUserQuery = useCurrentUserQuery(!isAuthPage);

  useEffect(() => {
    if (currentUserQuery.isPending) {
      dispatch(authLoading());
      return;
    }

    if (currentUserQuery.isSuccess) {
      dispatch(authAuthenticated(currentUserQuery.data));
      return;
    }

    if (currentUserQuery.isError) {
      if (
        currentUserQuery.error instanceof ApiError &&
        currentUserQuery.error.status === 401
      ) {
        dispatch(authUnauthenticated());
        return;
      }

      dispatch(authFailed(currentUserQuery.error.message));
    }
  }, [
    currentUserQuery.data,
    currentUserQuery.error,
    currentUserQuery.isError,
    currentUserQuery.isPending,
    currentUserQuery.isSuccess,
    dispatch,
  ]);

  return children;
}
