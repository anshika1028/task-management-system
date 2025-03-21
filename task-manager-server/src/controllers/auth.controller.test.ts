import bcrypt from "bcrypt";
import { Request, Response } from "express";
import User from "../models/user.model";
import { login, register } from "./auth.controller";

// Mocking dependencies
jest.mock("../models/user.model");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password",
        role: "user",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.create as jest.Mock).mockResolvedValue({
        username: "testuser",
        password: "hashedPassword",
        role: "user",
      });

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        password: "hashedPassword",
        role: "user",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "User registered successfully",
        user: {
          username: "testuser",
          password: "hashedPassword",
          role: "user",
        },
      });
    });

    it("should return 400 if missing required fields", async () => {
      // Arrange
      mockRequest.body = { username: "testuser", password: "password" };

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required fields: username, password, role",
      });
    });

    it("should return 409 if user already exists", async () => {
      // Arrange
      mockRequest.body = {
        username: "existinguser",
        password: "password",
        role: "user",
      };
      (User.findOne as jest.Mock).mockResolvedValue({
        username: "existinguser",
      });

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password",
        role: "user",
      };
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error registering user",
      });
    });

    it("should return 400 if password is an empty string", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: " ",
        role: "user",
      };

      // Act
      await register(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid password",
      });
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password",
      };
      const mockUser = {
        username: "testuser",
        password: "hashedPassword",
        role: "user",
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Login successful",
        user: mockUser,
      });
    });

    it("should return 400 if missing required fields", async () => {
      // Arrange
      mockRequest.body = { username: "testuser" };

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required fields: username, password",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      mockRequest.body = {
        username: "nonexistentuser",
        password: "password",
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "nonexistentuser" },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should return 401 if invalid password", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "wrongpassword",
      };
      const mockUser = {
        username: "testuser",
        password: "hashedPassword",
        role: "user",
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedPassword"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid password",
      });
    });

    it("should handle errors and return 500", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password",
      };
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error logging in",
      });
    });

    it("should return 500 if a SequelizeDatabaseError occurs", async () => {
      // Arrange
      mockRequest.body = {
        username: "testuser",
        password: "password",
      };
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error("SequelizeDatabaseError")
      );

      // Act
      await login(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "An error occurred during login",
      });
    });
  });
});
