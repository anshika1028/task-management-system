export interface Task {
  id: number;
  title?: string;
  description?: string;
  priority?: string;
  due_date?: string;
  completed?: boolean;
  user_id?: number;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  showUndoButton?: boolean;
}
