import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AccessLog } from './access.log.model';
import { Login } from './login.model';
import { Membership } from './membership.model';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  last_name: string;

  @HasMany(() => Login)
  logins: Login[];

  @HasMany(() => AccessLog)
  accessLogs: AccessLog[];

  @HasMany(() => Membership)
  memberships: Membership[];
}
