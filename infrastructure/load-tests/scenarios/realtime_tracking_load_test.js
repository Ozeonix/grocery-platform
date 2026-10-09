import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { CONFIG } from '../config/environments.js';

const wsConnectionSuccess = new Rate('ws_connection_success');

export const options = {
  stages: [
    { duration: '15s', target: 50 },  // 50 concurrent listening clients
    { duration: '30s', target: 150 }, // 150 concurrent sockets
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    ws_connection_success: ['rate>0.95'],
  },
};

export default function () {
  const url = `${CONFIG.realtimeUrl}/socket.io/?EIO=4&transport=websocket`;

  const res = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      wsConnectionSuccess.add(1);

      // Join mock order tracking room
      socket.send('42["join:order", "ORD-1712-4912"]');

      // Keep open for simulated order tracking session
      socket.setInterval(() => {
        socket.ping();
      }, 5000);
    });

    socket.on('message', (data) => {
      check(data, { 'Message received': (d) => d.length > 0 });
    });

    socket.on('error', (e) => {
      wsConnectionSuccess.add(0);
    });

    socket.setTimeout(() => {
      socket.close();
    }, 12000);
  });

  check(res, { 'WebSocket handshake status is 101': (r) => r && r.status === 101 });
  sleep(1);
}
