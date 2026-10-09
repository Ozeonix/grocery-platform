export const CONFIG = {
  coreApiUrl: __ENV.CORE_API_URL || 'http://localhost:8080/api/v1',
  realtimeUrl: __ENV.REALTIME_URL || 'ws://localhost:3001',
  testUser: {
    email: __ENV.TEST_USER_EMAIL || 'customer@grocery.local',
    password: __ENV.TEST_USER_PASSWORD || 'Customer123!',
  },
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<600'],
    http_req_failed: ['rate<0.02'],
  },
};
