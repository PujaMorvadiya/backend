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
import Role from './role.model';
import { RequiredUserRoleTypeAttributesType, UserRoleType } from './types/userRole.model.type';
import User from './user.model';

@Table({
  timestamps: false,
  paranoid: false,
  tableName: 'users_roles',
})
export default class UserRoles extends Model<UserRoleType, RequiredUserRoleTypeAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataTypes.UUID,
  })
  role_id: string;

  @ForeignKey(() => User)
  @Column({ type: DataTypes.UUID })
  user_id: string;

  @BelongsTo(() => Role, {
    foreignKey: 'role_id',
    constraints: false,
    as: 'role',
  })
  role: Role;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @DeletedAt
  deleted_at: Date;

  @BelongsTo(() => User, { foreignKey: 'user_id', as: 'userDetails' })
  public userDetails?: User;
}
