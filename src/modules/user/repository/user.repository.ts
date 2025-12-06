import CommonQuery from '@/lib/query/commonQuery';
import BaseRepository from '@/modules/common/base.repository';
import { UserAttributesType } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import UserRoles from '@/sequelizeDir/models/userRole.model';
import Role from '@/sequelizeDir/models/role.model';
import { NonNullFindOptions, Transaction, WhereOptions, Op, Sequelize } from 'sequelize';
import { Request } from 'express';
import { parse } from '@/common/util';

export default class UserRepo extends BaseRepository<User> {
  private readonly commonQuery = new CommonQuery(this.DBModel);
  constructor() {
    super(User.name);
  }

  public async getUserById(req: Request) {
    return await this.DBModel.findOne({ where: { id: req.query.user_id.toString() }, raw: true, });
  }

  public async addUser(user: UserAttributesType, transaction?: Transaction) {
    const newUser = await this.DBModel.create(user, { transaction, role: user.user_role });
    await UserRoles.create({
      user_id: newUser.id,
      role_id: user.user_role?.role_id,
    });
    newUser['role_id'] = user.user_role?.role_id;
    return newUser;
  }

  public async updateUser(req: Request) {
    const { userId } = req.params;
    const { first_name, last_name, email, status } = req.body;


    const updateData: Partial<UserAttributesType> = {
      first_name,
      last_name,
      email,
      is_active: status === 'inactive' ? false : true
    };
    const userData = (await this.update(updateData, { where: { id: userId } }))?.[1]?.[0];

    return userData;
  }

  public async getAllUsersDetails(req: Request) {
    const where: WhereOptions<UserAttributesType> = {};
    const pageParams = this.commonQuery.paginationSetter(req);
    const order = this.commonQuery.orderSetter(req);

    this.commonQuery.conditionSetter(req, where, 'first_name,last_name,email');

    if (req.query.isDeletedUser === 'true' || req.query.isDeletedUser === true as any) {
      where.deleted_at = { [Op.not]: null };
    } else {
      where.deleted_at = null;
    }

    const userResponse = await this.DBModel.findAndCountAll({
      where,
      include: [
        {
          model: UserRoles,
          as: 'user_role',
          include: [
            {
              model: Role,
              as: 'role',
              attributes: ['id', 'role'],
            },
          ],
        },
      ],
      order,
      distinct: true,
      ...pageParams,
    });

    const data = userResponse.rows.map((user) => parse(user));

    return this.commonQuery.dataSetter(req, { rows: data, count: userResponse.count });
  }

  public deleteUsers = async (req: Request) => {
    const transaction = await this.DBModel.sequelize.transaction();

    try {
      const userIds = String(req.query.user_id).split(',').map(id => id.trim());

      const users = await this.DBModel.findAll({
        where: { id: userIds },
        transaction
      });

      for (const user of users) {
        await user.update(
          {
            deleted_at: new Date()
          },
          { transaction }
        );

        await user.destroy({ transaction });
      }

      await transaction.commit();
      return { success: true, deleted_users: userIds };

    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error while deleting users: ${error.message}`);
    }
  };

}
