import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.NOTIFICATION_API_PORT || '3002', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-in-production-must-be-256-bits-long',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'grocery',
    user: process.env.POSTGRES_USER || 'grocery',
    password: process.env.POSTGRES_PASSWORD || 'change-me',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
