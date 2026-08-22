import { apiClient } from "@/lib/api/client";

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
};

export const authService = {
  getCurrentUser() {
    return apiClient.get<CurrentUser>("/auth/me");
  },
};