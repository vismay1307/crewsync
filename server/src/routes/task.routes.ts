import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createTaskSchema,
  getTasksSchema,
  getTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  updateTaskDueDateSchema,
  updateTaskStartDateSchema,
  taskArchiveSchema,
  archivedTasksSchema,
} from "../validators/task.validator.js";
import { taskLabelsSchema } from "../validators/label.validator.js";

import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
  updateTaskDueDateController,
  removeTaskDueDateController,
  updateTaskStartDateController,
  archiveTaskController,
  restoreTaskController,
  getArchivedTasksController,
} from "../controllers/task.controller.js";
import taskCommentRoutes from "./task-comment.routes.js";
import {
  assignLabelsToTaskController,
  removeLabelsFromTaskController,
} from "../controllers/label.controller.js";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(createTaskSchema),
  createTaskController
);

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getTasksSchema),
  getTasksController
);

router.get(
  "/archived",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(archivedTasksSchema),
  getArchivedTasksController
);

router.get(
  "/:taskId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getTaskSchema),
  getTaskController
);

router.patch(
  "/:taskId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(updateTaskSchema),
  updateTaskController
);

router.patch(
  "/:taskId/due-date",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(updateTaskDueDateSchema),
  updateTaskDueDateController
);

router.delete(
  "/:taskId/due-date",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(taskArchiveSchema),
  removeTaskDueDateController
);

router.patch(
  "/:taskId/start-date",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(updateTaskStartDateSchema),
  updateTaskStartDateController
);

router.post(
  "/:taskId/archive",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(taskArchiveSchema),
  archiveTaskController
);

router.post(
  "/:taskId/restore",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(taskArchiveSchema),
  restoreTaskController
);

router.post(
  "/:taskId/labels",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(taskLabelsSchema),
  assignLabelsToTaskController
);

router.delete(
  "/:taskId/labels",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(taskLabelsSchema),
  removeLabelsFromTaskController
);

router.delete(
  "/:taskId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(deleteTaskSchema),
  deleteTaskController
);

router.use(
  "/:taskId/comments",
  taskCommentRoutes
);

export default router;
