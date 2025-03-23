import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Task } from "../../../../models/task.model";
import { TaskStore } from "../../../../stores/tasks.store";
import { TaskListComponent } from "./task-list.component";

describe("TaskListComponent", () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskStore: TaskStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, HttpClientTestingModule],
      providers: [TaskStore],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskStore = TestBed.inject(TaskStore);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display tasks", () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        priority: "High",
        due_date: "2023-10-10",
      },
    ];
    taskStore.setTasks(tasks, 1, 1, 10);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector("h5.font-semibold").textContent).toContain(
      "Test Task",
    );
  });
});
