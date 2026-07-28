import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError.js";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  console.error("========== ERROR ==========");
  console.error(err);
  console.error("===========================");

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: err.message,   // temporary
    errors: [],
  });
};
export default errorHandler;