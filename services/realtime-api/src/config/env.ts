import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.REALTIME_API_PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-in-production-must-be-256-bits-long',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
