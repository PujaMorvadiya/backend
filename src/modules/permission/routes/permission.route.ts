import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { Routes } from '@/common/interface/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import PermissionController from '@modules/permission/controller/permission.controller';
import { Router } from 'express';

export default class PermissionRoute implements Routes {
  public path = '/permission';
  public router = Router();
  public permissionController = new PermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //=========== Get All Features =============
    this.router.get(
      `${this.path}/get-all`,
      authMiddleware,
      checkRoleMiddleware(FeaturesEnum.Permission, PermissionEnum.View),
      this.permissionController.getAllPermissions
    );
  }
}
