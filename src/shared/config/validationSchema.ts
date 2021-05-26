import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DB_URI: Joi.string().default('mongodb://localhost'),
  DB_NAME: Joi.string().default('developmentDB'),
  DB_URI_TEST: Joi.string().default('mongodb://localhost'),
  DB_NAME_TEST: Joi.string().default('testDB'),
  PORT: Joi.number().default(3000),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
});
