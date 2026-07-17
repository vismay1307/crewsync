import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";
dotenv.config();

const env = {
  PORT: process.env.PORT || "5000",

  MONGODB_URI: process.env.MONGODB_URI || "",

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "default_access_secret",

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",

ACCESS_TOKEN_EXPIRY: (process.env.ACCESS_TOKEN_EXPIRY ??
    "15m") as SignOptions["expiresIn"],

  REFRESH_TOKEN_EXPIRY: (process.env.REFRESH_TOKEN_EXPIRY ??
    "7d") as SignOptions["expiresIn"],


  CLIENT_URL:
    process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;