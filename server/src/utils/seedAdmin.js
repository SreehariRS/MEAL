import User from '../models/User.js';

export default async function seedAdmin() {
  const email = 'admin@example.com';
  const name = 'Admin User';
  const password = 'password123';

  const existing = await User.findOne({ email });
  if (existing) return existing;

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, role: 'admin', passwordHash });
  return user;
}

export async function seedSampleUser() {
  const email = 'user@example.com';
  const name = 'Sample User';
  const password = 'password123';
  const existing = await User.findOne({ email });
  if (existing) return existing;
  const passwordHash = await User.hashPassword(password);
  return User.create({ name, email, role: 'user', passwordHash });
}
