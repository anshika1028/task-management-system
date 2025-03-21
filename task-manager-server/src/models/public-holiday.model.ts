import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    timestamps: true,
    tableName: 'public_holidays',
})
class PublicHoliday extends Model {
    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    holiday_name!: string;

    @Column({ type: DataType.DATEONLY, allowNull: false, unique: true }) // ✅ `DATEONLY` ensures date-only storage
    date!: string;
}

export default PublicHoliday;
