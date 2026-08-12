import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getWorkspaceActivitySchema } from "../validators/activity.validator.js";
import { getWorkspaceActivityController } from "../controllers/activity.controller.js";

const router = Router({ mergeParams: true });

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getWorkspaceActivitySchema),
  getWorkspaceActivityController
);

export default router;
