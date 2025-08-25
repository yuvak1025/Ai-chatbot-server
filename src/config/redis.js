/**
 * Creates and connects a Redis v4 client.
 * We use this for:
 *  - caching conversation context
 *  - rate limiting (later)
 *  - Socket.IO adapter (separate pub/sub clients)
 */
import { createClient } from 'redis';

export async function initRedis(url) {
  const client = createClient({ url });

  // Helpful diagnostics
  client.on('error', (e) => console.error('[Redis] error', e));
  client.on('reconnecting', () => console.log('[Redis] reconnecting...'));

  await client.connect();
  console.log('[Redis] connected');
  return client;
}
