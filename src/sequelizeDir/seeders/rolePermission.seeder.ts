import { logger } from '@/common/util/logger';
import _ from 'lodash';
import db from '../models';
import Feature from '../models/feature.model';
import Permission from '../models/permission.model';
import Role from '../models/role.model';
import RolePermission from '../models/rolePermission.model';
import { rolePermissionData } from '@/common/constants/seeder.constant';

const addPermissions = async () => {
  try {
    await db.authenticate();
    const featureMap = new Map();
    const permissionMap = new Map();
    const roleMap = new Map();
    const allPermissionData = [];

    for (const rolePermission of rolePermissionData) {
      if (!featureMap.has(rolePermission.featureName)) {
        const feature = await Feature.findOne({ attributes: ['id'], where: { name: rolePermission.featureName } });
        featureMap.set(rolePermission.featureName, feature.id);
      }

      if (!roleMap.has(rolePermission.role)) {
        const role = await Role.findOne({ attributes: ['id'], where: { role: rolePermission.role } });
        roleMap.set(rolePermission.role, role.id);
      }

      for (const singlePermission of rolePermission.permission) {
        if (!permissionMap.has(singlePermission)) {
          const permission = await Permission.findOne({
            attributes: ['id'],
            where: { name: singlePermission },
          });
          permissionMap.set(singlePermission, permission.id);
        }
      }

      for (const singlePermission of rolePermission.permission) {
        allPermissionData.push({
          role_id: roleMap.get(rolePermission.role),
          feature_id: featureMap.get(rolePermission.featureName),
          permission_id: permissionMap.get(singlePermission),
        });
      }
    }

    let allExistingPermission = await RolePermission.findAll({
      attributes: ['role_id', 'permission_id', 'feature_id'],
    });

    allExistingPermission = allPermissionData.filter(
      (allData) =>
        !allExistingPermission.find(
          (dbData) =>
            dbData.role_id == allData.role_id &&
            dbData.feature_id == allData.feature_id &&
            dbData.permission_id == allData.permission_id
        )
    );

    if (allExistingPermission?.length > 0) {
      for (const createData of allExistingPermission) {
        const foundedData = await RolePermission.findOne({ where: { ...createData } });
        if (_.isNull(foundedData )) {
          await RolePermission.create(createData);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
    process.exit(1);
  }
};

addPermissions();
