import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import UserController from '../controller/user.controller';
import { getUserSchema } from '../validations/user.validation';
import { Routes } from '@/common/interface/general/routes.interface';
import { FeaturesEnum, PermissionEnum } from '@/common/constants/enum.constant';


export default class UserRoute implements Routes {
    public path = '/users';
    public router = Router();
    public userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/`,
            authMiddleware,
            validationMiddleware(getUserSchema, 'query'),
            checkRoleMiddleware(FeaturesEnum.Users, PermissionEnum.View),
            this.userController.getUserDetails
        )
    }
}
