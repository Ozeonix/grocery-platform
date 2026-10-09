import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.NOTIFICATION_API_PORT || '3002', 10),
  jwtSecret: process.env.JWT_SECRET || '404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970',
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
