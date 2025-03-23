import { Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth.config";
import { isAdmin, verifyToken } from "./auth.middleware";

// Mocking dependencies
jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyToken", () => {
    it("should call next if token is valid", () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer validtoken" };
      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(null, { id: 1, role: "user" });
        },
      );

      // Act
      verifyToken(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(jwt.verify).toHaveBeenCalledWith(
        "validtoken",
        authConfig.secret,
        expect.any(Function),
      );
      expect(mockRequest.userId).toBe(1);
      expect(mockRequest.userRole).toBe("user");
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if no token is provided", () => {
      // Act
      verifyToken(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "No token provided",
      });
    });

    it("should return 401 if token is invalid", () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer invalidtoken" };
      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(new Error("Invalid token"), null);
        },
      );

      // Act
      verifyToken(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized",
      });
    });

    it("should return 401 if decoded token is invalid", () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer invalidtoken" };
      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(null, {});
        },
      );

      // Act
      verifyToken(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid token",
      });
    });

    it("should return 500 if an error occurs during token verification", () => {
      // Arrange
      mockRequest.headers = { authorization: "Bearer sometoken" };
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Token verification error");
      });

      // Act
      verifyToken(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error verifying token",
      });
    });
  });

  describe("isAdmin", () => {
    it("should call next if user has admin role", () => {
      // Arrange
      mockRequest.userId = 1;
      mockRequest.userRole = "admin";

      // Act
      isAdmin(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user does not have admin role", () => {
      // Arrange
      mockRequest.userId = 1;
      mockRequest.userRole = "user";

      // Act
      isAdmin(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Require Admin Role",
      });
    });

    it("should return 403 if user id is not provided", () => {
      // Arrange
      mockRequest.userRole = "admin";

      // Act
      isAdmin(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Require Admin Role",
      });
    });

    it("should handle errors and return 500", () => {
      // Arrange
      mockRequest.userId = 1;
      mockRequest.userRole = "admin";
      const error = new Error("Admin role check error");
      next.mockImplementation(() => {
        throw error;
      });

      // Act
      isAdmin(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Error checking admin role",
      });
    });
  });
});
