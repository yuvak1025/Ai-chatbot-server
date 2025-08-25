/**
 * Conversation model stores full history for persistence/analytics.
 * We also keep a "recent context" copy in Redis for speed.
 */
import mongoose from 'mongoose';

const msgSchema = new mongoose.Schema({
  role:    { type: String, enum: ['system','user','assistant'], required: true },
  content: { type: String, required: true },
  ts:      { type: Date, default: Date.now }
}, { _id: false });

const convoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  msgs:   [msgSchema],
  last:   { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Conversation', convoSchema);
