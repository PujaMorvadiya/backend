import { FeaturesEnum, PermissionEnum } from "@/common/constants/enum.constant";
import { Routes } from "@/common/interface/general/routes.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import checkRoleMiddleware from "@/middlewares/checkRole.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Router } from "express";
import AvailabilityController from "../controller/availability.controller";
import { BulkAvailabilitySchema, getAvailabilitySchema } from "../validation/availability.validation";

export default class AvailabilityRoute implements Routes {
    public path = '/availabilities';
    public router = Router();
    public availabilityController = new AvailabilityController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        //=========== Create Availability =============
        this.router
            .route(`${this.path}`)
            //     .post(
            //         authMiddleware,
            //         validationMiddleware(createTeacherAvailSchema, 'body'),
            //         checkRoleMiddleware(FeaturesEnum.Teacher, PermissionEnum.Create),
            //         this.availabilityController.createAvailability
            //     )
            //     //=========== Update Availability =============
            //     .put(
            //         authMiddleware,
            //         checkRoleMiddleware(FeaturesEnum.Teacher, PermissionEnum.Update),
            //         validationMiddleware(updateTeacherAvailSchema, 'body'),
            //         this.availabilityController.updateAvailability
            //     )
            //     //=========== Get Availability =============
            .get(
                authMiddleware,
                validationMiddleware(getAvailabilitySchema, 'query'),
                checkRoleMiddleware(FeaturesEnum.Admin, PermissionEnum.View),
                this.availabilityController.getAllAvailabilities
            );

        // this.router
        //     .route(`${this.path} + '/:id`)
        //     .delete(
        //         authMiddleware,
        //         validationMiddleware(paramsIdSchema, 'params'),
        //         checkRoleMiddleware(FeaturesEnum.Teacher, PermissionEnum.Delete),
        //         this.availabilityController.deleteAvailability
        //      );

        //=========== Bulk User Create =============

        this.router
            .route(`${this.path}/bulkInsert`)
            .post(
                authMiddleware,
                validationMiddleware(BulkAvailabilitySchema, 'body'),
                checkRoleMiddleware(FeaturesEnum.Admin, PermissionEnum.Create),
                this.availabilityController.bulkCreateAvailability
            );

        // this.router
        //     .route(`${this.path}/dayAvailability`)
        //     .get(
        //         authMiddleware,
        //         validationMiddleware(getDayAvailabilitySchema, 'body'),
        //         checkRoleMiddleware(FeaturesEnum.Teacher, PermissionEnum.View),
        //         this.availabilityController.getDayAvailability
        //     );
    }
}