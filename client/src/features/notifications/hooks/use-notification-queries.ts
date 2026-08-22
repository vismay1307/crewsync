"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/features/notifications/services/notification.service";
import type { GetNotificationsParams } from "@/features/notifications/types/notification.types";

export const notificationsQueryKey = (params: GetNotificationsParams = {}) =>
  ["notifications", params] as const;

export function useNotificationsQuery(params: GetNotificationsParams = {}) {
  return useQuery({
    queryKey: notificationsQueryKey(params),
    queryFn: () => notificationService.list(params),
    staleTime: 10_000,
  });
}

export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.unreadCount(),
    staleTime: 10_000,
  });
}

export function useNotificationActions() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    markRead: useMutation({
      mutationFn: (notificationId: string) => notificationService.markRead(notificationId),
      onSuccess: invalidate,
    }),
    markAllRead: useMutation({
      mutationFn: () => notificationService.markAllRead(),
      onSuccess: invalidate,
    }),
  };
}
