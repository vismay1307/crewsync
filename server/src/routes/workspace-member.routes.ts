import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  addWorkspaceMemberSchema,
  getWorkspaceMembersSchema,
  updateWorkspaceMemberSchema,
  deleteWorkspaceMemberSchema,
} from "../validators/workspace-member.validator.js";

import {
  addWorkspaceMemberController,
  getWorkspaceMembersController,
  updateWorkspaceMemberController,
  removeWorkspaceMemberController,
} from "../controllers/workspace-member.controller.js";

const router = Router({
  mergeParams: true,
});

router.use(verifyJWT);

router.post(
  "/",
  authorizeWorkspace(["owner", "admin"]),
  validate(addWorkspaceMemberSchema),
  addWorkspaceMemberController
);

router.get(
  "/",
  authorizeWorkspace(["owner", "admin", "member"]),
  validate(getWorkspaceMembersSchema),
  getWorkspaceMembersController
);

router.patch(
  "/:memberId",
  authorizeWorkspace(["owner"]),
  validate(updateWorkspaceMemberSchema),
  updateWorkspaceMemberController
);

router.delete(
  "/:memberId",
  authorizeWorkspace(["owner"]),
  validate(deleteWorkspaceMemberSchema),
  removeWorkspaceMemberController
);

export default router;