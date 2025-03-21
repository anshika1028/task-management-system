import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { logger } from "../logger";
import ApiError from "../middlewares/ApiError";
import PublicHoliday from "../models/public-holiday.model";
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
  next: NextFunction
): Promise<void> => {
  try {
    logger.info("🔍 Incoming Filter & Pagination Query:", req.query);

    const { priority, due_date, page = "1", limit = "10" } = req.query;

    const filters: any = {};

    if (priority) filters.priority = priority;

    if (due_date) {
      const startOfDay = new Date(due_date as string);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(due_date as string);
      endOfDay.setUTCHours(23, 59, 59, 999);
      filters.due_date = { [Op.between]: [startOfDay, endOfDay] };
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
          attributes: ["username"], // ✅ Include username
        },
      ],
    });

    // ✅ Format tasks to include username directly
    const formattedTasks = tasks.map((task) => ({
      ...task.toJSON(),
      username: task.user?.username || "Unknown",
    }));

    res.json({
      success: count > 0,
      message: count === 0 ? "No records found" : "Tasks fetched successfully",
      data: {
        totalRecords: count,
        currentPage: pageNumber,
        totalPages: Math.ceil(count / pageSize),
        tasks: formattedTasks,
      }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Create a Task (Prevent on Public Holidays & Weekends)
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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
        "Cannot create tasks on weekends (Saturday or Sunday)"
      );
    }

    // ✅ Check if due_date exists in `public_holidays` table
    const isPublicHoliday = await PublicHoliday.findOne({
      where: { date: formattedDueDate },
    });

    if (isPublicHoliday) {
      throw new ApiError(
        400,
        `Cannot create tasks on public holidays: ${isPublicHoliday.holiday_name}`
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

    res
      .status(201)
      .json({ success: true, message: "Task created successfully", data:{taskId: task.id }});
  } catch (error) {
    next(error);
  }
};

// ✅ Update a Task
export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, priority, due_date, completed } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    if (task.user_id !== req.userId) {
      throw new ApiError(403, "Not authorized to update this task");
    }

    await task.update({ title, description, priority, due_date, completed });

    res.json({ success: true, message: "Task updated successfully"});
  } catch (error) {
    next(error);
  }
};

// ✅ Delete a Task (Admins Only)
export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    await task.destroy();
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
