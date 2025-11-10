import Feature from '@sequelizeDir/models/feature.model';
import Permission from '@sequelizeDir/models/permission.model';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
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
import Role from './role.model';
import { RolePermissionsAttributesType } from './types/rolePermission.model.type';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'role_permissions',
  indexes: [],
})
export default class RolePermission extends Model<RolePermissionsAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @Column(DataTypes.INTEGER)
  role_id: number;

  @Column(DataTypes.INTEGER)
  feature_id: number;

  @Column(DataTypes.INTEGER)
  permission_id: number;

  @BelongsTo(() => Role, { foreignKey: 'role_id', constraints: false, as: 'role' })
  role: Role;

  @BelongsTo(() => Permission, { foreignKey: 'permission_id', constraints: false, as: 'permission' })
  permission: Permission;

  @BelongsTo(() => Feature, { foreignKey: 'feature_id', constraints: false, as: 'feature' })
  feature: Feature;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
