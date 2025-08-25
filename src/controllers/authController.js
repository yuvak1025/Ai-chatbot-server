/**
 * Auth controller:
 * - register: create user with hashed password
 * - login: issue a signed JWT (stateless auth)
 */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  const { email, pass, role } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ msg: 'email and pass are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ msg: 'user already exists' });

  const user = await User.create({ email, pass, role });
  // Never send back password hash
  return res.json({ id: user._id, email: user.email, role: user.role });
}

export async function login(req, res) {
  const { email, pass } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: 'user not found' });

  const ok = await user.compare(pass);
  if (!ok) return res.status(401).json({ msg: 'wrong credentials' });

  // Sign a token with minimal payload (user id + role)
  const token = jwt.sign(
    { uid: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }       // You can tune this
  );

  return res.json({ token });
}
