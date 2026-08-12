import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import authorizeWorkspace from "../middlewares/auth-workspace.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  acceptWorkspaceInvitationSchema,
  cancelWorkspaceInvitationSchema,
  createWorkspaceInvitationSchema,
  getWorkspaceInvitationsSchema,
  previewWorkspaceInvitationSchema,
  rejectWorkspaceInvitationSchema,
  resendWorkspaceInvitationSchema,
} from "../validators/workspace-invitation.validator.js";
import {
  acceptWorkspaceInvitationController,
  cancelWorkspaceInvitationController,
  createWorkspaceInvitationController,
  getWorkspaceInvitationsController,
  previewWorkspaceInvitationController,
  rejectWorkspaceInvitationController,
  resendWorkspaceInvitationController,
} from "../controllers/workspace-invitation.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(createWorkspaceInvitationSchema),
  createWorkspaceInvitationController
);

router.get(
  "/",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(getWorkspaceInvitationsSchema),
  getWorkspaceInvitationsController
);

router.patch(
  "/:invitationId/cancel",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(cancelWorkspaceInvitationSchema),
  cancelWorkspaceInvitationController
);

router.post(
  "/:invitationId/resend",
  verifyJWT,
  authorizeWorkspace(["owner", "admin"]),
  validate(resendWorkspaceInvitationSchema),
  resendWorkspaceInvitationController
);

router.get(
  "/:token/preview",
  validate(previewWorkspaceInvitationSchema),
  previewWorkspaceInvitationController
);

router.post(
  "/:token/accept",
  verifyJWT,
  validate(acceptWorkspaceInvitationSchema),
  acceptWorkspaceInvitationController
);

router.post(
  "/:token/reject",
  verifyJWT,
  validate(rejectWorkspaceInvitationSchema),
  rejectWorkspaceInvitationController
);

export default router;
