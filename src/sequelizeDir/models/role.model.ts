import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import RolePermission from './rolePermission.model';
import { RequiredRolesAttributesType, RolesAttributesType } from './types/role.model.type';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'roles',
})
export default class Role extends Model<RolesAttributesType, RequiredRolesAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  role: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  description: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasMany(() => RolePermission, {
    foreignKey: 'role_id',
    as: 'permissions',
  })
  permissions: RolePermission[];
}
