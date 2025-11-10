import dotenv, { config } from 'dotenv';
dotenv.config();
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  DATABASE_URL,
  PORT,
  ENABLE_LOG,
  SECRET_KEY,
  FRONT_URL,
  SERVER_URL,
  LOG_FORMAT,
  LOG_DIR,
  JWT_SECRET,
} = process.env;
