import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonModule, ModalModule } from "carbon-components-angular";
import { Task } from "../../../../models/task.model";
import { TaskService } from "../../../../services/task.service";
@Component({
  selector: "app-task-delete",
  templateUrl: "./task-delete.component.html",
  imports: [CommonModule, ButtonModule, ModalModule],
})
export class TaskDeleteComponent {
  @Output() closeModalClick = new EventEmitter<void>();
  @Input() task: Task = {
    id: 0,
    title: "",
  };
  loading = false;
  submitted = false;
  error = "";
  successMsg = "";

  constructor(private taskservice: TaskService) {}

  closeModal() {
    this.closeModalClick.emit();
  }

  async onSubmit() {
    this.submitted = true;
    this.loading = true;

    try {
      if (this.task.id !== 0) {
        await this.taskservice.deleteTask(this.task.id);
      }
      this.loading = false;
      this.error = "";
      this.successMsg = "Task deleted successfully";
    } catch (error: any) {
      this.error = error?.message || "Task deleting failed";
      this.successMsg = "";
      this.loading = false;
    }
  }
}
