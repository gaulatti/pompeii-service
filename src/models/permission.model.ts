import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
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

export enum PermissionLevel {
  C = 'C',
  T1 = 'T1',
  T2 = 'T2',
  T3 = 'T3',
}

@Table({
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
})
export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: CreationOptional<number>;

  @ForeignKey(() => Feature)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  feature_id!: number;

  @ForeignKey(() => Membership)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  membership_id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(PermissionLevel)),
    allowNull: true,
  })
  level?: PermissionLevel;

  @BelongsTo(() => Feature)
  feature?: Feature;

  @BelongsTo(() => Membership)
  membership?: Membership;
}
