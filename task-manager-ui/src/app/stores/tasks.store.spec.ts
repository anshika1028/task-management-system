import { TestBed } from "@angular/core/testing";
import { Task } from "../models/task.model";
import { TaskStore } from "./tasks.store";

describe("TaskStore", () => {
  let store: TaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskStore],
    });
    store = TestBed.inject(TaskStore);
  });

  it("should be created", () => {
    expect(store).toBeTruthy();
  });

  it("should set tasks", () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        priority: "High",
        due_date: "2023-10-10",
      },
    ];
    store.setTasks(tasks, 1, 1, 10);
    expect(store.getTasks).toEqual(tasks);
    expect(store.totalRecords).toBe(1);
    expect(store.currentPage).toBe(1);
    expect(store.pageLength).toBe(10);
  });

  it("should add a task", () => {
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      due_date: "2023-10-10",
    };
    store.addTask(task);
    expect(store.getTasks).toContain(task);
    expect(store.totalRecords).toBe(1);
  });

  it("should update a task", () => {
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      due_date: "2023-10-10",
    };
    store.addTask(task);
    const updatedTask: Task = {
      id: 1,
      title: "Updated Task",
      description: "Updated Description",
      priority: "Low",
      due_date: "2023-10-11",
    };
    store.updateTask(updatedTask);
    expect(store.getTasks[0]).toEqual(updatedTask);
  });

  it("should remove a task", () => {
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      due_date: "2023-10-10",
    };
    store.addTask(task);
    store.removeTask(1);
    expect(store.getTasks).not.toContain(task);
    expect(store.totalRecords).toBe(0);
  });

  it("should set loading state", () => {
    store.setLoading(true);
    expect(store.loading).toBe(true);
  });

  it("should return task count", () => {
    expect(store.taskCount).toBe(0);
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      due_date: "2023-10-10",
    };
    store.addTask(task);
    expect(store.taskCount).toBe(1);
  });
});
