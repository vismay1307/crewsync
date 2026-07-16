import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import { signupService } from "../services/auth.services.js";

export const signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await signupService(req.body);

  res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      user
    )
  );
};