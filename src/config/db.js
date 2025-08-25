/**
 * Database bootstrap using Mongoose.
 * - Connect once at startup.
 * - If connection fails, bubble the error so process can exit.
 */
import mongoose from 'mongoose';

export async function initDB(uri) {
  // Connect to MongoDB; dbName can be inside URI, but we set it explicitly.
  await mongoose.connect(uri, { dbName: 'ai_chatbot_rt' });
  console.log('[DB] Mongo connected');
}
