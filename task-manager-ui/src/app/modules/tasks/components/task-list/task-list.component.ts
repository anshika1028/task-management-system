import { Component, inject, OnInit, signal } from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import {
  ButtonModule,
  ComboBoxModule,
  DatePickerModule,
  ListItem,
  ModalService,
  PaginationModule,
  SkeletonModule,
  StructuredListModule,
  TagModule,
} from "carbon-components-angular";
import { autorun } from "mobx";
import { capitalize, getTimeAgoString } from "../../../../misc/utils";
import { Task } from "../../../../models/task.model";
import { TaskService } from "../../../../services/task.service";
import { MetaStore } from "../../../../stores/meta.store";
import { TaskStore } from "../../../../stores/tasks.store";
import { UserStore } from "../../../../stores/user.store";
import { TaskDeleteComponent } from "../task-delete/task-delete.component";
import { TaskFormComponent } from "../task-form/task-form.component";
@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [
    DatePickerModule,
    PaginationModule,
    ButtonModule,
    NgIcon,
    TaskFormComponent,
    TaskDeleteComponent,
    SkeletonModule,
    StructuredListModule,
    TagModule,
    ComboBoxModule,
  ],
  templateUrl: "./task-list.component.html",
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private taskStore = inject(TaskStore);
  private metaStore = inject(MetaStore);
  private userStore = inject(UserStore);

  isAdmin = this.userStore.isAdmin;
  loading = true;
  taskToEdit = null;
  tasks$ = signal(this.taskStore.tasks);
  pagination = {
    currentPage: this.taskStore.currentPage,
    pageLength: this.taskStore.pageLength,
    totalDataLength: this.taskStore.totalRecords,
  };

  filterValues: {
    priority: string;
    due_date: string[];
  } = {
    priority: "",
    due_date: [],
  };
  showModal = false;
  showDeleteModal = false;
  showFilters = false;

  priorities$: ListItem[] =
    this.metaStore.priorities?.map((v) => ({
      content: v,
      selected: false,
    })) || [];

  constructor(protected modalService: ModalService) {}

  ngOnInit(): void {
    // Automatically update the component when store data changes
    autorun(() => {
      this.tasks$.set(this.taskStore.tasks);
      this.pagination.totalDataLength = this.taskStore.totalRecords;
      this.pagination.currentPage = this.taskStore.currentPage;
      this.pagination.pageLength = this.taskStore.pageLength;
    });
    this.fetchTasks();
  }

  fetchTasks(): void {
    try {
      this.loading = true;
      this.taskService.getTasks({
        ...this.filterValues,
        page: this.pagination.currentPage,
        limit: this.pagination.pageLength,
      });
    } catch (e) {
      console.error("❌ Error fetching tasks:", e);
    } finally {
      this.loading = false;
    }
  }

  onFilterPriority(event): void {
    this.filterValues.priority = event.content;
    this.fetchTasks(); // Fetch tasks based on filters
  }

  onFilterDueDate(event): void {
    if (event.length > 1) {
      const date1 = new Date(event[0]).toLocaleDateString("en-US");
      const date2 = new Date(event[1]).toLocaleDateString("en-US");
      this.filterValues.due_date = [date1, date2];
      this.fetchTasks(); // Fetch tasks based on filters}
    }
  }

  onAddTask() {
    this.showModal = true;
  }

  canUndo(task: Task) {
    if (task.updatedAt) {
      const FIVE_MINUTES = 5 * 60 * 1000;
      const lastUpdated = new Date(task.updatedAt).getTime();
      if (Date.now() - lastUpdated < FIVE_MINUTES) {
        return !!task?.showUndoButton;
      }
    }
    return false;
  }

  onUndo(task: Task) {
    this.taskService.undoTask(task.id);
  }

  onCloseModal() {
    this.showModal = false;
    this.taskToEdit = null;
    this.showDeleteModal = false;
  }

  fromNow(date?: string) {
    return date ? getTimeAgoString(date) : "-";
  }

  onEdit(task) {
    this.showModal = true;
    this.taskToEdit = task;
  }

  onDelete(task) {
    this.showDeleteModal = true;
    this.taskToEdit = task;
  }

  selectPage(page: number) {
    this.pagination.currentPage = page;
    this.fetchTasks();
  }

  resetDueDateFilters() {
    this.filterValues.due_date = [];
    this.fetchTasks();
  }

  formatDate(date?: string) {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          dateStyle: "medium",
        })
      : "-";
  }

  capitalizeText(word?: string): string {
    return word ? capitalize(word) : "-";
  }
}
