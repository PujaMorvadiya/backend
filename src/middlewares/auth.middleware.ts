import { generalResponse } from '@/common/helper/response/generalResponse';
import { HttpException } from '@/common/helper/response/httpException';
import { catchAsync, parse } from '@/common/util';
import UserRepo from '@/modules/user/repository/user.repository';
import Role from '@/sequelizeDir/models/role.model';
import User from '@/sequelizeDir/models/user.model';
import UserRoles from '@/sequelizeDir/models/userRole.model';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import passport from './passport';

const authMiddleware = catchAsync((req: Request, res: Response, next: NextFunction) => {
  try {
    if (_.isUndefined(req.headers['authorization'])) {
      throw new HttpException(401, 'INVALID_TOKEN', true);
    }
    passport.authenticate('jwt', { session: false }, async (err: Error, user: User | false) => {
      try {
        if (err) {
          return generalResponse(res, err.message || 'Authentication failed', 'INVALID_TOKEN', 'error', true, 401);
        }
        if (!user) {
          return generalResponse(res, 'Invalid token', 'INVALID_TOKEN', 'error', true, 401);
        }
        await setUserData(req, user, next);
        return next();
      } catch (error) {
        return generalResponse(res, error.message ? error?.message : error, 'UNAUTHORIZED_ERROR', 'error', true, 401);
      }
    })(req, res, next);
  } catch (error) {
    return generalResponse(res, 'Authentication failed', 'INVALID_TOKEN', 'error', true, 401);
  }
});

const setUserData = async (req: Request, user: User, _next: NextFunction) => {
  try {
    const userRepo = new UserRepo();
    const userData = parse(
      await userRepo.get({
        include: [
          {
            model: UserRoles,
            attributes: ['role_id'],
            include: [{ model: Role }],
          },
        ],
        where: { id: user.id },
      })
    );

    if (!user.is_active) {
      throw new HttpException(400, 'LOGIN_RESTRICTED');
    }

    req.user = userData
  } catch (error) {
    throw new HttpException(401, 'UNAUTHORIZED_ERROR');
  }
};

export default authMiddleware;
