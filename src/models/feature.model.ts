import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Application } from './application.model';
import { Permission } from './permission.model';

@Table({
  tableName: 'features',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Feature extends Model<Feature> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Application)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  application_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @BelongsTo(() => Application)
  application: Application;

  @HasMany(() => Permission)
  permissions: Permission[];
}
