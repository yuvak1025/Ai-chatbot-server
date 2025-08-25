/**
 * Factory for OpenAI client.
 * We keep it separate to simplify testing and replacement.
 */
import OpenAI from 'openai';

export function initOpenAI(apiKey) {
  // Construct a new OpenAI client using API key from env
  return new OpenAI({ apiKey });
}
