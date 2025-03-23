import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import ApiError from "../middlewares/ApiError";
import User from "../models/user.model";

export const register = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
      throw new ApiError(
        400,
        "Missing required fields: username, password, role"
      );
    }

    // Ensure password is a valid string
    if (typeof password !== "string" || password.trim() === "") {
      throw new ApiError(400, "Invalid password");
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(500, "Error registering user", error);
    }
    throw error;
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Missing required fields: username, password");
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ApiError(401, "Invalid password");
    }
    const userObj = { id: user.id, role: user.role };
    const token = jwt.sign(
      userObj, // Payload (User ID & Role)
      authConfig.secret, // Secret Key
      { expiresIn: "24h" } // Token Expiration Time
    );
    return res.json({
      success: true,
      message: "Login successful",
      data: { token, user: { ...userObj, username: user.username } },
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      throw new ApiError(500, "An error occurred during login", error);
    }
    throw error;
  }
};
