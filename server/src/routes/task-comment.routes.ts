import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTaskCommentSchema,
  deleteTaskCommentSchema,
  getTaskCommentsSchema,
  updateTaskCommentSchema,
} from "../validators/task-comment.validator.js";
import {
  createTaskCommentController,
  deleteTaskCommentController,
  getTaskCommentsController,
  updateTaskCommentController,
} from "../controllers/task-comment.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(createTaskCommentSchema),
  createTaskCommentController
);

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getTaskCommentsSchema),
  getTaskCommentsController
);

router.patch(
  "/:commentId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(updateTaskCommentSchema),
  updateTaskCommentController
);

router.delete(
  "/:commentId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(deleteTaskCommentSchema),
  deleteTaskCommentController
);

export default router;
