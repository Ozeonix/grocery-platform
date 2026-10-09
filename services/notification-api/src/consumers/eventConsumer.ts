import { Redis } from 'ioredis';
import { config } from '../config/env.js';
import { NotificationService } from '../services/notificationService.js';

export function startNotificationEventConsumer(): Redis {
  const subscriber = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
  });

  const CHANNELS = ['notification:send', 'order:status_changed'];

  subscriber.subscribe(...CHANNELS, (err) => {
    if (err) {
      console.warn('[Notification Consumer Warning] Redis not reachable for pub/sub:', err.message);
    } else {
      console.log(`[Notification Service] Subscribed to events on channels: ${CHANNELS.join(', ')}`);
    }
  });

  subscriber.on('message', async (channel, message) => {
    try {
      const payload = JSON.parse(message);

      if (channel === 'notification:send' && payload.userId && payload.type) {
        await NotificationService.send(payload);
      } else if (channel === 'order:status_changed' && payload.customerId && payload.status) {
        // Map order lifecycle change to corresponding notification
        let notificationType = 'ORDER_CONFIRMED';
        if (payload.status === 'OUT_FOR_DELIVERY') {
          notificationType = 'OUT_FOR_DELIVERY';
        } else if (payload.status === 'DELIVERED') {
          notificationType = 'DELIVERED';
        }

        await NotificationService.send({
          userId: payload.customerId,
          type: notificationType,
          channels: ['IN_APP', 'SMS'],
          dataPayload: payload,
          phoneNumber: payload.customerPhone,
          email: payload.customerEmail,
        });
      }
    } catch (err: any) {
      console.error('[Notification Event Consumer Error]', err.message);
    }
  });

  return subscriber;
}
