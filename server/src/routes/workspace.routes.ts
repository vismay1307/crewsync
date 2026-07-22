import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {updateWorkspaceSchema, createWorkspaceSchema,getWorkspaceSchema } from "../validators/workspace.validator.js";
import {updateWorkspaceController, createWorkspaceController,getWorkspacesController,getWorkspaceController, deleteWorkspaceController } from "../controllers/workspace.controller.js";
import projectRoutes from "./project.routes.js";
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
  validate(getWorkspaceSchema),
  getWorkspaceController
);

router.patch(
  "/:workspaceId",
  verifyJWT,
  validate(updateWorkspaceSchema),
  updateWorkspaceController
);
router.delete(
  "/:workspaceId",
  verifyJWT,
  validate(getWorkspaceSchema),
  deleteWorkspaceController
);
router.use(
    "/:workspaceId/projects",
    projectRoutes
);

export default router;