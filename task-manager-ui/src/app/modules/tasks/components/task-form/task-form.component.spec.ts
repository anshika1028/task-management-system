import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { TaskService } from "../../../../services/task.service";
import { MetaStore } from "../../../../stores/meta.store";
import { TaskStore } from "../../../../stores/tasks.store";
import { UserStore } from "../../../../stores/user.store";
import { TaskFormComponent } from "./task-form.component";

describe("TaskFormComponent", () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TaskFormComponent,
      ],
      providers: [TaskService, TaskStore, MetaStore, UserStore],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form", () => {
    expect(component.taskCreateForm).toBeDefined();
  });

  it("should submit form", () => {
    component.taskCreateForm.setValue({
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      due_date: "2023-10-10",
      completed: "false",
    });
    component.onSubmit();
    expect(component.submitted).toBe(true);
  });
});
