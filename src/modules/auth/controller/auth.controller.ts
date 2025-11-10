import { generalResponse } from '@/common/helper/response/generalResponse';
import { catchAsync } from '@/common/util';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';

export default class AuthController {
  private readonly authService = new AuthService();

  public registerUser = catchAsync(async (req: Request, res: Response) => {
    const user = await this.authService.registerUser(req, req.body);
    return generalResponse(res, user, 'REGISTER_SUCCESS', 'success', true);
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const result = await this.authService.login(req, req.body);
    return generalResponse(res, result, 'LOGIN_SUCCESS', 'success', true);
  });

  public getLoggedInUser = catchAsync(async (req: Request, res: Response) => {
    const data = await this.authService.getLoggedInUser(req);
    return generalResponse(res, data, 'USER_FETCH', 'success', false);
  });
}
