import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import { PermissionAttributesType, RequiredPermissionAttributesType } from './types/permission.model.type';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'permissions',
  indexes: [
    {
      fields: ['name'],
      unique: true,
      where: {
        deleted_at: null,
      },
    },
  ],
})
export default class Permission extends Model<PermissionAttributesType, RequiredPermissionAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @Unique
  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
