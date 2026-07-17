import User, { IUser } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { SignupData } from "../validators/auth.validator.js";
import { LoginData } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
interface JwtPayload {
  userId: string;
  email?: string;
}
export const signupService = async (
  data: SignupData
): Promise<IUser> => {
  const { firstName, lastName, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }


// Create new user
const user = await User.create({
  firstName,
  lastName,
  email,
  password,
});

// Fetch created user without sensitive fields
const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);

if (!createdUser) {
  throw new ApiError(500, "Failed to create user");
}

return createdUser;
};

const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();

  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return {
    accessToken,
    refreshToken,
  };
};


export const loginService = async (data: LoginData) => {
  // 1. Find User
  const user = await User.findOne({
    email: data.email,
  });

  // 2. Check User
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Compare Password
  const isPasswordCorrect = await user.comparePassword(data.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } =
  await generateAccessAndRefreshTokens(user._id.toString());

  // 6. Get Safe User
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // 7. Return
  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessTokenService = async (
  incomingRefreshToken: string
) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    env.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token expired or used");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id.toString());

  return {
    accessToken,
    refreshToken,
  };
};
export const logoutService = async (
  userId: string
) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: "",
  });
};