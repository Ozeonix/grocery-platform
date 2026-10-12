#!/usr/bin/env node
/**
 * Ozeonix Grocery Platform - Automated API Test Suite Runner
 * 
 * Tests all core, realtime, and notification API contracts.
 * Can be run against local microservices, Docker Compose, or staging/production URLs.
 * 
 * Usage:
 *   node infrastructure/scripts/test-all-apis.mjs
 *   CORE_URL=http://localhost:8080 REALTIME_URL=http://localhost:3001 NOTIFICATION_URL=http://localhost:3002 node infrastructure/scripts/test-all-apis.mjs
 */

const CORE_URL = process.env.CORE_URL || process.env.API_GATEWAY_URL || 'http://localhost:8080';
const REALTIME_URL = process.env.REALTIME_URL || 'http://localhost:3001';
const NOTIFICATION_URL = process.env.NOTIFICATION_URL || 'http://localhost:3002';

// Colors for terminal formatting
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

async function executeTest(name, testFn) {
  totalTests++;
  const start = performance.now();
  try {
    const outcome = await testFn();
    const duration = Math.round(performance.now() - start);
    passedTests++;
    results.push({ name, passed: true, duration, detail: outcome });
    console.log(` ${GREEN}✔ PASS${RESET}  ${BOLD}${name}${RESET} ${GRAY}(${duration}ms)${RESET}`);
    if (outcome) {
      console.log(`        ${GRAY}└─ ${outcome}${RESET}`);
    }
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    failedTests++;
    const errMsg = err.message || String(err);
    results.push({ name, passed: false, duration, error: errMsg });
    console.log(` ${RED}✖ FAIL${RESET}  ${BOLD}${name}${RESET} ${GRAY}(${duration}ms)${RESET}`);
    console.log(`        ${RED}└─ Error: ${errMsg}${RESET}`);
  }
}

