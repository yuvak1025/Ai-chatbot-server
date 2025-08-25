/**
 * Singleton OpenAI client instance loaded from .env.
 * Import this wherever you need to call OpenAI.
 */
import { initOpenAI } from './openai.js';

export const client = initOpenAI(process.env.OPENAI_API_KEY);
