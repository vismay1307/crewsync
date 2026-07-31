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
} from "../validators/task.validator.js";

import {
  createTaskController,
  getTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

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

router.delete(
  "/:taskId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(deleteTaskSchema),
  deleteTaskController
);

export default router;