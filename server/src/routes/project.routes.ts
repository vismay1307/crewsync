import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createProjectSchema,
  getProjectsSchema,
  getProjectSchema,updateProjectSchema
} from "../validators/project.validators.js";

import {
  createProjectController,
  getProjectsController,
  getProjectController,updateProjectController,deleteProjectController
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

router.patch(
  "/:projectId",
  verifyJWT,
  validate(updateProjectSchema),
  updateProjectController
);

router.delete(
  "/:projectId",
  verifyJWT,
  validate(getProjectSchema),
  deleteProjectController
);
export default router;