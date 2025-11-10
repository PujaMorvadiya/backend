import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { Routes } from '@/common/interface/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import RoleController from '@modules/role/controller/role.controller';
import { Router } from 'express';

export default class RoleRoute implements Routes {
  public path = '/role';
  public router = Router();
  public roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //=========== Get All Roles =============

    this.router.get(
      `${this.path}/get-all`,
      authMiddleware,
      checkRoleMiddleware(FeaturesEnum.Role, PermissionEnum.View),
      this.roleController.getAllRoles
    );
  }
}
