import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  DB_URI: Joi.string().default('mongodb://localhost'),
  DB_NAME: Joi.string().default('developmentDB'),
  DB_URI_TEST: Joi.string().default('mongodb://localhost'),
  DB_NAME_TEST: Joi.string().default('testDB'),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
  CORS_WHITELIST: Joi.string().default(
    'http://localhost:3000,http://localhost:3001',
  ),
});
