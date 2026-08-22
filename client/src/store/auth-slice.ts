import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser } from "@/features/auth/types/auth.types";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

type AuthState = {
  currentUser: AuthUser | null;
  status: AuthStatus;
  initialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  currentUser: null,
  status: "idle",
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authLoading(state) {
      state.status = "loading";
      state.error = null;
    },
    authAuthenticated(state, action: PayloadAction<AuthUser>) {
      state.currentUser = action.payload;
      state.status = "authenticated";
      state.initialized = true;
      state.error = null;
    },
    authUnauthenticated(state) {
      state.currentUser = null;
      state.status = "unauthenticated";
      state.initialized = true;
      state.error = null;
    },
    authFailed(state, action: PayloadAction<string>) {
      state.currentUser = null;
      state.status = "unauthenticated";
      state.initialized = true;
      state.error = action.payload;
    },
  },
});

export const {
  authAuthenticated,
  authFailed,
  authLoading,
  authUnauthenticated,
} = authSlice.actions;

export default authSlice.reducer;
