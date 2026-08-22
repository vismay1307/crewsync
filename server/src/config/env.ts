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
    process.env.CLIENT_URL || "http://localhost:3000",

    SMTP_HOST: process.env.SMTP_HOST!,

SMTP_PORT: process.env.SMTP_PORT!,

SMTP_USER: process.env.SMTP_USER!,

SMTP_PASS: process.env.SMTP_PASS!,

MAIL_FROM: process.env.MAIL_FROM!,
};

export default env;
