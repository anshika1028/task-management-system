import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import {
  ButtonModule,
  CheckboxModule,
  DatePickerModule,
  DropdownModule,
  InputModule,
  PaginationModule,
  TableHeaderItem,
  TableItem,
  TableModel,
  TableModule,
} from "carbon-components-angular";
import { autorun } from "mobx";
import { TaskService } from "../../../../services/task.service";
import { TaskStore } from "../../../../stores/tasks.store";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    DropdownModule,
    TableModule,
    DatePickerModule,
    PaginationModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: "./task-list.component.html",
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private taskStore = inject(TaskStore);
  private fb = inject(FormBuilder);

  tasks$ = signal(this.taskStore.tasks);
  totalRecords$ = signal(this.taskStore.totalRecords);
  currentPage$ = signal(this.taskStore.currentPage);
  totalPages$ = signal(this.taskStore.totalPages);

  filterForm!: FormGroup;
  pageSize = 5; // Default page size

  ngOnInit(): void {
    console.log("TaskListComponent initialized");
    this.filterForm = this.fb.group({
      priority: [""], // Dropdown for priority filter
      due_date: [""], // Date picker
    });
    // Automatically update the component when store data changes
    autorun(() => {
      this.tasks$.set(this.taskStore.tasks);
      this.totalRecords$.set(this.taskStore.totalRecords);
      this.currentPage$.set(this.taskStore.currentPage);
      this.totalPages$.set(this.taskStore.totalPages);
    });
    // Fetch initial task list
    this.fetchTasks();
    this.init();
  }

  fetchTasks(page = 1): void {
    const filters = this.filterForm.value;
    try {
      this.taskService.getTasks({ ...filters, page, limit: this.pageSize });
    } catch (e) {
      console.error("❌ Error fetching tasks:", e);
    }
  }

  // onFilter(): void {
  //   this.fetchTasks(); // Fetch tasks based on filters
  // }

  // onPageChange(event: any): void {
  //   this.fetchTasks(event.page);
  // }

  @Input() showSelectionColumn = true;
  @Input() enableSingleSelect = false;
  @Input() striped = true;
  @Input() isDataGrid = false;
  @Input() noData = false;
  @Input() stickyHeader = false;
  @Input() skeleton = false;

  model = new TableModel();
  displayedCountries = ["US", "France", "Argentina", "Japan"];
  searchValue = "";

  dataset = [
    [
      new TableItem({ data: "800" }),
      new TableItem({ data: "East Sadye" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "US" }),
    ],
    [
      new TableItem({ data: "500" }),
      new TableItem({ data: "Lueilwitzview" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "US" }),
    ],
    [
      new TableItem({ data: "120" }),
      new TableItem({ data: "East Arcelyside" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "France" }),
    ],
    [
      new TableItem({ data: "119" }),
      new TableItem({ data: "West Dylan" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "Argentina" }),
    ],
    [
      new TableItem({ data: "54" }),
      new TableItem({ data: "Brandynberg" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "Japan" }),
    ],
    [
      new TableItem({ data: "15" }),
      new TableItem({ data: "Stoltenbergport" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "Canada" }),
    ],
    [
      new TableItem({ data: "12" }),
      new TableItem({ data: "Rheabury" }),
      new TableItem({ data: "Store" }),
      new TableItem({ data: "US" }),
    ],
  ];

  filterNodeNames(searchString: string) {
    this.searchValue = searchString;
  }

  overflowOnClick = (event: any) => {
    event.stopPropagation();
  };

  init() {
    this.model.header = [
      new TableHeaderItem({
        data: "Title",
      }),
      new TableHeaderItem({
        data: "Description",
      }),
      new TableHeaderItem({
        data: "Priority",
      }),
      new TableHeaderItem({
        data: "Status",
      }),
      new TableHeaderItem({
        data: "Due Date",
      }),
      new TableHeaderItem({
        data: "Author",
      }),
      new TableHeaderItem({
        data: "Actions",
      }),
    ];

    this.model.data = this.dataset;

    this.model.isRowFiltered = (index: number) => {
      const nodeName = this.model.row(index)[1].data;
      const countryName = this.model.row(index)[3].data;
      return (
        !nodeName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        !this.displayedCountries.includes(countryName)
      );
    };
  }
}
