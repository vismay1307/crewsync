import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createProjectSchema,
  getProjectsSchema,
  getProjectSchema
} from "../validators/project.validators.js";

import {
  createProjectController,
  getProjectsController,
  getProjectController
} from "../controllers/project.controller.js";

const router = Router({
  mergeParams: true,
});

router.post(
  "/",
  verifyJWT,
  validate(createProjectSchema),
  createProjectController
);

router.get(
  "/",
  verifyJWT,
  validate(getProjectsSchema),
  getProjectsController
);
router.get(
  "/:projectId",
  verifyJWT,
  validate(getProjectSchema),
  getProjectController
);

export default router;