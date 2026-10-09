import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { CONFIG } from '../config/environments.js';

const successfulReservations = new Counter('successful_reservations');
const rejectedDueToStock = new Counter('rejected_insufficient_stock');
const unexpectedErrors = new Rate('unexpected_error_rate');

export const options = {
  scenarios: {
    flash_sale_surge: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 50 },  // Ramp-up to 50 concurrent buyers
        { duration: '30s', target: 200 }, // Peak flash surge
        { duration: '15s', target: 0 },   // Cool-down
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<250'],
    unexpected_error_rate: ['rate<0.01'],
  },
};

export function setup() {
  // Login to acquire bearer token
  const loginRes = http.post(
    `${CONFIG.coreApiUrl}/auth/login`,
    JSON.stringify(CONFIG.testUser),
    { headers: { 'Content-Type': 'application/json' } }
  );

  let token = '';
  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    token = body.data?.accessToken || '';
  }

  return { token };
}

export default function (data) {
  const storeId = 'f0000000-0000-0000-0000-000000000001';
  const productId = 'c0000000-0000-0000-0000-000000000001';

  const payload = JSON.stringify({
    productId: productId,
    quantity: 1,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };

  const res = http.post(`${CONFIG.coreApiUrl}/cart/items`, payload, params);

  if (res.status === 200 || res.status === 201) {
    successfulReservations.add(1);
    unexpectedErrors.add(0);
  } else if (res.status === 400) {
    // Expected when stock runs out under contention
    rejectedDueToStock.add(1);
    unexpectedErrors.add(0);
  } else {
    unexpectedErrors.add(1);
  }

  check(res, {
    'status is 200/201 or 400': (r) => [200, 201, 400].includes(r.status),
  });

  sleep(0.5);
}
