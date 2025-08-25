/**
 * User model:
 *  - email: unique identifier
 *  - pass: hashed password (bcrypt)
 *  - role: user | agent | admin (for dashboards/privileges)
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true, required: true },
  pass:  { type: String, required: true },
  role:  { type: String, enum: ['user','agent','admin'], default: 'user' }
}, { timestamps: true });

/**
 * Hash the password before saving:
 * - Only hash if field is modified (new user or password update).
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('pass')) return next();
  this.pass = await bcrypt.hash(this.pass, 10);
  next();
});

/**
 * Compare candidate password with stored hash.
 */
userSchema.methods.compare = function(plain) {
  return bcrypt.compare(plain, this.pass);
};

export default mongoose.model('User', userSchema);
