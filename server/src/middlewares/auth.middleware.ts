import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import  asyncHandler from "../utils/asyncHandler.js";

interface JwtPayload {
  userId: string;
  email?: string;
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;

    next();
  }
);