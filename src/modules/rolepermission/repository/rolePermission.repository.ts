import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import BaseRepository from '@/modules/common/base.repository';
import Feature from '@/sequelizeDir/models/feature.model';
import Permission from '@/sequelizeDir/models/permission.model';
import RolePermission from '@/sequelizeDir/models/rolePermission.model';
export default class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor() {
    super(RolePermission.name);
  }

  readonly validateRolePermission = async (roleId: string, featureName: FeaturesEnum, permissionName: PermissionEnum) => {
    const response = await this.get({
      include: [
        { model: Feature, where: { name: featureName } },
        { model: Permission, where: { name: permissionName } },
      ],
      where: { role_id: roleId },
    });
    if (response) {
      return true;
    } else {
      return false;
    }
  };

  readonly getRolePermissions = async (roleId: string) => {
    const response = await this.getAll({ where: { role_id: roleId } });
    return response;
  };
}
