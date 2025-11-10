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
import { FeatureAttributesType, RequiredFeatureAttributesType } from './types/feature.model.type';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'features',
})
export default class Features extends Model<FeatureAttributesType, RequiredFeatureAttributesType> {
  @PrimaryKey
  @AllowNull(false)
  @Unique(true)
  @Default(DataType.UUIDV4)
  @Column(DataTypes.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataTypes.STRING)
  name: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
