import { formatDate } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
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
    private http: HttpClient,
    private taskStore: TaskStore,
    private metaStore: MetaStore,
    private userStore: UserStore
  ) {}

  /**
   * ✅ Fetch tasks with filtering & pagination
   */
  async getTasks(values: {
    priority?: string;
    due_date?: string[];
    page: number;
    limit: number;
  }) {
    try {
      let params = new HttpParams()
        .set("page", values.page)
        .set("limit", values.limit);

      if (values.priority) {
        params = params.set("priority", values.priority);
      }

      if (values.due_date?.length) {
        params = params.set("due_date", values.due_date.join(","));
      }

      const response$ = await this.http.get(this.apiUrl, { params }).subscribe({
        next: (response: any) => {
          if (response?.data) {
            const data = response.data;
            this.taskStore.setTasks(
              data.tasks,
              data.totalRecords,
              data.currentPage,
              data.pageLength
            );
            return data;
          }
        },
        error: (error) => {
          console.error("❌ Error fetching tasks:", error);
          return throwError(() => error.error || ERROR_LABELS.NO_RECORDS_FOUND);
        },
      });

      return Promise.resolve(response$);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * ✅ Validate due_date (Prevent tasks on public holidays)
   */
  isValidDueDate(due_date: string): boolean {
    const publicHolidays = this.metaStore.publicHolidays;
    return !publicHolidays.some((holiday) => holiday.date === due_date);
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
    task.due_date = formatDate(new Date(task.due_date), "yyyy-MM-dd", "en-US");

    if (!this.isValidDueDate(task.due_date)) {
      return Promise.reject(ERROR_LABELS.INVALID_DATE);
    }

    const response$ = await this.http.post(this.apiUrl, task).subscribe({
      next: (response: any) => {
        if (response?.data?.task) {
          const username = this.userStore.username;
          this.taskStore.addTask(
            Object.assign(response.data.task, { username })
          );
        }
        return response?.data;
      },
      error: (error) => {
        return throwError(() => error.error || "Error creating task");
      },
    });

    return Promise.resolve(response$);
  }

  /**
   * ✅ Update an existing task
   */
  async updateTask(taskId: number, updatedTask: any) {
    const response$ = this.http
      .put<any>(`${this.apiUrl}/${taskId}`, updatedTask)
      .pipe(
        map((response) => {
          this.taskStore.updateTask(response.data.task);
          return response.data;
        }),
        catchError((error) => {
          console.error("❌ Error updating task:", error);
          return throwError(() => error.error || "Error updating task");
        })
      );

    return await firstValueFrom(response$);
  }

  async undoTask(taskId: number) {
    const response$ = this.http.put(`${this.apiUrl}/${taskId}/undo`, {}).pipe(
      map((response: any) => {
        this.taskStore.updateTask(response?.data?.task);
        return response?.data;
      }),
      catchError((error) => {
        console.error("❌ Error undo task:", error);
        return throwError(() => error.error || "Error undo task");
      })
    );

    return await firstValueFrom(response$);
  }

  /**
   * ✅ Delete a task (Admins only)
   */
  async deleteTask(taskId: number) {
    if (!this.userStore.isAdmin) {
      return Promise.reject(ERROR_LABELS.UNAUTHORIZED);
    }

    const response$ = this.http.delete<any>(`${this.apiUrl}/${taskId}`).pipe(
      map((response) => {
        this.taskStore.removeTask(taskId);
        return response.data;
      }),
      catchError((error) => {
        console.error("❌ Error deleting task:", error);
        return throwError(() => error.error || ERROR_LABELS.UNAUTHORIZED);
      })
    );

    return await firstValueFrom(response$);
  }
}
