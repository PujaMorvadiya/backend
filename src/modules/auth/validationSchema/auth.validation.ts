// ============= Import Packages ================
import { errorMessage } from '@/middlewares/validation.middleware';
import Joi from 'joi';

export const RegisterSchema = Joi.object({
  first_name: Joi.string()
    .required()
    .max(50)
    .label('First Name')
    .messages({ ...errorMessage }),
  last_name: Joi.string()
    .required()
    .max(50)
    .label('Last Name')
    .messages({ ...errorMessage }),
  email: Joi.string()
    .email()
    .required()
    .max(100)
    .label('Email')
    .messages({ ...errorMessage, 'string.email': '{#label} must be a valid email' }),

  password: Joi.string()
    .min(8)
    .max(254)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}\[\]:;'",.<>?`~/|\-]{8,}$/)
    .required()
    .label('Password')
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
}).options({
  abortEarly: false,
});

export const LoginSchema = Joi.object({
  email: Joi.string()
    .required()
    .label('Email/Username')
    .messages({ ...errorMessage }),

  password: Joi.string()
    .required()
    .label('Password')
    .messages({
      ...errorMessage,
    }),
}).options({
  abortEarly: false,
});

export const ChangePasswordSchema = Joi.object({
  old_password: Joi.string()
    .required()
    .label('Old Password')
    .messages({ ...errorMessage }),

  new_password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+{}\[\]:;'",.<>?`~/|\-]{8,}$/)
    .required()
    .label('New Password')
    .messages({
      ...errorMessage,
      'string.pattern.base':
        '{#label} must have at least one uppercase character, one lowercase character, one numeric character and one special character',
    }),
}).options({
  abortEarly: false,
});