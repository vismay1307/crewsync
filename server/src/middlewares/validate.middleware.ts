import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
   const result = schema.safeParse({
  body: req.body,
  params: req.params,
  query: req.query,
});

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: result.error.issues,
      });

      return;
    }

    req.body = result.data.body;
    req.params = (result.data.params ?? req.params) as typeof req.params;
    req.query = (result.data.query ?? req.query) as typeof req.query;

    next();
  };
