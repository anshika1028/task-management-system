import { Injectable } from "@angular/core";
import { action, computed, makeObservable, observable } from "mobx";
import { Task } from "../models/task.model";

@Injectable({
  providedIn: "root",
})
export class TaskStore {
  @observable tasks: Task[] = [];
  @observable totalRecords = 0;
  @observable currentPage = 1;
  @observable pageLength = 10;
  @observable loading = false;

  constructor() {
    makeObservable(this);
  }

  @computed get getTasks(): Task[] {
    return this.tasks;
  }

  @action setTasks(
    tasks: Task[],
    totalRecords: number,
    currentPage: number,
    pageLength: number,
  ) {
    this.tasks = tasks;
    this.totalRecords = totalRecords;
    this.currentPage = currentPage;
    this.pageLength = pageLength;
  }

  @action addTask(task: Task) {
    this.tasks = [task, ...this.tasks];
    this.totalRecords++;
  }

  @action updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? Object.assign({}, task, updatedTask) : task,
    );
  }

  @action removeTask(taskId: number) {
    if (this.tasks?.find((task) => task.id === taskId)) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.totalRecords--;
    }
  }

  @action setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  @computed get taskCount() {
    return this.totalRecords;
  }
}
