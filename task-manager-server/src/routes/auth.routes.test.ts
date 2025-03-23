import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { login, register } from "../controllers/auth.controller";
import authRoutes from "./auth.routes";

// Mocking the auth controller functions
jest.mock("../controllers/auth.controller", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe("Auth Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/auth", authRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call register controller on POST /api/auth/register", async () => {
    // Arrange
    const mockRegister = register as jest.Mock;
    mockRegister.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        res.status(201).json({ message: "Registered successfully" });
      },
    );

    // Act
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password", role: "user" });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: "Registered successfully" });
    expect(mockRegister).toHaveBeenCalled();
  });

  it("should call login controller on POST /api/auth/login", async () => {
    // Arrange
    const mockLogin = login as jest.Mock;
    mockLogin.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ message: "Logged in successfully" });
      },
    );

    // Act
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "password" });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Logged in successfully" });
    expect(mockLogin).toHaveBeenCalled();
  });

  it("should handle errors in register route", async () => {
    // Arrange
    const mockRegister = register as jest.Mock;
    mockRegister.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Register error"));
      },
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "password", role: "user" });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Register error" });
    expect(mockRegister).toHaveBeenCalled();
  });

  it("should handle errors in login route", async () => {
    // Arrange
    const mockLogin = login as jest.Mock;
    mockLogin.mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Login error"));
      },
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "password" });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Login error" });
    expect(mockLogin).toHaveBeenCalled();
  });
});
