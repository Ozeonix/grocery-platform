import { Server, Socket } from 'socket.io';
import { redisPublisher } from '../redis/redisClient.js';
import { RoomManager } from '../socket/roomManager.js';

interface LocationUpdatePayload {
  orderId: string;
  deliveryId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  timestamp?: number;
}

const lastUpdateMap = new Map<string, number>();
const RATE_LIMIT_MS = 1000; // Throttle to max 1 update per second per rider

export function registerLocationHandler(io: Server, socket: Socket): void {
  socket.on('location:update', async (payload: LocationUpdatePayload) => {
    try {
      const user = socket.data.user;
      if (!user || (!user.roles.includes('ROLE_DELIVERY_PARTNER') && !user.roles.includes('ROLE_ADMIN'))) {
        socket.emit('error:forbidden', { message: 'Only delivery partners can emit location updates' });
        return;
      }

      if (!payload.orderId || payload.latitude == null || payload.longitude == null) {
        socket.emit('error:bad_request', { message: 'Invalid location payload' });
        return;
      }

      // Check lat/lng bounds
      if (payload.latitude < -90 || payload.latitude > 90 || payload.longitude < -180 || payload.longitude > 180) {
        return;
      }

      // Rate limit check
      const now = Date.now();
      const last = lastUpdateMap.get(user.userId) || 0;
      if (now - last < RATE_LIMIT_MS) {
        return; // drop intermediate updates within throttle window
      }
      lastUpdateMap.set(user.userId, now);

      const locationEvent = {
        orderId: payload.orderId,
        deliveryId: payload.deliveryId,
        riderId: user.userId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speed: payload.speed || 0,
        heading: payload.heading || 0,
        timestamp: payload.timestamp || now,
      };

      // 1. Broadcast immediately to everyone tracking this order
      const room = RoomManager.getOrderRoom(payload.orderId);
      io.to(room).emit('delivery:location_changed', locationEvent);

      // 2. Publish to Redis for multi-node clusters and downstream consumers
      try {
        await redisPublisher.publish('delivery:location', JSON.stringify(locationEvent));
      } catch (err: any) {
        // Silently tolerate redis publishing failure in local single-node mode
      }
    } catch (err: any) {
      console.error('[Location Handler Error]', err.message);
    }
  });
}
