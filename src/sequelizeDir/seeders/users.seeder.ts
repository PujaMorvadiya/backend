import { RoleEnum } from '@/common/constants/enum.constant';
import { logger } from '@/common/util/logger';
import RoleRepository from '@/modules/role/repository/role.repository';
import db from '../models';
import User from '../models/user.model';

const addUsers = async () => {
  const transaction = await db.transaction();
  try {
    const roleRepo = new RoleRepository();
    const roles = {
      admin: await roleRepo.get({ where: { role: RoleEnum.Admin } }),
      organization: await roleRepo.get({ where: { role: RoleEnum.Organization } }),
      user: await roleRepo.get({ where: { role: RoleEnum.User } }),
    };
    const users = [
      {
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@yopmail.com',
        user_role: {
          role_id: roles.admin.id,
        },
      },
      {
        first_name: 'Organization',
        last_name: 'Organization',
        email: 'organization@yopmail.com',
        user_role: {
          role_id: roles.organization.id,
        },
      },
      {
        first_name: 'User',
        last_name: 'User',
        email: 'user@yopmail.com',
        user_role: {
          role_id: roles.user.id,
        },
      },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ where: { email: user.email } });
      if (existingUser) {
        logger.info(`User with email ${user.email} already exists.`);
        continue;
      }

      await User.create(
        {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_role: user.user_role,
        },
        {
          include: ['user_role'],
          transaction,
          role: user.user_role,
        }
      );
    }

    await transaction.commit();
    logger.info('Users Data inserted successfully');
    process.exit(0);
  } catch (error) {
    await transaction.rollback();
    logger.error('Something Went Wrong !!', error);
    process.exit(1);
  }
};
addUsers();
