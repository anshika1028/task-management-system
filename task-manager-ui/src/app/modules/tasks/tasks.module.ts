import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TaskService } from "../../services/task.service";
import { TaskStore } from "../../stores/tasks.store";
import { TaskFormComponent } from "./components/task-form/task-form.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskRoutingModule } from "./tasks-routing.module";
import { TaskDeleteComponent } from "./components/task-delete/task-delete.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskRoutingModule,
    TaskFormComponent,
    TaskListComponent,
    TaskDeleteComponent,
  ],
  providers: [TaskService, TaskStore],
})
export class TaskModule {}
