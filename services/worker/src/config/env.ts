import dotenv from 'dotenv';

dotenv.config();

export const config = {
  serviceName: 'grocery-worker',
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
  reservationTtlMinutes: 15,
};
