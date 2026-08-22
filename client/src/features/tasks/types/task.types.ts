import type { TaskPriority, TaskStatus } from "@/types/entities";

export type GetTasksParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  labels?: string | string[];
  createdBy?: string;
  overdue?: boolean;
  completed?: boolean;
  startFrom?: string;
  startTo?: string;
  dueFrom?: string;
  dueTo?: string;
  search?: string;
  archived?: boolean;
};

export type CreateTaskRequest = {
  title: string;
  description?: string;
  assignee?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  dueDate?: string;
};

export type UpdateTaskRequest = Partial<CreateTaskRequest>;
