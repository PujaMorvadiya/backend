import { joiCommon } from "@/common/validations";
import Joi from "joi";

export const BulkAvailabilitySchema = Joi.object().keys({
    time_ranges: Joi.array().items(
        Joi.object().keys({
            start_time: joiCommon.joiString.required(),
            end_time: joiCommon.joiString.required(),
            timezone: joiCommon.joiString.required(),
            availability_type: joiCommon.joiString.required(),
        })
    ),
    userId: joiCommon.joiString.required(),
    startDate: joiCommon.joiString.required(),
    endDate: joiCommon.joiString.required(),
    week_days: joiCommon.joiArray.optional(),
});