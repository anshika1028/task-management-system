import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import ApiError from "./ApiError";

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new ApiError(401, "Unauthorized");
      }

      // Ensure `decoded` is correctly typed
      if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
        req.userId = decoded.id as number;
        req.userRole = decoded.role as string;

        next();
      } else {
        throw new ApiError(401, "Invalid token");
      }
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(500, "Error verifying token", error);
    }
    throw error;
  }
};

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.userId || req.userRole !== "admin") {
      throw new ApiError(403, "Require Admin Role");
    }
    next();
  } catch (error: any) {
    next(new ApiError(500, "Error checking admin role", error));
  }
};
