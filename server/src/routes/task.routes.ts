import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
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
  validate(createTaskSchema),
  createTaskController
);

router.get(
  "/",
  verifyJWT,
  validate(getTasksSchema),
  getTasksController
);

router.get(
  "/:taskId",
  verifyJWT,
  validate(getTaskSchema),
  getTaskController
);

router.patch(
  "/:taskId",
  verifyJWT,
  validate(updateTaskSchema),
  updateTaskController
);

router.delete(
  "/:taskId",
  verifyJWT,
  validate(deleteTaskSchema),
  deleteTaskController
);

export default router;