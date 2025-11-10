import { generalResponse } from '@/common/helper/response/generalResponse';
import { HttpException } from '@/common/helper/response/httpException';
import { catchAsync, parse } from '@/common/util';
import UserRepo from '@/modules/user/repository/user.repository';
import Role from '@/sequelizeDir/models/role.model';
import User from '@/sequelizeDir/models/user.model';
import UserRoles from '@/sequelizeDir/models/userRole.model';
import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import passport from 'passport';

// const extractToken = (req: Request): string | null => {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader) return null;
//   if (!authHeader.startsWith('Bearer ')) return null;
//   return authHeader.replace('Bearer ', '');
// };

// const authMiddleware = catchAsync(
//   async (req: Request, _res: Response, next: NextFunction) => {
//     const token = extractToken(req);

//     if (!token) {
//       throw new HttpException(401, "INVALID_TOKEN", true);
//     }

//     const decoded = await verifyJwtToken(token).catch(() => {
//       throw new HttpException(401, "INVALID_TOKEN", true);
//     });

//     const userRepo = new UserRepo();
//     const userData = parse(
//       await userRepo.get({
//         include: [
//           {
//             model: UserRoles,
//             attributes: ["role_id"],
//             include: [{ model: Role }],
//           },
//         ],
//         where: { id: decoded["userId"], is_active: true },
//       })
//     );

//     if (!userData) {
//       throw new HttpException(401, "INVALID_TOKEN", true);
//     }

//     req.user = {
//       id: userData.id,
//       email: userData.email,
//       role: userData?.user_role?.role,
//       role_name: userData?.user_role?.role?.role,
//       last_logged_in: userData.last_logged_in,
//     };

//     next();
//   }
// );

const authMiddleware = catchAsync((req: Request, res: Response, next: NextFunction) => {
  try {
    if (_.isUndefined(req.headers['authorization'])) {
      next();
    } else {
      passport.authenticate('jwt', async (err: Error, user: User) => {
        try {
          if (err) throw new HttpException(401, 'INVALID_TOKEN', true);
          if (!user) throw new HttpException(401, 'INVALID_TOKEN', true);
          else {
            await setUserData(req, user, next);
            return next();
          }
        } catch (error) {
          return generalResponse(res, error.message ? error?.message : error, 'UNAUTHORIZED_ERROR', 'error', true, 401);
        }
      })(req, res, next);
    }
  } catch (error) {
    throw new HttpException(401, 'INVALID_TOKEN', true);
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
