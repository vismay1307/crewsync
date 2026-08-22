"use client";

import { useQuery } from "@tanstack/react-query";

import { activityService } from "@/features/activity/services/activity.service";
import type { GetActivityParams } from "@/features/activity/types/activity.types";

export const activityQueryKey = (
  workspaceId: string,
  params: GetActivityParams = {}
) => ["activity", workspaceId, params] as const;

export function useActivityQuery(workspaceId: string, params: GetActivityParams = {}) {
  return useQuery({
    queryKey: activityQueryKey(workspaceId, params),
    queryFn: () => activityService.list(workspaceId, params),
    enabled: Boolean(workspaceId),
    staleTime: 10_000,
  });
}
