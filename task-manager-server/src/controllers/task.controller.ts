import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { logger } from "../logger";
import ApiError from "../middlewares/ApiError";
import PublicHoliday from "../models/public-holiday.model";
import TaskHistory from "../models/task-history.model";
import Task from "../models/task.model";
import User from "../models/user.model";
// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { priority, due_date, page = "1", limit = "10" } = req.query;
    const filters: any = {};

    if (priority) filters.priority = priority;

    // ✅ Handle single date OR range of due_dates
    if (due_date) {
      const dateRange = (due_date as string).split(",");
      if (dateRange.length === 2) {
        const start = new Date(dateRange[0]);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(dateRange[1]);
        end.setUTCHours(23, 59, 59, 999);
        filters.due_date = { [Op.between]: [start, end] };
      } else {
        const startOfDay = new Date(due_date as string);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(due_date as string);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filters.due_date = { [Op.between]: [startOfDay, endOfDay] };
      }
    }

    // ✅ Only admins can view all tasks
    if (req.userRole !== "admin") {
      filters.user_id = req.userId;
    }

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * pageSize;

    const { count, rows: tasks } = await Task.findAndCountAll({
      where: filters,
      limit: pageSize,
      offset: offset,
      order: [["due_date", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    // ⏱️ For undo button: check if TaskHistory exists < 5 mins for each task
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;
    logger.info("🔍 Incoming Filter & Pagination Query:", tasks);

    const formattedTasks = await Promise.all(
      tasks.map(async (task) => {
        const lastHistory = await TaskHistory.findOne({
          where: {
            id: task.id,
          },
          order: [["updatedAt", "DESC"]],
        });

        const showUndoButton =
          !!lastHistory &&
          new Date(task.updatedAt).getTime >=
            new Date(lastHistory.updatedAt).getTime &&
          now - new Date(lastHistory.updatedAt).getTime() < FIVE_MINUTES;

        return {
          ...task.toJSON(),
          username: task.user?.username || "Unknown",
          showUndoButton,
        };
      }),
    );
    logger.info("🔍 Incoming Filter & Pagination Query:", formattedTasks);

    res.json({
      success: count > 0,
      message: count === 0 ? "No records found" : "Tasks fetched successfully",
      data: {
        totalRecords: count,
        currentPage: pageNumber,
        pageLength: pageSize,
        tasks: formattedTasks,
      },
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError(500, "Error fetching tasks", error));
    }
    return next(error);
  }
};

// ✅ Create a Task (Prevent on Public Holidays & Weekends)
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, priority, due_date } = req.body;

    // ✅ Convert due_date to a Date object
    const dueDateObj = new Date(due_date);
    const formattedDueDate = dueDateObj.toISOString().split("T")[0];

    // ✅ Check if due_date is a **Saturday (6) or Sunday (0)**
    const dayOfWeek = dueDateObj.getUTCDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      throw new ApiError(
        400,
        "Cannot create tasks on weekends (Saturday or Sunday)",
      );
    }

    // ✅ Check if due_date exists in `public_holidays` table
    const isPublicHoliday = await PublicHoliday.findOne({
      where: { date: formattedDueDate },
    });

    if (isPublicHoliday) {
      throw new ApiError(
        400,
        `Cannot create tasks on public holidays: ${isPublicHoliday.holiday_name}`,
      );
    }

    // ✅ Create the task
    const task = await Task.create({
      title,
      description,
      priority,
      due_date,
      user_id: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError(500, "Error creating task", error));
    }
    return next(error);
  }
};

// ✅ Update a Task
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, description, priority, due_date, completed } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.user_id !== req.userId && req.userRole !== "admin") {
      throw new ApiError(403, "Not authorized to update this task");
    }
    await TaskHistory.upsert({ ...task.toJSON() });
    await task.update({
      title,
      description,
      priority,
      due_date,
      completed,
    });
    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task: { ...task.toJSON(), showUndoButton: true } },
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError(500, "Error updating task", error));
    }
    return next(error);
  }
};

// ✅ Delete a Task (Admins Only)
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    await task.destroy();
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError(500, "Error deleting task", error));
    }
    return next(error);
  }
};

// ✅ Update a Task
export const undoTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const taskHistory = await TaskHistory.findOne({
      where: {
        id: req.params.id,
      },
      order: [["updatedAt", "DESC"]],
    });

    if (!taskHistory?.updatedAt) {
      throw new ApiError(404, "Task  history not found");
    }

    // ✅ Check if history is older than 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000; // in milliseconds
    const now = Date.now(); // current time
    const updatedAt = new Date(taskHistory.updatedAt).getTime(); // convert Sequelize date to ms

    if (now - updatedAt > FIVE_MINUTES) {
      throw new ApiError(405, "Task history expired (more than 5 minutes old)");
    }

    if (taskHistory.user_id !== req.userId && req.userRole !== "admin") {
      throw new ApiError(403, "Not authorized to update this task");
    }

    await Task.update(taskHistory.toJSON(), {
      where: { id: taskHistory.id },
    });

    res.json({
      success: true,
      message: "Task history restored successfully",
      data: {
        task: { ...taskHistory.toJSON(), showUndoButton: false },
      },
    });
  } catch (error: any) {
    if (!(error instanceof ApiError)) {
      return next(new ApiError(500, "Error updating task", error));
    }
    return next(error);
  }
};
