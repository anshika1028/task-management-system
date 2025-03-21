import express, { NextFunction, Request, Response } from "express";
import ApiError from "../middlewares/ApiError";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware";
import User from "../models/user.model";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Unauthorized - Admin only
 */
router.get(
  "/",
  verifyToken,
  isAdmin,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await User.findAll();
      res.json({ success: true, users });
    } catch (error) {
      throw new ApiError(500, "Error fetching users");
    }
  }
);

export default router;
