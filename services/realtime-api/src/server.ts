import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/env.js';
import { socketAuthMiddleware } from './auth/socketAuth.js';
import { RoomManager } from './socket/roomManager.js';
import { registerLocationHandler } from './handlers/locationHandler.js';
import { setupOrderEventSubscriptions } from './handlers/orderHandler.js';
import { redisPublisher, redisSubscriber } from './redis/redisClient.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Healthcheck endpoint
app.get('/healthz', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'grocery-realtime-api',
    timestamp: new Date().toISOString(),
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 25000,
  pingTimeout: 20000,
});

// Authenticate socket connections
io.use(socketAuthMiddleware);

// Handle client connections
io.on('connection', (socket) => {
  const user = socket.data.user;
  console.log(`[Socket Connected] User ${user?.email} (${socket.id})`);

  // Channel subscriptions
  socket.on('join:order', (orderId: string) => {
    RoomManager.handleJoinOrder(socket, orderId);
  });

  socket.on('leave:order', (orderId: string) => {
    RoomManager.handleLeaveOrder(socket, orderId);
  });

  socket.on('join:rider', (riderId: string) => {
    RoomManager.handleJoinRider(socket, riderId);
  });

  socket.on('join:store', (storeId: string) => {
    RoomManager.handleJoinStore(socket, storeId);
  });

  // Location streaming
  registerLocationHandler(io, socket);

  socket.on('disconnect', (reason) => {
    console.log(`[Socket Disconnected] User ${user?.email} (${socket.id}) - Reason: ${reason}`);
  });
});

// Setup Redis Pub/Sub listener
setupOrderEventSubscriptions(io);

// Graceful shutdown
const shutdown = async () => {
  console.log('[Realtime Service] Shutting down gracefully...');
  io.close();
  await redisPublisher.quit().catch(() => {});
  await redisSubscriber.quit().catch(() => {});
  httpServer.close(() => {
    console.log('[Realtime Service] Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

httpServer.listen(config.port, () => {
  console.log(`[Realtime Service] Running on port ${config.port}`);
});

export { app, io, httpServer };
