import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({
    timestamps: true,
    indexes: [
        {
            name: 'idx_task_priority', // ✅ Single-column index for filtering by priority
            fields: ['priority'],
        },
        {
            name: 'idx_task_due_date', // ✅ Single-column index for filtering by due_date
            fields: ['due_date'],
        },
        {
            name: 'idx_task_priority_due_date', // ✅ Composite index for filtering by both
            fields: ['priority', 'due_date'],
        },
    ],
})
class Task extends Model {
    @Column({ type: DataType.ENUM('low', 'medium', 'high'), allowNull: false })
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

export default Task;
