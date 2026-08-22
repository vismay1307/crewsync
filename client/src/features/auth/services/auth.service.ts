import { apiClient } from "@/lib/api/client";
import type {
  AuthUser,
  LoginRequest,
  SignupRequest,
} from "@/features/auth/types/auth.types";

export const authService = {
  getCurrentUser() {
    return apiClient.get<AuthUser>("/auth/me", {
      retryOnUnauthorized: false,
    });
  },

  signup(data: SignupRequest) {
    return apiClient.post<AuthUser>("/auth/signup", data);
  },

  login(data: LoginRequest) {
    return apiClient.post<{ user: AuthUser }>("/auth/login", data);
  },

  refreshToken() {
    return apiClient.post<unknown>("/auth/refresh-token");
  },

  logout() {
    return apiClient.post<null>("/auth/logout");
  },
};
