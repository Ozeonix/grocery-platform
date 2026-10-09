import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { NotificationService } from '../services/notificationService.js';

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const decoded = jwt.verify(token, config.jwtSecret) as any;

    (req as any).user = {
      userId: decoded.userId || decoded.sub,
      email: decoded.email || decoded.sub,
      roles: decoded.roles || [],
    };

    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);

    const notifications = await NotificationService.getUserNotifications(userId, limit, offset);
    return res.json({ success: true, data: notifications });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const updated = await NotificationService.markAsRead(id, userId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const result = await NotificationService.markAllAsRead(userId);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function dispatchNotification(req: Request, res: Response) {
  try {
    const result = await NotificationService.send(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
