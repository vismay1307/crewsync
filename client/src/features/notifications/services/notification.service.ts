import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { Notification } from "@/types/entities";
import type {
  GetNotificationsParams,
  UnreadNotificationCount,
} from "@/features/notifications/types/notification.types";

function toQuery(params: GetNotificationsParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

export const notificationService = {
  list(params: GetNotificationsParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<Notification>>(
      `/notifications${query ? `?${query}` : ""}`
    );
  },

  unreadCount() {
    return apiClient.get<UnreadNotificationCount>("/notifications/unread-count");
  },

  markRead(notificationId: string) {
    return apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
  },

  markAllRead() {
    return apiClient.patch<{ modifiedCount: number }>("/notifications/read-all");
  },
};
