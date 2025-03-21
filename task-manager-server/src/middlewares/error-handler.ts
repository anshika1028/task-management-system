import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";

/**
 * Global Error Handling Middleware
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("❌ Error:", err.message);

  // If the error has a status code, use it; otherwise, default to 500
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
