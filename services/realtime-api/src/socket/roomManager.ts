import { Socket } from 'socket.io';
import { AuthenticatedUser } from '../auth/socketAuth.js';

export class RoomManager {
  static getOrderRoom(orderId: string): string {
    return `order:${orderId}`;
  }

  static getRiderRoom(riderId: string): string {
    return `rider:${riderId}`;
  }

  static getStoreRoom(storeId: string): string {
    return `store:${storeId}`;
  }

  static handleJoinOrder(socket: Socket, orderId: string): void {
    if (!orderId) return;
    const room = this.getOrderRoom(orderId);
    socket.join(room);
  }

  static handleLeaveOrder(socket: Socket, orderId: string): void {
    if (!orderId) return;
    const room = this.getOrderRoom(orderId);
    socket.leave(room);
  }

  static handleJoinRider(socket: Socket, riderId: string): void {
    const user = socket.data.user as AuthenticatedUser;
    if (!user || (!user.roles.includes('ROLE_DELIVERY_PARTNER') && !user.roles.includes('ROLE_ADMIN'))) {
      socket.emit('error:unauthorized', { message: 'Only delivery partners may join dispatch channels' });
      return;
    }
    const room = this.getRiderRoom(riderId);
    socket.join(room);
  }

  static handleJoinStore(socket: Socket, storeId: string): void {
    const user = socket.data.user as AuthenticatedUser;
    if (!user || (!user.roles.includes('ROLE_STORE_OWNER') && !user.roles.includes('ROLE_STORE_STAFF') && !user.roles.includes('ROLE_ADMIN'))) {
      socket.emit('error:unauthorized', { message: 'Only store personnel may join store event channels' });
      return;
    }
    const room = this.getStoreRoom(storeId);
    socket.join(room);
  }
}
