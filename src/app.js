/**
 * Express application:
 * - CORS, JSON parsing, logging
 * - API routes (auth/chat)
 * - Static file hosting (public/)
 * - Note: we DO NOT listen here; server.js creates HTTP server and attaches sockets.
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();

// Allow browser apps (index.html/dashboard.html) to call our API
app.use(cors({
  origin: process.env.ORIGIN?.split(',') ?? ['http://localhost:4000'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Parse JSON payloads
app.use(morgan('dev'));                   // Log HTTP requests to console

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Serve static frontend demo from /public
// NOTE: ESM-safe way to resolve path relative to this file:
app.use('/', express.static(new URL('./public', import.meta.url).pathname));

export default app;
