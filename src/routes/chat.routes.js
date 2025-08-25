/**
 * Routes for chat (protected by JWT).
 */
import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { sendMsg, history } from '../controllers/chatController.js';

const router = Router();

router.post('/send',   auth, sendMsg);  // Send a message and get AI reply
router.get('/history', auth, history);  // Fetch full chat history

export default router;
