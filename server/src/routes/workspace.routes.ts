import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createWorkspaceSchema,
  
  getWorkspaceSchema,
  updateWorkspaceSchema,
} from "../validators/workspace.validator.js";

import {
  createWorkspaceController,
  getWorkspacesController,
  getWorkspaceController,
  updateWorkspaceController,
  deleteWorkspaceController,
} from "../controllers/workspace.controller.js";
import projectRoutes from "./project.routes.js";
import workspaceMemberRoutes from "./workspace-member.routes.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createWorkspaceSchema),
  createWorkspaceController
);

router.get(
  "/",
  verifyJWT,

  getWorkspacesController
);

router.get(
  "/:workspaceId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getWorkspaceSchema),
  getWorkspaceController
);

router.patch(
  "/:workspaceId",
  verifyJWT,
  authorizeWorkspace(["owner"]),
  validate(updateWorkspaceSchema),
  updateWorkspaceController
);

router.delete(
  "/:workspaceId",
  verifyJWT,
  authorizeWorkspace(["owner"]),
  validate(getWorkspaceSchema),
  deleteWorkspaceController
);

router.use(
  "/:workspaceId/projects",
  projectRoutes
);

router.use(
  "/:workspaceId/members",
  workspaceMemberRoutes
);

export default router;