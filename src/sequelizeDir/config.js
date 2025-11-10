'use strict';

const dotEnv = require('dotenv');

dotEnv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  pool: {
    max: process?.env?.SEQUELIZE_POLLER ? Number(process.env.SEQUELIZE_POLLER) : 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  logger: false,
};
