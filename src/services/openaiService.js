/**
 * Tiny wrapper around OpenAI Chat Completions API.
 * - Accepts an array of messages [{ role, content }]
 * - Returns the assistant's reply text.
 */
import { client } from '../config/openaiInstance.js';

export async function getAIReply(messages) {
  // Call OpenAI with current conversation context
  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages
  });

  // Extract result text safely
  return resp?.choices?.[0]?.message?.content?.trim() || '';
}
