import * as json from '@/common/auditLogs/auditLog.json';
import { AuditLogs, FeaturesEnum, PermissionEnum, RoleEnum } from '@/common/constants/enum.constant';
import { comparePassword, generateToken, hashPassword, parse } from '@/common/util';
import { createLogMessage } from '@/config/lib/query/databaseCommon';
import UserRepo from '@/modules/user/repository/user.repository';
import Role from '@/sequelizeDir/models/role.model';
import { parseISO } from 'date-fns';
import { Request } from 'express';
import { AuthRegisterReqInterface, LoginData } from '../interface/auth.interface';
import Features from '@/sequelizeDir/models/feature.model';
import Permission from '@/sequelizeDir/models/permission.model';
import { Sequelize } from 'sequelize';
import RolePermissionRepository from '@/modules/rolepermission/repository/rolePermission.repository';
import PermissionRepository from '@/modules/permission/repository/permission.repository';
import RoleRepository from '@/modules/role/repository/role.repository';

export class AuthService {
  private readonly userRepository = new UserRepo();
  private readonly roleRepository = new RoleRepository();
  private readonly permissionRepository = new PermissionRepository();
  private readonly rolePermissionRepository = new RolePermissionRepository();

  async registerUser(req: Request, data: AuthRegisterReqInterface) {
    const { email, first_name, last_name, date_of_birth, profile_image, password } = data;
    const existing = await this.userRepository.getUserByEmail(data.email);
    if (existing) {
      throw new Error('User already exists');
    }
    const role = await Role.findOne({ where: { role: RoleEnum.User } });
    const hashed = await hashPassword(password);
    const user = await this.userRepository.addUser({
      email,
      ...(date_of_birth ? { date_of_birth: parseISO(date_of_birth) } : {}),
      first_name,
      last_name: last_name ?? '',
      password: hashed,
      profile_image,
      user_role: {
        role_id: role?.id,
      },
    });
    await createLogMessage(
      req,
      json.USER_CREATED_SUCCESS,
      FeaturesEnum.User,
      AuditLogs.REGISTER,
      {
        additionalMessageProps: {
          username: `${first_name} ${last_name}`,
        },
      },
      PermissionEnum.Create,
      {
        email,
        first_name,
        last_name: last_name ?? '',
        profile_image,
        role_id: role.id,
      }
    );
    return user;
  }

  async login(req: Request, data: LoginData) {
    const user = await this.userRepository.getUserByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    const is_active = req?.query?.status === 'login' ? AuditLogs.LOGIN : AuditLogs.LOGOUT;

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = generateToken({ id: user.id, email: user.email });
    await createLogMessage(
      req,
      json.USER_LOGIN_SUCCESS,
      FeaturesEnum.User,
      is_active,
      {
        additionalMessageProps: {
          username: `${user?.first_name} ${user?.last_name}`,
          status: is_active,
          user_id: user.id
        },

      },
      PermissionEnum.View,
      user
    );
    return { token, user: { id: user.id, email: user.email, } };
  }

  public async getLoggedInUser(req: Request) {
    const {
      tokenData: { user },
    } = req;
    const roleAndPermission = await this.rolePermissionRepository.getAll({
      include: [
        {
          model: Features,
          attributes: [],
        },
        {
          model: Permission,
          attributes: [],
        },
        {
          model: Role,
          attributes: [],
        },
      ],
      attributes: [
        'access',
        [Sequelize.col('feature.name'), 'feature_name'],
        [Sequelize.col('role.name'), 'role_name'],
        [Sequelize.col('feature.id'), 'feature_id'],
        [Sequelize.col('permission.name'), 'permission_name'],
        [Sequelize.col('permission.id'), 'permission_id'],
      ],
      where: {
        role_id: user.role_id,
      },
    });
    const role = await this.roleRepository.getAll({});

    const permission = await this.permissionRepository.getAll({});

    return {
      user,
      roleAndPermission,
      role,
      permission,
    };
  }
}
