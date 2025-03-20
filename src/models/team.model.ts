import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Application } from './application.model';
import { Membership } from './membership.model';

@Table({
  tableName: 'teams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at',
})
export class Team extends Model<Team> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @HasMany(() => Membership)
  memberships: Membership[];

  @HasMany(() => Application)
  applications: Application[];
}
