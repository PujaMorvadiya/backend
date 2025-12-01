import { generalResponse } from "@/common/helper/response/generalResponse";
import { catchAsync } from "@/common/util";
import { Request, Response } from 'express';
import UserRepo from "../repository/user.repository";

export default class UserController {
    private readonly userRepository = new UserRepo();

    /**
     * get user list Api
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise<void>}
     */
    public getUserDetails = catchAsync(async (req: Request, res: Response) => {
        const response = await this.userRepository.getAllUsersDetails(req);
        return generalResponse(res, response, 'USER_FETCH', 'success', false);
    });

}