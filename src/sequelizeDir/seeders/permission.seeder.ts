import { PermissionEnum } from '@/common/constants/enum.constant';
import { logger } from '@/common/util/logger';
import PermissionRepository from '@/modules/permission/repository/permission.repository';

const addPermission = async () => {
  try {
    const permissionRepo = new PermissionRepository();
    const existingPermissions = await permissionRepo.getAll({ attributes: ['name'] });
    const existingPermissionNames = new Set(existingPermissions.map((permission) => permission.name));
    const newPermissions = Object.keys(PermissionEnum)
      .filter((permissionKey) => !existingPermissionNames.has(permissionKey))
      .map((permissionKey) => ({ name: PermissionEnum[permissionKey] }));
    if (newPermissions.length > 0) {
      await permissionRepo.bulkCreate(newPermissions, {
        ignoreDuplicates: true,
      });
      logger.info('Permission inserted successfully.');
    } else {
      logger.info('No new permission to insert.');
    }
    process.exit(0);
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
    process.exit(1);
  }
};

addPermission();
