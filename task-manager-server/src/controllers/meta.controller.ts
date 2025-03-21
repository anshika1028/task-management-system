import { Request, Response } from "express";
import ApiError from "../middlewares/ApiError";
import PublicHoliday from "../models/public-holiday.model";
import Task from "../models/task.model";
import User from "../models/user.model";

/**
 * API to return dynamic global data (Enums + Public Holidays)
 */
export const getMetaData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // ✅ Extract ENUM values from User model (Roles)
    const roleEnumValues = (User.getAttributes().role.type as any).values;

    // ✅ Extract ENUM values from Task model (Priorities)
    const priorityEnumValues = (Task.getAttributes().priority.type as any)
      .values;

    // ✅ Fetch Public Holidays from DB
    const publicHolidays = await PublicHoliday.findAll({
      attributes: ["id", "holiday_name", "date"],
      order: [["date", "ASC"]], // Sort by date
    });

    res.json({
      success: true,
      message: "Meta data fetched successfully",
      data: {
        roles: roleEnumValues, // ✅ Roles dynamically from DB
        priorities: priorityEnumValues, // ✅ Priorities dynamically from DB
        publicHolidays, // ✅ Public holidays from DB
      },
    });
  } catch (error) {
    throw new ApiError(500, "Error fetching meta data");
  }
};
