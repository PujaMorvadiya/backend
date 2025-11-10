import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { Routes } from '@/common/interface/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { Router } from 'express';
import FeatureController from '../controller/feature.controller';

export default class FeatureRoute implements Routes {
  public path = '/feature';
  public router = Router();
  public featureController = new FeatureController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //=========== Get All Features =============

    this.router.get(
      `${this.path}/get-all`,
      [authMiddleware, checkRoleMiddleware(FeaturesEnum.Feature, PermissionEnum.View)],
      this.featureController.getAllFeatures
    );
  }
}
