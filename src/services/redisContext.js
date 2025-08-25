/**
 * Conversation context in Redis:
 * - We keep only the last N turns to keep tokens low and fast retrieval.
 * - Full history is persisted in Mongo (Conversation model).
 */
import { r } from '../config/redisInstance.js';

const TTL = 60 * 60 * 12; // 12 hours

export async function getCtx(userId) {
  const key = `chat:ctx:${userId}`;
  const raw = await r.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function setCtx(userId, ctx) {
  const key = `chat:ctx:${userId}`;
  await r.setEx(key, TTL, JSON.stringify(ctx));
}
