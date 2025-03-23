import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TaskService } from "../../../../services/task.service";
import { TaskStore } from "../../../../stores/tasks.store";
import { TaskDeleteComponent } from "./task-delete.component";

describe("TaskDeleteComponent", () => {
  let component: TaskDeleteComponent;
  let fixture: ComponentFixture<TaskDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, TaskStore],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should delete task", () => {
    spyOn(component as any, "onSubmit");
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
