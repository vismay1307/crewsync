import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createProjectSchema,
  getProjectsSchema,
  getProjectSchema,
  updateProjectSchema,
} from "../validators/project.validators.js";

import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";
import taskRoutes from "./task.routes.js";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(createProjectSchema),
  createProjectController
);

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getProjectsSchema),
  getProjectsController
);

router.get(
  "/:projectId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getProjectSchema),
  getProjectController
);

router.patch(
  "/:projectId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(updateProjectSchema),
  updateProjectController
);

router.delete(
  "/:projectId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(getProjectSchema),
  deleteProjectController
);

router.use(
  "/:projectId/tasks",
  taskRoutes
);

export default router;