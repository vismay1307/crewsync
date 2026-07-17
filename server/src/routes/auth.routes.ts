import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema,loginSchema } from "../validators/auth.validator.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signup,loginController,getCurrentUser,refreshAccessTokenController,logoutController } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(signup)
);
router.post(
  "/login",
  validate(loginSchema),
  loginController
);

router.get(
  "/me",
  verifyJWT,
  getCurrentUser
);

router.post(
  "/refresh-token",
  refreshAccessTokenController
);
router.post(
  "/logout",
  verifyJWT,
  logoutController
);
export default router;