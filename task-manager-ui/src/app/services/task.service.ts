import { Injectable } from "@angular/core";
import axios from "axios";
import { environment } from "../../environment";
import { ERROR_LABELS } from "../constants/labels";
import { MetaStore } from "../stores/meta.store";
import { TaskStore } from "../stores/tasks.store";
import { UserStore } from "../stores/user.store";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  private apiUrl = `${environment.apiBaseUrl}/api/tasks`;

  constructor(
    private taskStore: TaskStore,
    private metaStore: MetaStore, // ✅ Inject MetaStore to access public holidays
    private userStore: UserStore // ✅ Inject UserStore to check user role
  ) {}

  /**
   * ✅ Fetch tasks with filtering & pagination
   */
  async getTasks(values: {
    priority?: string;
    due_date?: string;
    page: number;
    limit: number;
  }) {
    try {
      let params = `?page=${values.page}&limit=${values.limit}`;
      if (values.priority) params += `&priority=${values.priority}`;
      if (values.due_date) params += `&due_date=${values.due_date}`;

      console.log("in get task", `${this.apiUrl}${params}`);

      const response = await axios.get(`${this.apiUrl}${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      this.taskStore.setTasks(
        response.data.data.tasks,
        response.data.data.totalRecords,
        response.data.data.currentPage,
        response.data.data.totalPages
      );
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error fetching tasks:", error);
      return Promise.reject(
        error.response?.data || ERROR_LABELS.NO_RECORDS_FOUND
      );
    }
  }

  /**
   * ✅ Validate due_date (Prevent tasks on public holidays)
   */
  isValidDueDate(dueDate: string): boolean {
    const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];
    const publicHolidays = this.metaStore.publicHolidays;
    return !publicHolidays.some((holiday) => holiday.date === formattedDueDate);
  }

  /**
   * ✅ Create a new task (Prevents invalid due_date)
   */
  async createTask(task: {
    title: string;
    description: string;
    priority: string;
    due_date: string;
  }) {
    if (!this.isValidDueDate(task.due_date)) {
      return Promise.reject(ERROR_LABELS.INVALID_DATE);
    }

    try {
      const response = await axios.post(this.apiUrl, task, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      this.taskStore.addTask(response.data.data.task);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error creating task:", error);
      return Promise.reject(error.response?.data || "Error creating task");
    }
  }

  /**
   * ✅ Update an existing task
   */
  async updateTask(taskId: number, updatedTask: any) {
    try {
      const response = await axios.put(
        `${this.apiUrl}/${taskId}`,
        updatedTask,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      this.taskStore.updateTask(response.data.data.task);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error updating task:", error);
      return Promise.reject(error.response?.data || "Error updating task");
    }
  }

  /**
   * ✅ Delete a task (Admins only)
   */
  async deleteTask(taskId: number) {
    // ✅ Check if user is an admin before deleting
    if (!this.userStore.isAdmin) {
      return Promise.reject(ERROR_LABELS.UNAUTHORIZED);
    }

    try {
      const response = await axios.delete(`${this.apiUrl}/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      this.taskStore.removeTask(taskId);
      return response.data.data;
    } catch (error: any) {
      console.error("❌ Error deleting task:", error);
      return Promise.reject(error.response?.data || ERROR_LABELS.UNAUTHORIZED);
    }
  }
}
