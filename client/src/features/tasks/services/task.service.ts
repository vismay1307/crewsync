import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/types/api";
import type { Task } from "@/types/entities";
import type {
  CreateTaskRequest,
  GetTasksParams,
  UpdateTaskRequest,
} from "@/features/tasks/types/task.types";

function toQuery(params: GetTasksParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }
    query.set(key, String(value));
  });

  return query.toString();
}

const taskPath = (workspaceId: string, projectId: string) =>
  `/workspaces/${workspaceId}/projects/${projectId}/tasks`;

export const taskService = {
  list(workspaceId: string, projectId: string, params: GetTasksParams = {}) {
    const query = toQuery(params);
    return apiClient.get<PaginatedResult<Task>>(
      `${taskPath(workspaceId, projectId)}${query ? `?${query}` : ""}`
    );
  },

  get(workspaceId: string, projectId: string, taskId: string) {
    return apiClient.get<Task>(`${taskPath(workspaceId, projectId)}/${taskId}`);
  },

  create(workspaceId: string, projectId: string, data: CreateTaskRequest) {
    return apiClient.post<Task>(taskPath(workspaceId, projectId), data);
  },

  update(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: UpdateTaskRequest
  ) {
    return apiClient.patch<Task>(`${taskPath(workspaceId, projectId)}/${taskId}`, data);
  },

  updateDueDate(workspaceId: string, projectId: string, taskId: string, dueDate: string) {
    return apiClient.patch<Task>(`${taskPath(workspaceId, projectId)}/${taskId}/due-date`, {
      dueDate,
    });
  },

  removeDueDate(workspaceId: string, projectId: string, taskId: string) {
    return apiClient.delete<Task>(`${taskPath(workspaceId, projectId)}/${taskId}/due-date`);
  },

  updateStartDate(
    workspaceId: string,
    projectId: string,
    taskId: string,
    startDate: string
  ) {
    return apiClient.patch<Task>(`${taskPath(workspaceId, projectId)}/${taskId}/start-date`, {
      startDate,
    });
  },

  archive(workspaceId: string, projectId: string, taskId: string) {
    return apiClient.post<Task>(`${taskPath(workspaceId, projectId)}/${taskId}/archive`);
  },

  restore(workspaceId: string, projectId: string, taskId: string) {
    return apiClient.post<Task>(`${taskPath(workspaceId, projectId)}/${taskId}/restore`);
  },

  delete(workspaceId: string, projectId: string, taskId: string) {
    return apiClient.delete<null>(`${taskPath(workspaceId, projectId)}/${taskId}`);
  },
};
