import { Injectable } from "@angular/core";
import { action, computed, makeObservable, observable } from "mobx";
import { Task } from "../models/task.model";

@Injectable({
  providedIn: "root",
})
export class TaskStore {
  @observable tasks: Task[] = [];
  @observable totalRecords: number = 0;
  @observable currentPage: number = 1;
  @observable totalPages: number = 1;
  @observable loading: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @computed get getTasks(): Task[] {
    return this.tasks;
  }

  @action setTasks(tasks: Task[], totalRecords: number, currentPage: number, totalPages: number) {
    this.tasks = tasks;
    this.totalRecords = totalRecords;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
  }

  @action addTask(task: Task) {
    this.tasks = [task, ...this.tasks];
  }

  @action updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map(task => (task.id === updatedTask.id ? updatedTask : task));
  }

  @action removeTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  @action setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  @computed get taskCount() {
    return this.totalRecords;
  }
}