async function request(url, options = {}) {
  const timeoutMs = options.timeoutMs || 5000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    return { status: res.status, headers: res.headers, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function runSuite() {
  console.log(`\n${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}               OZEONIX AUTOMATED API CONTRACT & HEALTH SUITE             ${RESET}`);
  console.log(`${CYAN}========================================================================${RESET}`);
  console.log(` ${GRAY}Core API Target:${RESET}         ${CORE_URL}`);
  console.log(` ${GRAY}Realtime API Target:${RESET}     ${REALTIME_URL}`);
  console.log(` ${GRAY}Notification API Target:${RESET} ${NOTIFICATION_URL}`);
  console.log(`${CYAN}------------------------------------------------------------------------${RESET}\n`);

  let authToken = null;
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const testEmail = `auto.test.${randomSuffix}@ozeonix.com`;
  const testPassword = 'Password123!';

  // 1. Health Checks
  await executeTest('Core API Health Check (GET /healthz)', async () => {
    const res = await request(`${CORE_URL}/healthz`);
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (res.data?.status !== 'UP') throw new Error(`Expected status: UP, got: ${res.data?.status}`);
    return `Service: ${res.data?.service || 'core-api'}`;
  });

  await executeTest('Realtime API Health Check (GET /healthz)', async () => {
    const res = await request(`${REALTIME_URL}/healthz`);
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (res.data?.status !== 'UP') throw new Error(`Expected status: UP, got: ${res.data?.status}`);
    return `Service: ${res.data?.service}`;
  });

  await executeTest('Notification API Health Check (GET /healthz)', async () => {
    const res = await request(`${NOTIFICATION_URL}/healthz`);
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (res.data?.status !== 'UP') throw new Error(`Expected status: UP, got: ${res.data?.status}`);
    return `Service: ${res.data?.service}`;
  });

  // 2. Authentication Flow
  await executeTest(`Core API User Registration (POST /api/v1/auth/register)`, async () => {
    const res = await request(`${CORE_URL}/api/v1/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        firstName: 'Automated',
        lastName: 'Tester',
        phone: `+97798${randomSuffix}`,
      }),
    });

    if (res.status !== 201) {
      throw new Error(`Expected 201 Created, got ${res.status} (${JSON.stringify(res.data)})`);
    }
    if (!res.data?.data?.accessToken) {
      throw new Error(`Missing accessToken in response data`);
    }
    authToken = res.data.data.accessToken;
    return `Registered: ${testEmail}`;
  });

  await executeTest('Core API User Authentication (POST /api/v1/auth/login)', async () => {
    const res = await request(`${CORE_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Expected 200 OK, got ${res.status}`);
    }
    if (!res.data?.data?.accessToken) {
      throw new Error(`No accessToken returned from login endpoint`);
    }
    authToken = res.data.data.accessToken;
    return `Authenticated session verified`;
  });

  await executeTest('Core API User Profile (GET /api/v1/auth/me)', async () => {
    const res = await request(`${CORE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (res.data?.data?.email !== testEmail) {
      throw new Error(`Expected profile email ${testEmail}, got ${res.data?.data?.email}`);
    }
    return `Customer Name: ${res.data?.data?.firstName} ${res.data?.data?.lastName}`;
  });

  await executeTest('Security Boundary: Unauthorized Access Rejection', async () => {
    const res = await request(`${CORE_URL}/api/v1/auth/me`);
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized without token, got ${res.status}`);
    }
    return `Security filter blocked unauthenticated request`;
  });

  // 3. Catalog & Store APIs
  await executeTest('Core API Categories Endpoint (GET /api/v1/categories)', async () => {
    const res = await request(`${CORE_URL}/api/v1/categories`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    const count = Array.isArray(res.data?.data) ? res.data.data.length : 0;
    return `Retrieved ${count} category records`;
  });

  await executeTest('Core API Stores Endpoint (GET /api/v1/stores)', async () => {
    const res = await request(`${CORE_URL}/api/v1/stores`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    const count = Array.isArray(res.data?.data) ? res.data.data.length : 0;
    return `Retrieved ${count} active grocery stores`;
  });

  await executeTest('Core API Products Catalog (GET /api/v1/products)', async () => {
    const res = await request(`${CORE_URL}/api/v1/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    const count = Array.isArray(res.data?.data) ? res.data.data.length : 0;
    return `Catalog query executed successfully (${count} products)`;
  });

  // 4. Cart & Order APIs
  await executeTest('Core API Customer Cart (GET /api/v1/cart)', async () => {
    const res = await request(`${CORE_URL}/api/v1/cart`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    return `Customer cart retrieved (items: ${res.data?.data?.items?.length || 0})`;
  });

  await executeTest('Core API Customer Orders (GET /api/v1/orders/my-orders)', async () => {
    const res = await request(`${CORE_URL}/api/v1/orders/my-orders`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    const count = Array.isArray(res.data?.data) ? res.data.data.length : 0;
    return `Customer orders fetched (${count} orders)`;
  });

  // 5. Cross-Service Realtime & Notification Integrations
  await executeTest('Notification API Authenticated Feed (GET /api/v1/notifications)', async () => {
    const res = await request(`${NOTIFICATION_URL}/api/v1/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    return `Notifications API verified with JWT`;
  });

  await executeTest('Realtime API Socket.IO Polling Handshake', async () => {
    const res = await request(`${REALTIME_URL}/socket.io/?EIO=4&transport=polling`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status !== 200) throw new Error(`Expected 200 OK, got ${res.status}`);
    if (typeof res.data !== 'string' || !res.data.includes('sid')) {
      throw new Error(`Expected Socket.io handshake containing sid, got: ${res.data}`);
    }
    return `Socket.IO EIO=4 handshake verified`;
  });

  // Summary Report
  console.log(`\n${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}                              TEST RESULTS                              ${RESET}`);
  console.log(`${CYAN}========================================================================${RESET}`);
  console.log(` Total Executed:  ${BOLD}${totalTests}${RESET}`);
  console.log(` Passed:          ${GREEN}${BOLD}${passedTests}${RESET}`);
  console.log(` Failed:          ${failedTests > 0 ? RED : GREEN}${BOLD}${failedTests}${RESET}`);
  console.log(`${CYAN}------------------------------------------------------------------------${RESET}`);

  if (failedTests === 0) {
    console.log(` ${GREEN}${BOLD}ALL APIs ARE PASSING SUCCESSFULLY! 🎉${RESET}\n`);
    process.exit(0);
  } else {
    console.log(` ${RED}${BOLD}SOME API TESTS FAILED. Please review the failed items above.${RESET}\n`);
    process.exit(1);
  }
}

runSuite().catch((err) => {
  console.error(`\n${RED}Fatal execution error in test runner:${RESET}`, err);
  process.exit(1);
});
