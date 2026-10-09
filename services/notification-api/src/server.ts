import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { dbPool } from './database/db.js';
import { startNotificationEventConsumer } from './consumers/eventConsumer.js';
import {
  authenticateUser,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dispatchNotification,
} from './controllers/notificationController.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Healthcheck endpoint
app.get('/healthz', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'grocery-notification-api',
    timestamp: new Date().toISOString(),
  });
});

// REST API routes
app.get('/api/v1/notifications', authenticateUser, getNotifications);
app.patch('/api/v1/notifications/:id/read', authenticateUser, markNotificationAsRead);
app.post('/api/v1/notifications/mark-all-read', authenticateUser, markAllNotificationsAsRead);
app.post('/api/v1/notifications/send', dispatchNotification);

// Start Redis event consumer
const subscriber = startNotificationEventConsumer();

const server = app.listen(config.port, () => {
  console.log(`[Notification Service] Running on port ${config.port}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('[Notification Service] Shutting down gracefully...');
  server.close();
  await subscriber.quit().catch(() => {});
  await dbPool.end().catch(() => {});
  console.log('[Notification Service] Closed all connections.');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app, server };
