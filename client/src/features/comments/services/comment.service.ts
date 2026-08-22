import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { TaskComment } from "@/types/entities";
import type {
  CreateCommentRequest,
  GetCommentsParams,
  UpdateCommentRequest,
} from "@/features/comments/types/comment.types";

function toQuery(params: GetCommentsParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.set(key, String(value));
  });
  return query.toString();
}

const commentsPath = (workspaceId: string, projectId: string, taskId: string) =>
  `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`;

export const commentService = {
  list(workspaceId: string, projectId: string, taskId: string, params: GetCommentsParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<TaskComment>>(
      `${commentsPath(workspaceId, projectId, taskId)}${query ? `?${query}` : ""}`
    );
  },

  create(workspaceId: string, projectId: string, taskId: string, data: CreateCommentRequest) {
    return apiClient.post<TaskComment>(commentsPath(workspaceId, projectId, taskId), data);
  },

  update(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    data: UpdateCommentRequest
  ) {
    return apiClient.patch<TaskComment>(
      `${commentsPath(workspaceId, projectId, taskId)}/${commentId}`,
      data
    );
  },

  delete(workspaceId: string, projectId: string, taskId: string, commentId: string) {
    return apiClient.delete<null>(
      `${commentsPath(workspaceId, projectId, taskId)}/${commentId}`
    );
  },
};
