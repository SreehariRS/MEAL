import mongoose from 'mongoose';
import app from '../src/app.js';
import seedAdmin, { seedSampleUser } from '../src/utils/seedAdmin.js';

let isConnected = false;

async function ensureDatabaseConnection() {
  if (isConnected) return;
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not set');
  }
  await mongoose.connect(MONGO_URI);
  isConnected = true;
  try {
    await seedAdmin();
    await seedSampleUser();
  } catch (e) {
    console.error('Seeding error:', e);
  }
}

export default async function handler(req, res) {
  await ensureDatabaseConnection();
  return app(req, res);
}


