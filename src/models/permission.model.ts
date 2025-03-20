import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Feature } from './feature.model';
import { Membership } from './membership.model';

@Table({
  tableName: 'permissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Permission extends Model<Permission> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Feature)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  feature_id: number;

  @ForeignKey(() => Membership)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  membership_id: number;

  @Column({
    type: DataType.ENUM('C', 'T1', 'T2', 'T3'),
    allowNull: true,
  })
  level: 'C' | 'T1' | 'T2' | 'T3';

  @BelongsTo(() => Feature)
  feature: Feature;

  @BelongsTo(() => Membership)
  membership: Membership;
}
