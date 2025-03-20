import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'logins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Login extends Model<Login> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  provider: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  sub: string;

  @BelongsTo(() => User)
  user: User;
}
