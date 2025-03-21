import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware";
import taskRoutes from "./task.routes";

// Mocking dependencies
jest.mock("../middlewares/auth.middleware");
jest.mock("../controllers/task.controller");

describe("Task Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/tasks", taskRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getTasks controller on GET /api/tasks", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (getTasks as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ message: "Get tasks successful" });
      }
    );

    // Act
    const response = await request(app).get("/api/tasks");

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Get tasks successful" });
    expect(getTasks).toHaveBeenCalled();
  });

  it("should call createTask controller on POST /api/tasks", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (createTask as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(201).json({ message: "Create task successful" });
      }
    );

    // Act
    const response = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "Test Description",
      priority: "medium",
      due_date: "2024-03-22",
    });

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: "Create task successful" });
    expect(createTask).toHaveBeenCalled();
  });

  it("should call updateTask controller on PUT /api/tasks/:id", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (updateTask as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ message: "Update task successful" });
      }
    );

    // Act
    const response = await request(app).put("/api/tasks/1").send({
      title: "Updated Task",
      description: "Updated Description",
      priority: "high",
      due_date: "2024-03-23",
      completed: true,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Update task successful" });
    expect(updateTask).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.any(Function)
    );
  });

  it("should call deleteTask controller on DELETE /api/tasks/:id", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (isAdmin as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (deleteTask as jest.Mock).mockImplementation(
      (req: Request, res: Response) => {
        res.status(200).json({ message: "Delete task successful" });
      }
    );

    // Act
    const response = await request(app).delete("/api/tasks/1");

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Delete task successful" });
    expect(deleteTask).toHaveBeenCalled();
  });

  it("should handle errors in getTasks route", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (getTasks as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Get tasks error"));
      }
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app).get("/api/tasks");

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Get tasks error" });
    expect(getTasks).toHaveBeenCalled();
  });

  it("should handle errors in createTask route", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (createTask as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Create task error"));
      }
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app).post("/api/tasks").send({
      title: "Test Task",
      description: "Test Description",
      priority: "medium",
      due_date: "2024-03-22",
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Create task error" });
    expect(createTask).toHaveBeenCalled();
  });

  it("should handle errors in updateTask route", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (updateTask as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Update task error"));
      }
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app).put("/api/tasks/1").send({
      title: "Updated Task",
      description: "Updated Description",
      priority: "high",
      due_date: "2024-03-23",
      completed: true,
    });

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Update task error" });
    expect(updateTask).toHaveBeenCalled();
  });

  it("should handle errors in deleteTask route", async () => {
    // Arrange
    (verifyToken as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (isAdmin as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
    (deleteTask as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => {
        next(new Error("Delete task error"));
      }
    );

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ message: err.message });
    });

    // Act
    const response = await request(app).delete("/api/tasks/1");

    // Assert
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Delete task error" });
    expect(deleteTask).toHaveBeenCalled();
  });
});
