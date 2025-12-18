import { generalResponse } from "@/common/helper/response/generalResponse";
import { catchAsync } from "@/common/util";
import { Request, Response } from 'express';
import AvailabilityService from "../service/availability.service";
import db from "@/sequelizeDir/models";
import { handleCrossMidnight } from "../helper";

export default class AvailabilityController {
    private readonly availabilityService = new AvailabilityService();

    public bulkCreateAvailability = catchAsync(async (req: Request, res: Response) => {
        const result = await this.availabilityService.bulkCreateAvailability(req, req.body);
        return generalResponse(res, result, 'CREATE_AVAILABILITY', 'success', true);
    });

    public getAllAvailabilities = catchAsync(async (req: Request, res: Response) => {
        req.transaction = await db.transaction();
        const responseData = await this.availabilityService.handleAllAvailabilityData(req);
        const result = [];
        for (const item of responseData.data) {
            const adjustSlots = handleCrossMidnight({}, item, req.timezone, false);
            for (const slot of adjustSlots) {
                const flatSlot = slot.dataValues ? slot.dataValues : slot;
                result.push({
                    date: flatSlot.date,
                    start_time: flatSlot.start_time,
                    end_time: flatSlot.end_time,
                    availability_type: flatSlot.availability_type,
                    user_id: flatSlot.user_id,
                    id: flatSlot.id,
                    user: flatSlot.user,
                });
            }
        }
        return generalResponse(res, { data: result }, 'GET_AVAILABILITIES', 'success', false);
    });
}
