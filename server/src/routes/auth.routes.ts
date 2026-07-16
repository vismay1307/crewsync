import { Router } from "express";

import asyncHandler from "../utils/asyncHandler.js";
import { signup } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", asyncHandler(signup));

export default router;