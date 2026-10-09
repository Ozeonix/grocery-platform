import { Redis } from 'ioredis';
import { config } from '../config/env.js';

export const redisPublisher = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

export const redisSubscriber = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redisPublisher.on('error', (err) => {
  console.error('[Redis Publisher Error]', err.message);
});

redisSubscriber.on('error', (err) => {
  console.error('[Redis Subscriber Error]', err.message);
});
