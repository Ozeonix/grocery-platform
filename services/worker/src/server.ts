import { processStaleReservations } from './jobs/staleReservationJob.js';
import { dbPool } from './db/db.js';

console.log('[Worker Service] Background worker started. Polling every 60s...');

let isRunning = false;

async function runWorkerCycle() {
  if (isRunning) return;
  isRunning = true;

  try {
    const expired = await processStaleReservations();
    if (expired > 0) {
      console.log(`[Worker Cycle] Reconciled ${expired} expired order reservations.`);
    }
  } catch (err: any) {
    console.error('[Worker Cycle Error]', err.message);
  } finally {
    isRunning = false;
  }
}

// Initial cycle & interval
runWorkerCycle();
const intervalHandle = setInterval(runWorkerCycle, 60000);

const shutdown = async () => {
  console.log('[Worker Service] Shutting down gracefully...');
  clearInterval(intervalHandle);
  await dbPool.end().catch(() => {});
  console.log('[Worker Service] Closed database connections.');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
