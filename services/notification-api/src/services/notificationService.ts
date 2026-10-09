import { dbPool } from '../database/db.js';
import {
  NotificationChannel,
  EmailProvider,
  SmsProvider,
  PushProvider,
} from '../providers/NotificationProviders.js';
import { NotificationTemplates } from '../templates/notificationTemplates.js';

export interface DispatchNotificationRequest {
  userId: string;
  type: string;
  channels?: NotificationChannel[];
  dataPayload?: Record<string, any>;
  email?: string;
  phoneNumber?: string;
  deviceToken?: string;
}

export class NotificationService {
  static async send(req: DispatchNotificationRequest) {
    const channels = req.channels && req.channels.length > 0 ? req.channels : ['IN_APP'];
    const template = NotificationTemplates.get(req.type, req.dataPayload || {});
    const results: Record<string, any> = {};

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'IN_APP': {
            const query = `
              INSERT INTO notifications (user_id, type, channel, title, message, data_payload, is_read, sent_at)
              VALUES ($1, $2, $3, $4, $5, $6, FALSE, CURRENT_TIMESTAMP)
              RETURNING *;
            `;
            const res = await dbPool.query(query, [
              req.userId,
              template.type,
              'IN_APP',
              template.title,
              template.message,
              JSON.stringify(req.dataPayload || {}),
            ]);
            results.IN_APP = res.rows[0];
            break;
          }

          case 'EMAIL': {
            if (req.email) {
              const res = await EmailProvider.send({
                to: req.email,
                subject: template.title,
                bodyHtml: `<p>${template.message}</p>`,
              });
              results.EMAIL = res;
            }
            break;
          }

          case 'SMS': {
            if (req.phoneNumber) {
              const res = await SmsProvider.send({
                toPhoneNumber: req.phoneNumber,
                message: `${template.title}\n${template.message}`,
              });
              results.SMS = res;
            }
            break;
          }

          case 'PUSH': {
            if (req.deviceToken) {
              const res = await PushProvider.send({
                deviceToken: req.deviceToken,
                title: template.title,
                body: template.message,
                data: req.dataPayload,
              });
              results.PUSH = res;
            }
            break;
          }
        }
      } catch (err: any) {
        console.error(`[Notification Service] Failed to send on channel ${channel}:`, err.message);
      }
    }

    return results;
  }

  static async getUserNotifications(userId: string, limit = 20, offset = 0) {
    const query = `
      SELECT id, user_id, type, channel, title, message, data_payload, is_read, sent_at, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const res = await dbPool.query(query, [userId, limit, offset]);
    return res.rows;
  }

  static async markAsRead(notificationId: string, userId: string) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const res = await dbPool.query(query, [notificationId, userId]);
    return res.rows[0];
  }

  static async markAllAsRead(userId: string) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE;
    `;
    const res = await dbPool.query(query, [userId]);
    return { updatedCount: res.rowCount };
  }
}
