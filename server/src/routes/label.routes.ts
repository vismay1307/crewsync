import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createLabelSchema,
  deleteLabelSchema,
  getLabelsSchema,
  updateLabelSchema,
} from "../validators/label.validator.js";
import {
  createLabelController,
  deleteLabelController,
  getLabelsController,
  updateLabelController,
} from "../controllers/label.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(createLabelSchema),
  createLabelController
);

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getLabelsSchema),
  getLabelsController
);

router.patch(
  "/:labelId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(updateLabelSchema),
  updateLabelController
);

router.delete(
  "/:labelId",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(deleteLabelSchema),
  deleteLabelController
);

export default router;
