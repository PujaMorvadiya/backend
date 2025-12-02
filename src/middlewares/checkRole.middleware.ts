import { FeaturesEnum, PermissionEnum, RoleEnum } from '@/common/constants/enum.constant';
import { HttpException } from '@/common/helper/response/httpException';
import { catchAsync, parse } from '@/common/util';
import RolePermissionRepository from '@/modules/rolepermission/repository/rolePermission.repository';
import { Request, RequestHandler } from 'express';
import _ from 'lodash';

const checkRoleMiddleware = (feature: FeaturesEnum, permission: PermissionEnum): RequestHandler => {
  return catchAsync(async (req, res, next) => {
    const rolePermissionRepo = new RolePermissionRepository();
    const result = await rolePermissionRepo.validateRolePermission(req.user?.user_role?.role_id, feature, permission);

    if (result) {
      next();
    } else {
      throw new HttpException(403, 'MODULE_ACCESS_DENIED');
    }
  });
};

export const checkRoleMiddlewareData = async (req, feature: FeaturesEnum, permission: PermissionEnum) => {
  const rolePermissionRepo = new RolePermissionRepository();
  const result = await rolePermissionRepo.validateRolePermission(req.user?.user_role?.role_id, feature, permission);
  if (result) return true;
  else return false;
};

export const checkIfItsRole = (req: Request) => {
  const condition1 = ['POST', 'PUT', 'PATCH', 'DELETE', 'GET'].includes(req.method.toUpperCase());
  const condition2 = !_.isUndefined(req?.query?.allUserAccess) && parse(req?.user)?.role_name === RoleEnum.Admin;
  return condition1 || condition2;
};

export default checkRoleMiddleware;
