import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import workspaceRoutes from "./workspace.routes.js";
import notificationRoutes from "./notification.routes.js";
import workspaceInvitationRoutes from "./workspace-invitation.routes.js";

const router = Router();

router.use("/", healthRoutes);

router.use("/auth", authRoutes);

router.use("/workspaces", workspaceRoutes);

router.use("/notifications", notificationRoutes);

router.use("/invitations", workspaceInvitationRoutes);

export default router;
