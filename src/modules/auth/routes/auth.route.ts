import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';
import { Routes } from '@/common/interface/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import AuthController from '../controller/auth.controller';
import { LoginSchema, RegisterSchema } from '../validationSchema/auth.validation';

export default class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      fileUpload(1),
      validationMiddleware(RegisterSchema, 'body'),
      this.authController.registerUser
    );

    this.router.get(
      `${this.path}/login`,
      authMiddleware,
      checkRoleMiddleware(FeaturesEnum.AuditLog, PermissionEnum.Create),
      validationMiddleware(LoginSchema, 'body'),
      this.authController.login
    );

    this.router.get('/get-logged-in-user', authMiddleware, this.authController.getLoggedInUser);
  }
}
