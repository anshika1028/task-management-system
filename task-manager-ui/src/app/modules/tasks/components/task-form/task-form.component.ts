import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from "angularx-flatpickr";
import {
  ButtonModule,
  InputModule,
  LinkModule,
  ModalModule,
  RadioModule,
  SelectModule,
} from "carbon-components-angular";
import { COMMON_LABELS, ERROR_LABELS } from "../../../../constants/labels";
import { Task } from "../../../../models/task.model";
import { TaskService } from "../../../../services/task.service";
import { MetaStore } from "../../../../stores/meta.store";
import { UserStore } from "../../../../stores/user.store";
@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputModule,
    ButtonModule,
    LinkModule,
    SelectModule,
    ModalModule,
    FlatpickrDirective,
    RadioModule,
  ],
  providers: [provideFlatpickrDefaults()],
})
export class TaskFormComponent implements OnInit {
  private metaStore = inject(MetaStore);

  private userStore = inject(UserStore);
  @Output() closeModalClick = new EventEmitter<void>();
  @Input() task: Task = {
    id: 0,
    title: "",
    description: "",
    priority: "",
    due_date: "",
    completed: false,
  };
  taskCreateForm!: FormGroup;
  loading = false;
  submitted = false;
  error = "";
  successMsg = "";
  errorLabels = ERROR_LABELS;
  priorities;
  disabledConfig;
  commonLabels = COMMON_LABELS;

  constructor(
    private formBuilder: FormBuilder,
    private taskservice: TaskService
  ) {
    this.disabledConfig = {
      dateFormat: "Y-m-d",
      disable: [
        ...this.metaStore.publicHolidays.map((holiday) => holiday.date),
        function (date) {
          // return true to disable
          return date && (date.getDay() === 0 || date.getDay() === 6);
        },
      ],
      minDate: "today",
    };

    this.priorities = this.metaStore.priorities;
  }

  ngOnInit() {
    this.taskCreateForm = this.formBuilder.group({
      title: [
        this.task.title,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.task.description,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200),
        ],
      ],
      priority: [this.task.priority, [Validators.required]],
      due_date: [this.task.due_date, [Validators.required]],
      completed: [this.task.completed, [Validators.required]],
    });
  }

  // ✅ Convenience getter for easy access to form fields
  get f() {
    return this.taskCreateForm.controls;
  }
  closeModal() {
    this.closeModalClick.emit();
  }

  resetForm() {
    this.taskCreateForm.reset(this.task);
  }

  getErrors(field: string): string {
    const errors = this.f[field]?.errors;
    return errors ? this.errorLabels[Object.keys(errors)[0]] : "";
  }

  async onSubmit() {
    this.submitted = true;
    if (this.taskCreateForm.invalid) {
      return;
    }

    this.loading = true;
    try {
      if (this.task.id !== 0) {
        await this.taskservice.updateTask(this.task.id, {
          ...this.taskCreateForm.value,
        });
      } else {
        await this.taskservice.createTask({ ...this.taskCreateForm.value });
      }
      this.error = "";
      this.loading = false;
      this.closeModal();
    } catch (error: any) {
      this.error = error?.message || "TASK CREATE UPDATE failFAILEDed";
      this.successMsg = "";
      this.loading = false;
    }
  }
}
