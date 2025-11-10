import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import PermissionRepository from '@modules/permission/repository/permission.repository';
import { Request, Response } from 'express';

export default class PermissionController {
  private readonly permissionRepository = new PermissionRepository();

  /**
   * Add permission Api
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>}
   */

  //=========== Get All Permissions =============
  public getAllPermissions = catchAsync(async (req: Request, res: Response) => {
    const responseData = await this.permissionRepository.getAll({});
    return generalResponse(res, responseData, 'GET_ALL_PERMISSIONS', 'success', true);
  });
}
