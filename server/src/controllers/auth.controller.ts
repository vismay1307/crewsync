import { Request, Response } from "express";
import { loginService,refreshAccessTokenService } from "../services/auth.services.js";
import ApiResponse from "../utils/ApiResponse.js";
import { signupService,logoutService } from "../services/auth.services.js";
import AsyncHandler from "../utils/asyncHandler.js"

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
};
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
export const loginController = AsyncHandler(
  async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(200, "Login successful", {
          user,
        })
      );

    return;
  }
);


export const getCurrentUser = AsyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json(
      new ApiResponse(
        200,
        "Current user fetched successfully",
        req.user
      )
    );

    return;
  }
);

export const refreshAccessTokenController = AsyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken;

    const { accessToken, refreshToken } =
      await refreshAccessTokenService(
        incomingRefreshToken
      );

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Access token refreshed successfully",
          {
      accessToken,
      refreshToken,
    }
        )
      );

    return;
  }
);

export const logoutController = AsyncHandler(
  async (req: Request, res: Response) => {
    await logoutService(req.user!._id.toString());

    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Logged out successfully",null
        )
      );

    return;
  }
);