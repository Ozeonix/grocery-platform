import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { CONFIG } from '../config/environments.js';

const checkoutDuration = new Trend('checkout_flow_duration');
const paymentSuccessRate = new Rate('payment_success_rate');

export const options = {
  stages: [
    { duration: '20s', target: 30 },
    { duration: '40s', target: 100 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    checkout_flow_duration: ['p(95)<400'],
    payment_success_rate: ['rate>0.98'],
  },
};

export function setup() {
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
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.token}`,
  };

  const startTime = Date.now();

  group('Full Customer Purchase Flow', () => {
    // 1. Fetch Cart
    const cartRes = http.get(`${CONFIG.coreApiUrl}/cart`, { headers });
    check(cartRes, { 'Cart fetched': (r) => r.status === 200 });

    // 2. Checkout
    const checkoutPayload = JSON.stringify({
      deliveryAddressId: 'a0000000-0000-0000-0000-000000000001',
      specialInstructions: 'Leave with concierge',
    });

    const checkoutRes = http.post(`${CONFIG.coreApiUrl}/orders/checkout`, checkoutPayload, { headers });
    const checkoutSuccess = check(checkoutRes, {
      'Order checkout created': (r) => r.status === 201,
    });

    if (checkoutSuccess) {
      const order = JSON.parse(checkoutRes.body).data;

      // 3. Process Payment
      const paymentPayload = JSON.stringify({
        orderId: order.id,
        paymentMethod: 'CARD',
        gatewayProvider: 'MOCK',
        paymentToken: 'tok_visa_4242',
      });

      const paymentRes = http.post(`${CONFIG.coreApiUrl}/payments/process`, paymentPayload, { headers });
      const payOk = check(paymentRes, {
        'Payment captured successfully': (r) => r.status === 201,
      });

      paymentSuccessRate.add(payOk);
    }
  });

  checkoutDuration.add(Date.now() - startTime);
  sleep(1);
}
