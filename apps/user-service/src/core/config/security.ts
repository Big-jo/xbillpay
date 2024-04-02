import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export type SecurityConfig = {
  jwtExpiry: number | string;
  jwtSecret: string;
  saltRounds: number;
};

const schema = Joi.object<SecurityConfig>({
  jwtExpiry: Joi.alternatives(Joi.string(), Joi.number()).required(),
  jwtSecret: Joi.string().required(),
  saltRounds: Joi.number(),
});

export const getConfig = (): SecurityConfig => ({
  jwtExpiry: process.env.JWT_EXPIRY || '3d',
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: Number(process.env.SALT_ROUNDS) || 10,
});

/* istanbul ignore next */
export default registerAs('security', () => {
  const config = getConfig();
  Joi.assert(config, schema, 'Security config validation failed.');
  return config;
});
