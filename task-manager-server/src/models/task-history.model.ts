import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Task from "./task.model";
import User from "./user.model";

@Table({
  timestamps: true,
})
class TaskHistory extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  history_id!: number;

  @ForeignKey(() => Task)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id!: number;

  @Column({ type: DataType.ENUM("low", "medium", "high"), allowNull: false })
  priority!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  due_date!: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  completed!: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  user_id!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default TaskHistory;
