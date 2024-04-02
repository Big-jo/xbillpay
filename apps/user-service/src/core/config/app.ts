import { LogLevel } from '@nestjs/common';
import { readFileSync } from 'fs';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

const environments = ['production', 'development', 'staging', 'test'] as const;

const logLevels: readonly LogLevel[] = [
  'debug',
  'error',
  'log',
  'verbose',
  'warn',
];

type Environment = (typeof environments)[number];

export type AppConfig = {
  name: string;
  environment: Environment;
  version: string;
  server: {
    port: number;
    host: string;
  };
  swagger: {
    enabled: boolean;
  };
  log: {
    name: string;
    level: LogLevel;
  };
};

const schema = Joi.object({
  name: Joi.string().required(),
  environment: Joi.string()
    .valid(...environments)
    .required(),
  version: Joi.string().min(5).required(),
  server: Joi.object({
    port: Joi.number().required(),
    host: Joi.string().required(),
  }).required(),
  swagger: Joi.object({
    enabled: Joi.boolean().required(),
  }).required(),
  log: Joi.object({
    name: Joi.string().required(),
    level: Joi.string()
      .valid(...logLevels)
      .required(),
  }),
});

const getPackageInfo = () => {
  const content = readFileSync(
    path.join(__dirname, '../../../package.json'),
    'utf-8',
  );
  return JSON.parse(content);
};

export const getConfig = (): AppConfig => {
  const pkg = getPackageInfo();
  const name = process.env.NAME || pkg.name;
  const version = process.env.VERSION || pkg.version;
  const environment = (process.env.ENVIRONMENT ||
    process.env.NODE_ENV ||
    'development') as Environment;

  return {
    name,
    environment,
    version,
    server: {
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT, 10) || 3000,
    },
    log: {
      name,
      level: (process.env.LOG_LEVEL || 'log') as LogLevel,
    },
    swagger: {
      enabled: process.env.SWAGGER_ENABLED === 'true',
    },
  };
};

export default registerAs('app', (): AppConfig => {
  const config = getConfig();
  Joi.assert(config, schema, 'App config validation failed');
  return config;
});
