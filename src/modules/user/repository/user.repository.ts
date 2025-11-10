import BaseRepository from '@/modules/common/base.repository';
import { UserAttributesType } from '@/sequelizeDir/models/types/user.model.type';
import User from '@/sequelizeDir/models/user.model';
import UserRoles from '@/sequelizeDir/models/userRole.model';
import { NonNullFindOptions, Transaction } from 'sequelize';

export default class UserRepo extends BaseRepository<User> {

  constructor() {
    super(User.name);
  }

  public async getUserByEmail(email: string, options?: NonNullFindOptions<UserAttributesType>) {
    return await this.DBModel.findOne({ ...options, where: { email } });
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
}
