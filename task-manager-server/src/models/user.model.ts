import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ timestamps: true })
class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({
    type: DataType.ENUM("user", "admin"), // ✅ Restrict role to these values
    allowNull: false,
    defaultValue: "user",
  })
  role!: string;
}

export default User;
