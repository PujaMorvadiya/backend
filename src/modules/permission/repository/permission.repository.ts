import BaseRepository from '@/modules/common/base.repository';
import Permission from '@/sequelizeDir/models/permission.model';

export default class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super(Permission.name);
  }
}
