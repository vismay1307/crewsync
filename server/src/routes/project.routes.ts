import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createProjectSchema,
  getProjectsSchema,
} from "../validators/project.validators.js";

import {
  createProjectController,
  getProjectsController,
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

export default router;