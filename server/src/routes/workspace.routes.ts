import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createWorkspaceSchema } from "../validators/workspace.validator.js";
import { createWorkspaceController } from "../controllers/workspace.controller.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  validate(createWorkspaceSchema),
  createWorkspaceController
);

export default router;