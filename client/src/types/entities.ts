export type MongoEntity = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type User = MongoEntity & {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isEmailVerified?: boolean;
};

export type WorkspaceRole = "owner" | "admin" | "member";

export type Workspace = MongoEntity & {
  name: string;
  description?: string;
  logo?: string;
  visibility?: "private" | "public";
  timezone?: string;
  defaultRole?: "admin" | "member";
  colorTheme?: string;
  owner: string | User;
  isDeleted?: boolean;
};

export type WorkspaceMember = MongoEntity & {
  workspace: string | Workspace;
  user: string | User;
  role: WorkspaceRole;
  status: "accepted" | "pending";
  invitedBy?: string | User;
  isDeleted?: boolean;
};

export type ProjectStatus = "active" | "archived";

export type Project = MongoEntity & {
  workspace: string | Workspace;
  name: string;
  description?: string;
  emoji?: string;
  status: ProjectStatus;
  createdBy: string | User;
  isDeleted?: boolean;
};

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export type Task = MongoEntity & {
  workspace: string | Workspace;
  project: string | Project;
  title: string;
  description?: string;
  assignee?: string | User;
  createdBy: string | User;
  status: TaskStatus;
  priority: TaskPriority;
  startDate?: string;
  dueDate?: string;
  completed?: boolean;
  labels?: Array<string | Label>;
  isDeleted?: boolean;
};

export type Label = MongoEntity & {
  workspace: string | Workspace;
  name: string;
  color: string;
  description?: string;
  isDeleted?: boolean;
};

export type TaskComment = MongoEntity & {
  task: string | Task;
  workspace: string | Workspace;
  user: string | User;
  body: string;
  isDeleted?: boolean;
  deletedAt?: string;
};

export type WorkspaceInvitation = MongoEntity & {
  workspace: string | Workspace;
  email: string;
  invitedUser?: string | User;
  invitedBy: string | User;
  role: Exclude<WorkspaceRole, "owner">;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired";
  expiresAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
};

export type Notification = MongoEntity & {
  recipient: string | User;
  actor?: string | User;
  workspace?: string | Workspace;
  type: string;
  resourceType?: string;
  resourceId?: string;
  readAt?: string;
  metadata?: Record<string, unknown>;
};

export type ActivityLogEntry = MongoEntity & {
  workspace: string | Workspace;
  actor?: string | User;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
};
