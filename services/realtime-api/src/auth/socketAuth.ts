import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { config } from '../config/env.js';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: string[];
}

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
    if (!authHeader) {
      return next(new Error('Authentication error: Missing token'));
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    socket.data.user = {
      userId: decoded.userId || decoded.sub,
      email: decoded.email || decoded.sub,
      roles: decoded.roles || [],
    } as AuthenticatedUser;

    next();
  } catch (err: any) {
    return next(new Error('Authentication error: Invalid or expired token'));
  }
}
