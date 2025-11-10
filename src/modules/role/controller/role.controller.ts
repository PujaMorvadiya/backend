import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import RoleRepository from '@modules/role/repository/role.repository';
import { Request, Response } from 'express';

export default class RoleController {
  private readonly roleRepository = new RoleRepository();

  /**
   * Add role Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  //=========== Get All Roles =============
  public getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.roleRepository.getAll({});
    return generalResponse(res, responseData, 'GET_ALL_ROLES', 'success', false);
  });
}
