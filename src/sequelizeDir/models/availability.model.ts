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
import User from './user.model';
import { AvailabilitiesAttributesType, RequiredAvailabilitiesAttributesType } from './types/availability.model.type';

@Table({
    timestamps: true,
    paranoid: true,
    tableName: 'availabilities',
})
export default class Availabilities extends Model<
    AvailabilitiesAttributesType,
    RequiredAvailabilitiesAttributesType
> {
    @PrimaryKey
    @AllowNull(false)
    @Unique(true)
    @Default(DataType.UUIDV4)
    @Column(DataTypes.UUID)
    id: string;

    @Column(DataTypes.UUID)
    user_id: string;

    @Column({
        type: DataTypes.DATE,
    })
    date: string;

    @Column(DataTypes.DATE)
    start_time: string;

    @Column(DataTypes.DATE)
    end_time: string;

    @Column(DataTypes.STRING)
    timezone: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    @DeletedAt
    deleted_at: Date;

    @Column({
        allowNull: true,
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
    })
    created_by: string;

    @Column({
        allowNull: true,
        type: DataTypes.UUID,
        references: { model: 'users', key: 'id' },
    })
    updated_by: string;

    @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
    user: User;
}
