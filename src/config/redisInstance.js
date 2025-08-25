/**
 * Singleton Redis instance for general app usage (context cache, etc.)
 * We export a mutable binding 'r' which is assigned after connect.
 */
import { initRedis } from './redis.js';

export let r; // will hold the connected client

export async function connectRedis() {
  r = await initRedis(process.env.REDIS_URL);
}

