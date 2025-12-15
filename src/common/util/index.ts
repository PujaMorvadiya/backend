import { JWT_SECRET } from '@/config';
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';
import { Transaction } from 'sequelize';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
import { timeZonesData } from '../constants/timezone.constant';

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    return next(err);
  });
};

export const parse = (el: any) => JSON.parse(JSON.stringify(el));

export const isNumeric = (n: any) => {
  // eslint-disable-next-line no-restricted-globals
  return n && !isNaN(parseFloat(n)) && isFinite(n);
};

export const cleanObj = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key: string) => {
    try {
      if (obj[key] === '') {
        obj[key] = null;
      }
      // if (!isNumeric(obj[key])) {
      //   obj[key] = JSON.parse(obj[key]);
      // }
      if (typeof obj[key] === "string" && obj[key].startsWith("{")) {
        obj[key] = JSON.parse(obj[key]);
      }
    } catch (err) {
      console.error('cleanObj error : ', err);
    }
  });
  return obj;
};

export async function verifyJwtToken(token: string) {
  const data = jwt.verify(token, JWT_SECRET);
  return data;
}

export const generateSlugifyForModel = async (
  data: string,
  model: any,
  field?: string,
  lower?: boolean,
  transaction?: Transaction,
  preparedSlugs?: string[]
): Promise<string> => {
  let slugifyData = slugify(data, { lower });

  let isExist;
  do {
    const where = field ? { [field]: slugifyData } : { slug: slugifyData };
    isExist = await model.findOne({ where, attributes: ['id'], ...(transaction ? { transaction } : {}) });
    if (!isEmpty(isExist) || (preparedSlugs && preparedSlugs.includes(slugifyData))) {
      const postfix = uuidv4().slice(0, Math.floor(Math.random() * 6)) + 1;
      slugifyData = `${data}_0${postfix}`;
    }
  } while (!isEmpty(isExist) || (preparedSlugs && preparedSlugs.includes(slugifyData)));

  if (preparedSlugs) {
    preparedSlugs.push(slugifyData);
  }
  return slugifyData;
};

export const parseData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('parseData Error', e);
    return data;
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const getTimezones = () => {
  return timeZonesData.map((tz) => {
    return { label: tz, value: tz };
  });
};