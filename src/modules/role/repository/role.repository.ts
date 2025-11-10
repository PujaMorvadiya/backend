import { RoleEnum } from '@/common/constants/enum.constant';
import BaseRepository from '@/modules/common/base.repository';
import Role from '@/sequelizeDir/models/role.model';

export default class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role.name);
  }
  //=========== Get Role By Id =============

  readonly getRoleById = async (id: number) => {
    return await this.get({
      where: {
        id,
      },
    });
  };

  //=========== Get Role By Name =============

  readonly getRoleByName = async (role: RoleEnum) => {
    return await this.get({
      where: {
        role,
      },
    });
  };
}
