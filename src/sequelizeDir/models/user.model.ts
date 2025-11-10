import { DataTypes } from 'sequelize';
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import AuditLogs from './auditLog.model';
import { RequiredUserAttributesType, UserAttributesType } from './types/user.model.type';
import UserRoles from './userRole.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
})
export default class User extends Model<UserAttributesType, RequiredUserAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @AllowNull(false)
  @Unique(true)
  @Column(DataTypes.STRING)
  email: string;

  @Column({ type: DataTypes.DATE, allowNull: true })
  date_of_birth: Date;

  @Column({ type: DataTypes.STRING, allowNull: true })
  first_name: string;

  @Column({ type: DataTypes.STRING, allowNull: true })
  last_name: string;

  @Column(DataTypes.VIRTUAL)
  get full_name() {
    return `${this.getDataValue('first_name') || ''} ${this.getDataValue('last_name') || ''}`.trim();
  }

  @Column({ type: DataTypes.STRING, allowNull: true })
  profile_image: string;

  @AllowNull(true)
  @Column(DataTypes.STRING)
  password: string;

  @Column({ type: DataTypes.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @Column({ type: DataTypes.STRING, allowNull: true })
  phone_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  last_logged_in: Date;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @HasOne(() => UserRoles, {
    foreignKey: 'user_id',
    as: 'user_role',
  })
  user_role: UserRoles;

  // get user role in role key
  @Column(DataTypes.VIRTUAL)
  get role() {
    // pull out the joined user_role object
    const userRole = this.getDataValue('user_role');

    // if it exists and has the nested Role model, extract its 'role' string
    const roleString = userRole?.role?.role;

    // return exactly the shape you want, or null if absent
    return roleString ? { role: roleString } : null;
  }

  @HasOne(() => AuditLogs, {
    foreignKey: 'user_id',
    constraints: false,
    as: 'auditLog',
  })
  auditLogs: AuditLogs;
}
