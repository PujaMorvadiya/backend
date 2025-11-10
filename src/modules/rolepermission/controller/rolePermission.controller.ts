import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import { Request, Response } from 'express';
import RolePermissionRepository from '../repository/rolePermission.repository';

export default class RolePermissionController {
  private readonly rolePermissionRepository = new RolePermissionRepository();

  /**
   * Add Role Permission Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  //=========== Get All RolePermissions =============

  public getRolePermissions = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.rolePermissionRepository.getRolePermissions(req.user?.user_role?.role_id);
    return generalResponse(res, responseData, 'GET_ALL_ROLE_PERMISSION', 'success', true);
  });
}
