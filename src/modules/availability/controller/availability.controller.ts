import { generalResponse } from "@/common/helper/response/generalResponse";
import { catchAsync } from "@/common/util";
import { Request, Response } from 'express';
import AvailabilityService from "../service/availability.service";

export default class AvailabilityController {
    private readonly availabilityService = new AvailabilityService();

    public bulkCreateAvailability = catchAsync(async (req: Request, res: Response) => {
        const result = await this.availabilityService.bulkCreateAvailability(req, req.body);
        return generalResponse(res, result, 'CREATE_AVAILABILITY', 'success', true);
    });
}
