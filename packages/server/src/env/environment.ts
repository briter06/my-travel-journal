import Joi from 'joi';

export type Environment = {
  DATABASE_MIGRATE: string;
  JAWSDB_URL: string;
  LOGGER_LEVEL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  CORS_ORIGIN: string;
};

const envJoiSchema = Joi.object()
  .keys({
    DATABASE_MIGRATE: Joi.string().optional().default('FALSE'),
    JAWSDB_URL: Joi.string().required(),
    LOGGER_LEVEL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.number().optional(),
    CORS_ORIGIN: Joi.string().required(),
  })
  .required()
  .unknown();

const result = envJoiSchema.validate(process.env);

if (result.error != null) {
  throw new Error(result.error.message);
}

export const environment: Environment = result.value as Environment;
