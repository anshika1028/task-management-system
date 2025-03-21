import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskFormComponent } from "./components/task-form/task-form.component";

const routes: Routes = [
  { path: "", component: TaskListComponent }, // List all tasks
  { path: "create", component: TaskFormComponent }, // Create task
  { path: "edit/:id", component: TaskFormComponent }, // Edit task
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
