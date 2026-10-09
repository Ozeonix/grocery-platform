import { Server } from 'socket.io';
import { redisSubscriber } from '../redis/redisClient.js';
import { RoomManager } from '../socket/roomManager.js';

export function setupOrderEventSubscriptions(io: Server): void {
  const CHANNELS = ['order:status_changed', 'delivery:assigned', 'store:new_order'];

  redisSubscriber.subscribe(...CHANNELS, (err) => {
    if (err) {
      console.warn('[Redis Subscribe Warning] Redis not reachable for pub/sub subscriptions:', err.message);
    } else {
      console.log(`[Realtime Service] Subscribed to Redis channels: ${CHANNELS.join(', ')}`);
    }
  });

  redisSubscriber.on('message', (channel: string, message: string) => {
    try {
      const data = JSON.parse(message);

      switch (channel) {
        case 'order:status_changed': {
          if (data.orderId) {
            const room = RoomManager.getOrderRoom(data.orderId);
            io.to(room).emit('order:status_updated', data);
          }
          break;
        }

        case 'delivery:assigned': {
          if (data.orderId) {
            io.to(RoomManager.getOrderRoom(data.orderId)).emit('delivery:assigned', data);
          }
          if (data.riderId) {
            io.to(RoomManager.getRiderRoom(data.riderId)).emit('delivery:assigned', data);
          }
          break;
        }

        case 'store:new_order': {
          if (data.storeId) {
            io.to(RoomManager.getStoreRoom(data.storeId)).emit('store:order_received', data);
          }
          break;
        }
      }
    } catch (err: any) {
      console.error('[Order Event Handler Error]', err.message);
    }
  });
}
