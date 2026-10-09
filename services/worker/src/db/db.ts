import pg from 'pg';
import { config } from '../config/env.js';

const { Pool } = pg;

export const dbPool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 5,
  idleTimeoutMillis: 30000,
});

dbPool.on('error', (err) => {
  console.error('[Worker DB Pool Error]', err.message);
});
