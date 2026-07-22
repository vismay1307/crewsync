import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import { createProjectSchema } from "../validators/project.validators.js";
import { createProjectController } from "../controllers/project.controller.js";

const router = Router({
    mergeParams: true,
});

router.post(
    "/",
    verifyJWT,
    validate(createProjectSchema),
    createProjectController
);

export default router;