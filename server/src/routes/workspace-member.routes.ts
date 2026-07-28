import { Router } from "express";

import {
  addWorkspaceMemberController,
  getWorkspaceMembersController,
  updateWorkspaceMemberController,
  removeWorkspaceMemberController,
} from "../controllers/workspace-member.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js";
import {validate} from "../middlewares/validate.middleware.js";

import {
  addWorkspaceMemberSchema,
  getWorkspaceMembersSchema,
  updateWorkspaceMemberSchema,
  deleteWorkspaceMemberSchema,
} from "../validators/workspace-member.validator.js";

const router = Router({ mergeParams: true });

router.use(verifyJWT);

router.post(
  "/",
  validate(addWorkspaceMemberSchema),
  addWorkspaceMemberController
);

router.get(
  "/",
  validate(getWorkspaceMembersSchema),
  getWorkspaceMembersController
);

router.patch(
  "/:memberId",
  validate(updateWorkspaceMemberSchema),
  updateWorkspaceMemberController
);

router.delete(
  "/:memberId",
  validate(deleteWorkspaceMemberSchema),
  removeWorkspaceMemberController
);

export default router;