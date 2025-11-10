import { PermissionEnum } from '@/common/constants/enum.constant';
import { DataTypes } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';
import Feature from './feature.model';
import { AuditLogsAttributesType, RequiredAuditLogsAttributesType } from './types/auditLog.model.type';
import User from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'audit_logs',
})
export default class AuditLogs extends Model<AuditLogsAttributesType, RequiredAuditLogsAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataTypes.UUID)
  user_id: string;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  title: string;

  @Column({
    allowNull: true,
    type: DataTypes.STRING,
  })
  slug: string;

  @Column({
    allowNull: true,
    type: DataTypes.TEXT('long'),
  })
  description: string;

  @Column({
    defaultValue: PermissionEnum.View,
    type: DataTypes.ENUM(...Object.values(PermissionEnum)),
  })
  permission_type: PermissionEnum;

  @ForeignKey(() => Feature)
  @Column(DataTypes.UUID)
  feature_id: string;

  @Column(DataTypes.JSONB)
  detail: object;

  @BelongsTo(() => Feature, {
    foreignKey: 'feature_id',
    constraints: false,
    as: 'feature',
  })
  feature: Feature;

  @BelongsTo(() => User, {
    foreignKey: 'user_id',
    constraints: false,
    as: 'user',
  })
  user: User;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;
}
