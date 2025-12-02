import { RequestHandler } from 'express';
import { generalResponse } from '../common/helper/response/generalResponse';
import { cleanObj } from '../common/util';

type ErrorType = {
  message: string;
  path: Object;
  type: string;
  context: any;
};

const errorFilterValidator = (error: Array<ErrorType>) => {
  const extractedErrors: Array<string> = [];
  error.forEach((err: ErrorType) => extractedErrors.push(err.message));
  const errorResponse = extractedErrors.join(', ');
  return errorResponse;
};

const validationMiddleware = (type: any, value: 'body' | 'query' | 'params' | string = 'body'): RequestHandler => {
  return async (req, res, next) => {
    try {
      cleanObj(req[value]);
      const validated = await type.validateAsync(req[value]);
      if (value !== 'query') {
        req[value] = validated;
      }
      return next();
    } catch (e) {
      const error: any = e;
      if (error.details) {
        const errorResponse = errorFilterValidator(error.details);
        return generalResponse(res, errorResponse, 'Something went wrong!', 'error', true, 422);
      }
      return generalResponse(res, null, 'Something went wrong!', 'success', true, 400);
    }
  };
};

export default validationMiddleware;

export const errorMessage = {
  'string.base': '{#label} should be a type of text',
  'string.min': '{#label} should have a minimum length of {#limit}',
  'string.empty': '{#label} is not allowed to be empty',
  'string.max': '{#label} should be maximum {#limit} characters..',
  'string.pattern.base': 'Please enter valid {#label}',
  'any.required': '{#label} is a required field',
};
