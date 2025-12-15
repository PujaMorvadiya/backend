import { initializeApp } from './app';
import { logger } from './common/util/logger';
import AuthRoute from './modules/auth/routes/auth.route';
import AvailabilityRoute from './modules/availability/routes/availability.route';
import FeatureRoute from './modules/feature/routes/feature.route';
import PermissionRoute from './modules/permission/routes/permission.route';
import RoleRoute from './modules/role/routes/role.route';
import RolePermissionRoute from './modules/rolepermission/routes/rolePermission.route';
import UserRoute from './modules/user/routes/user.routes';
import db from './sequelizeDir/models';

const routes = [new FeatureRoute(), new RoleRoute(), new PermissionRoute(), new RolePermissionRoute(), new AuthRoute(), new UserRoute(), new AvailabilityRoute()];

const connectWithRetry = async () => {
  try {
    await db.authenticate();
    logger.log('info', 'Connection has been established successfully.');
  } catch (error) {
    logger.error('error', 'Unable to connect to the database:', error);
    setTimeout(connectWithRetry, 5000);
  }
};

const main = async () => {
  try {
    await connectWithRetry();
    const apiRoutes = routes;
    await initializeApp(apiRoutes);
  } catch (err) {
    logger.error('[SERVER START]: %s', err);
    process.exit(1);
  }
};

main();
