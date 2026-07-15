import { Router } from "express";
import ApiError from "../utils/ApiError.js";
const router = Router();

router.get("/error", (req, res) => {
  throw new ApiError(400, "This is a test error");
});
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CrewSync API is running 🚀",
  });
});

export default router;