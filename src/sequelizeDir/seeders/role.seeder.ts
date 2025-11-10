import { RoleEnum } from '@/common/constants/enum.constant';
import { logger } from '@/common/util/logger';
import RoleRepository from '@/modules/role/repository/role.repository';

const addRoles = async () => {
  try {
    const roleRepo = new RoleRepository();
    const existingRoles = await roleRepo.getAll({ attributes: ['role'] });
    const existingRolesNames = new Set(existingRoles.map((roleData) => roleData.role));
    const newRoles = Object.keys(RoleEnum)
      .filter((rolesKey) => !existingRolesNames.has(rolesKey))
      .map((roleKey) => ({ role: RoleEnum[roleKey] }));
    if (newRoles.length > 0) {
      await roleRepo.bulkCreate(newRoles, {
        ignoreDuplicates: true,
      });
      logger.info('Roles inserted successfully.');
    } else {
      logger.info('No new roles to insert.');
    }
    process.exit(0);
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
    process.exit(1);
  }
};

addRoles();
