import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';
import seedAdmin, { seedSampleUser } from './utils/seedAdmin.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sreehari:sreehari@meal.67m9n2x.mongodb.net/';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    seedAdmin().catch((e) => {
      console.error('Admin seeding failed:', e);
    });
    seedSampleUser().catch((e) => {
      console.error('Sample user seeding failed:', e);
    });
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });



