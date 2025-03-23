import { Response } from "express";
import { Op } from "sequelize";
import PublicHoliday from "../models/public-holiday.model";
import TaskHistory from "../models/task-history.model";
import Task from "../models/task.model";
import {
  createTask,
  deleteTask,
  getTasks,
  undoTask,
  updateTask,
} from "./task.controller";

// Mocking dependencies
jest.mock("../models/task.model");
jest.mock("../models/public-holiday.model");
jest.mock("../models/task-history.model");

describe("Task Controller", () => {
  let mockRequest: any;
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

  describe("getTasks", () => {
    it("should fetch tasks successfully with filters and pagination", async () => {
      // Arrange
      mockRequest.query = {
        priority: "high",
        due_date: "2024-03-22",
        page: "1",
        limit: "10",
      };
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: [
          { id: 1, title: "Task 1", priority: "high", due_date: "2024-03-22" },
          { id: 2, title: "Task 2", priority: "high", due_date: "2024-03-22" },
        ],
      });

      // Act
      await getTasks(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(Task.findAndCountAll).toHaveBeenCalledWith({
        where: {
          priority: "high",
          due_date: {
            [Op.between]: [
              new Date("2024-03-22T00:00:00.000Z"),
              new Date("2024-03-22T23:59:59.999Z"),
            ],
          },
        },
        limit: 10,
        offset: 0,
        order: [["due_date", "ASC"]],
        include: [{ model: User, attributes: ["username"] }],
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Tasks fetched successfully",
        data: {
          totalRecords: 2,
          currentPage: 1,
          pageLength: 10,
          tasks: [
            {
              id: 1,
              title: "Task 1",
              priority: "high",
              due_date: "2024-03-22",
            },
            {
              id: 2,
              title: "Task 2",
              priority: "high",
              due_date: "2024-03-22",
            },
          ],
        },
      });
    });

    it('should return "No records found" when no tasks are available', async () => {
      // Arrange
      mockRequest.query = {};
      (Task.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      // Act
      await getTasks(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "No records found",
        data: {
          totalRecords: 0,
          currentPage: 1,
          pageLength: 10,
          tasks: [],
        },
      });
    });

    it("should handle errors and pass them to the next middleware", async () => {
      // Arrange
      mockRequest.query = {};
      (Task.findAndCountAll as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      // Act
      await getTasks(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      // Arrange
      mockRequest.body = {
        title: "New Task",
        description: "Task description",
        priority: "medium",
        due_date: "2024-03-25",
      };
      mockRequest.userId = 1;
      (PublicHoliday.findOne as jest.Mock).mockResolvedValue(null);
      (Task.create as jest.Mock).mockResolvedValue({
        id: 3,
        title: "New Task",
        description: "Task description",
        priority: "medium",
        due_date: "2024-03-25",
        user_id: 1,
      });

      // Act
      await createTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(PublicHoliday.findOne).toHaveBeenCalledWith({
        where: { date: "2024-03-25" },
      });
      expect(Task.create).toHaveBeenCalledWith({
        title: "New Task",
        description: "Task description",
        priority: "medium",
        due_date: "2024-03-25",
        user_id: 1,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Task created successfully",
        data: {
          task: {
            id: 3,
            title: "New Task",
            description: "Task description",
            priority: "medium",
            due_date: "2024-03-25",
            user_id: 1,
          },
        },
      });
    });

    it("should return 400 if task creation is attempted on a weekend", async () => {
      // Arrange
      mockRequest.body = {
        title: "Weekend Task",
        description: "Task description",
        priority: "low",
        due_date: "2024-03-23", // Saturday
      };

      // Act
      await createTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Cannot create tasks on weekends (Saturday or Sunday)",
      });
    });

    it("should return 400 if task creation is attempted on a public holiday", async () => {
      // Arrange
      mockRequest.body = {
        title: "Holiday Task",
        description: "Task description",
        priority: "high",
        due_date: "2024-03-29",
      };
      (PublicHoliday.findOne as jest.Mock).mockResolvedValue({
        holiday_name: "Good Friday",
        date: "2024-03-29",
      });

      // Act
      await createTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(PublicHoliday.findOne).toHaveBeenCalledWith({
        where: { date: "2024-03-29" },
      });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Cannot create tasks on public holidays: Good Friday",
      });
    });

    it("should handle errors and pass them to the next middleware", async () => {
      // Arrange
      mockRequest.body = {
        title: "New Task",
        description: "Task description",
        priority: "medium",
        due_date: "2024-03-25",
      };
      mockRequest.userId = 1;
      (PublicHoliday.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      // Act
      await createTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.userId = 1;
      mockRequest.body = {
        title: "Updated Task",
        description: "Updated description",
        priority: "high",
        due_date: "2024-03-26",
        completed: true,
      };
      const mockTask = {
        id: 1,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        due_date: "2024-03-25",
        completed: false,
        user_id: 1,
        update: jest.fn().mockResolvedValue(undefined), // Mock the update method
      };
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      // Act
      await updateTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(Task.findByPk).toHaveBeenCalledWith("1");
      expect(mockTask.update).toHaveBeenCalledWith({
        title: "Updated Task",
        description: "Updated description",
        priority: "high",
        due_date: "2024-03-26",
        completed: true,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Task updated successfully",
        data: { task: { ...mockTask, showUndoButton: true } },
      });
    });

    it("should return 404 if task is not found", async () => {
      // Arrange
      mockRequest.params = { id: "99" };
      mockRequest.userId = 1;
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      // Act
      await updateTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Task not found",
      });
    });

    it("should return 403 if user is not authorized to update the task", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.userId = 2;
      const mockTask = {
        id: 1,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        due_date: "2024-03-25",
        completed: false,
        user_id: 1,
      };
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      // Act
      await updateTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Not authorized to update this task",
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const mockTask = {
        id: 1,
        title: "Task to Delete",
        description: "Description",
        priority: "low",
        due_date: "2024-03-27",
        completed: false,
        user_id: 1,
        destroy: jest.fn().mockResolvedValue(undefined), // Mock the destroy method
      };
      (Task.findByPk as jest.Mock).mockResolvedValue(mockTask);

      // Act
      await deleteTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(Task.findByPk).toHaveBeenCalledWith("1");
      expect(mockTask.destroy).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task is not found", async () => {
      // Arrange
      mockRequest.params = { id: "99" };
      (Task.findByPk as jest.Mock).mockResolvedValue(null);

      // Act
      await deleteTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Task not found",
      });
    });

    it("should handle errors and pass them to the next middleware", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      (Task.findByPk as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      // Act
      await deleteTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  describe("undoTask", () => {
    it("should undo a task successfully", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.userId = 1;
      const mockTaskHistory = {
        id: 1,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        due_date: "2024-03-25",
        completed: false,
        user_id: 1,
        updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      };
      (TaskHistory.findOne as jest.Mock).mockResolvedValue(mockTaskHistory);
      (Task.update as jest.Mock).mockResolvedValue([1]);

      // Act
      await undoTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(TaskHistory.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        order: [["updatedAt", "DESC"]],
      });
      expect(Task.update).toHaveBeenCalledWith(mockTaskHistory, {
        where: { id: "1" },
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Task history restored successfully",
        data: {
          task: { ...mockTaskHistory, showUndoButton: false },
        },
      });
    });

    it("should return 404 if task history is not found", async () => {
      // Arrange
      mockRequest.params = { id: "99" };
      (TaskHistory.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      await undoTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Task history not found",
      });
    });

    it("should return 405 if task history is older than 5 minutes", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      const mockTaskHistory = {
        id: 1,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        due_date: "2024-03-25",
        completed: false,
        user_id: 1,
        updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      };
      (TaskHistory.findOne as jest.Mock).mockResolvedValue(mockTaskHistory);

      // Act
      await undoTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(405);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Task history expired (more than 5 minutes old)",
      });
    });

    it("should return 403 if user is not authorized to undo the task", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.userId = 2;
      const mockTaskHistory = {
        id: 1,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        due_date: "2024-03-25",
        completed: false,
        user_id: 1,
        updatedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      };
      (TaskHistory.findOne as jest.Mock).mockResolvedValue(mockTaskHistory);

      // Act
      await undoTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Not authorized to update this task",
      });
    });

    it("should handle errors and pass them to the next middleware", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      (TaskHistory.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      // Act
      await undoTask(mockRequest as any, mockResponse as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new Error("Database error"));
    });
  });
});
