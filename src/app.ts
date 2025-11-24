import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import * as http from 'http';
import passport from 'passport';
import { Transaction } from 'sequelize';
import { Routes } from './common/interface/general/routes.interface';
import { logger } from './common/util/logger';
import { NODE_ENV, PORT } from './config';
import { errorMiddleware } from './middlewares/error.middleware';
import './middlewares/passport';
import db from './sequelizeDir/models';

const app: Application = express();
const env: string = NODE_ENV || 'development';
const port: string | number = PORT || 8000;

function initializeMiddleWares() {
  app.use(express.json());
  app.use(cors({ credentials: true, origin: true }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use((req, res, next) => {
    global.currentRequest = req;
    global.currentResponse = res;
    next();
  });

  app.use(async (req, res, next) => {
    const method = req.method.toLowerCase();
    if (method !== 'get') {
      const t: Transaction = await db.transaction();
      req.transaction = t;
    }
    next();
  });
}
function initializeRoutes(routes: Routes[]) {
  routes.forEach((route) => {
    app.use('/api/v1', route.router);
  });
}

function initializeErrorHandling() {
  app.use(errorMiddleware);
}

function handle404() {
  app.use((req, res) => {
    if (req.transaction) {
      req.transaction.rollback();
    }

    res.status(500).send('Something went wrong');
  });
}
export const initializeApp = async (apiRoutes: Routes[]) => {
  initializeMiddleWares();
  initializeRoutes(apiRoutes);
  initializeErrorHandling();
  handle404();
  const server = http.createServer(app);
  server.listen(port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} ========`);
    logger.info(`=================================`);
  });
};
