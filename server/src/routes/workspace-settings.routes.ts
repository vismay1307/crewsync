import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  getWorkspaceSettingsSchema,
  updateWorkspaceSettingsSchema,
} from "../validators/workspace-settings.validator.js";
import {
  getWorkspaceSettingsController,
  updateWorkspaceSettingsController,
} from "../controllers/workspace-settings.controller.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getWorkspaceSettingsSchema),
  getWorkspaceSettingsController
);

router.patch(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner"]),
  validate(updateWorkspaceSettingsSchema),
  updateWorkspaceSettingsController
);

export default router;
