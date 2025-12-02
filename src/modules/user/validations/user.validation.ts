import { paginationValidation } from "@/common/validations";
import Joi from "joi";

export const getUserSchema = Joi.object({
    ...paginationValidation,
    // status: joiCommon.joiBoolean.label('Status'),
    // role: joiCommon.joiString.label('Role'),
    // organization_id: joiCommon.joiArray.items(joiCommon.joiString.uuid()),
    // abortEarly: false,
    // isDeletedUser: joiCommon.joiBoolean,
    // user_id: joiCommon.joiString.uuid().label('User Id'),
    // roleName: joiCommon.joiString.label('user Role'),
    // unEnrolledCourse: joiCommon.joiBoolean,
    // enrolledCourse: joiCommon.joiBoolean,
    // enrolled_organization_id: joiCommon.joiString,
    // userType: joiCommon.joiString,
    // userStatus: joiCommon.joiString,
    // organizationId: joiCommon.joiString,
    // organization_user_id: joiCommon.joiString,
    // isTeacher: joiCommon.joiBoolean,
    // isAdmin: joiCommon.joiBoolean,
    // isStudent: joiCommon.joiBoolean,
    // isOrganization: joiCommon.joiBoolean,
    // orgId: joiCommon.joiString,
    // isOrganizationTeacher: joiCommon.joiBoolean.optional(),
    // isOrganizationStudent: joiCommon.joiBoolean.optional(),
    // search: joiCommon.joiString.optional(),
    // searchOn: joiCommon.joiArray.items(joiCommon.joiString).optional(),
    // subscription_id: joiCommon.joiString,
    // isUserList: joiCommon.joiBoolean.optional(),
    // course_slug: joiCommon.joiString.optional(),
}).options({
    abortEarly: false,
});