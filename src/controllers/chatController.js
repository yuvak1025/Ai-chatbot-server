/**
 * Chat controller:
 * - sendMsg: accept user input, fetch context, call OpenAI, update context/history, emit via Socket.IO
 * - history: return full conversation history (from Mongo)
 */
import Conversation from '../models/Conversation.js';
import { getAIReply } from '../services/openaiService.js';
import { getCtx, setCtx } from '../services/redisContext.js';

const KEEP = 10; // keep last 10 turns (user+assistant) + 1 system prompt in Redis

export async function sendMsg(req, res) {
  const userId = req.user.uid;
  const { text } = req.body;

  if (!text) return res.status(400).json({ msg: 'text is required' });

  // Load recent context from Redis (fast). If missing, seed with a system prompt.
  let ctx = await getCtx(userId);
  if (!ctx) ctx = [{ role: 'system', content: 'You are a helpful assistant.' }];

  // Append user's new message to the context to pass to OpenAI
  ctx.push({ role: 'user', content: text });

  // Get assistant response from OpenAI
  const reply = await getAIReply(ctx);

  // Append assistant reply to context
  ctx.push({ role: 'assistant', content: reply });

  // Trim context for Redis (keep only a sliding window for speed)
  // Keep: 1 system + last N*2 roles (user+assistant)
  const trimmed = ctx.slice(-KEEP - 1);

  // Persist trimmed context back into Redis (fast retrieval on next message)
  await setCtx(userId, trimmed);

  // Persist full history in Mongo for long-term storage
  await Conversation.findOneAndUpdate(
    { userId },
    {
      $push: {
        msgs: {
          $each: [
            { role: 'user', content: text },
            { role: 'assistant', content: reply }
          ]
        }
      },
      $set: { last: new Date() }
    },
    { upsert: true, new: true }
  );

  // Emit the AI reply in real time to this user's room (so open sockets get it)
  req.io.to(`user:${userId}`).emit('chat:ai', { content: reply });

  // Respond to the HTTP caller as well
  return res.json({ reply });
}

export async function history(req, res) {
  // Return full history from Mongo (for UI "load history" button)
  const convo = await Conversation.findOne({ userId: req.user.uid }).lean();
  return res.json({ history: convo?.msgs || [] });
}
