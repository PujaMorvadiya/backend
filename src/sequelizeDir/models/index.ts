import { logger } from '@/common/util/logger';
import { Sequelize } from 'sequelize-typescript';
import { DATABASE_URL, ENABLE_LOG, NODE_ENV } from '../../config';
import AuditLogs from './auditLog.model';
import Features from './feature.model';
import Permission from './permission.model';
import Role from './role.model';
import RolePermission from './rolePermission.model';
import User from './user.model';
import UserRoles from './userRole.model';

let db: Sequelize;

export const initSequelize = () => {
  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: +ENABLE_LOG === 1 && logger.info.bind(null, '\n%s'),
    dialectOptions: { application_name: `Universal - ${NODE_ENV}` },
  });
  sequelize.addModels([User, UserRoles, Role, Permission, RolePermission, Features, AuditLogs]);

  return sequelize;
};

if (!db) {
  db = initSequelize();
}

export default db;
