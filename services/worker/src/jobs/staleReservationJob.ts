import { dbPool } from '../db/db.js';
import { config } from '../config/env.js';

export async function processStaleReservations(): Promise<number> {
  const client = await dbPool.connect();
  let cancelledCount = 0;

  try {
    await client.query('BEGIN');

    // Find orders created > 15 minutes ago that were never paid
    const findQuery = `
      SELECT id, order_number, store_id
      FROM orders
      WHERE status = 'CREATED'
        AND payment_status = 'PENDING'
        AND placed_at < NOW() - INTERVAL '${config.reservationTtlMinutes} minutes'
      FOR UPDATE SKIP LOCKED;
    `;
    const res = await client.query(findQuery);

    for (const order of res.rows) {
      // 1. Release reserved inventory
      const itemsRes = await client.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = $1',
        [order.id]
      );

      for (const item of itemsRes.rows) {
        await client.query(
          `UPDATE inventory
           SET available_quantity = available_quantity + $1,
               reserved_quantity = GREATEST(0, reserved_quantity - $1),
               updated_at = NOW()
           WHERE store_id = $2 AND product_id = $3`,
          [item.quantity, order.store_id, item.product_id]
        );
      }

      // 2. Mark order CANCELLED and payment EXPIRED
      await client.query(
        `UPDATE orders
         SET status = 'CANCELLED',
             payment_status = 'EXPIRED',
             cancelled_at = NOW()
         WHERE id = $1`,
        [order.id]
      );

      // 3. Insert status history
      await client.query(
        `INSERT INTO order_status_history (order_id, from_status, to_status, reason)
         VALUES ($1, 'CREATED', 'CANCELLED', 'Reservation expired automatically due to payment timeout')`,
        [order.id]
      );

      cancelledCount++;
      console.log(`[Worker] Expired stale order #${order.order_number} and restored reserved inventory.`);
    }

    await client.query('COMMIT');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('[Worker Error] Failed processing stale reservations:', err.message);
  } finally {
    client.release();
  }

  return cancelledCount;
}
