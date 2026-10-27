/**
 * User Schema definition (compatible with Mongoose and in-memory store)
 * Fields: { name, email (unique), phone, passwordHash, role, createdAt }
 */

export const UserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  createdAt: { type: Date, default: Date.now },
};
