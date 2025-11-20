import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
  url: process.env.REDIS_URL,
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'autocloser:',
  retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10) || 3,
  retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10) || 3000,
}));