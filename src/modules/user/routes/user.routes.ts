import authMiddleware from '@/middlewares/auth.middleware';
import checkRoleMiddleware from '@/middlewares/checkRole.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import UserController from '../controller/user.controller';
import { getUserByIDschema, getUserSchema, updateUserSchema } from '../validations/user.validation';
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
        this.router.get(
            `${this.path}/view`,
            authMiddleware,
            checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.View),
            validationMiddleware(getUserByIDschema, 'query'),
            this.userController.getUserById
        );
        this.router.put(
            `${this.path}/:userId/update`,
            authMiddleware,
            checkRoleMiddleware(FeaturesEnum.User, PermissionEnum.Update),
            validationMiddleware(updateUserSchema, 'body'),
            this.userController.updateUser
        );
    }
}
