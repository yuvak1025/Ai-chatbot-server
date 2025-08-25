/**
 * JWT Auth middleware:
 * - Reads 'Authorization: Bearer <token>' header.
 * - Verifies token using JWT_SECRET.
 * - Attaches payload to req.user for downstream handlers.
 */
import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ msg: 'missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { uid, role, iat, exp }
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'invalid token' });
  }
}
