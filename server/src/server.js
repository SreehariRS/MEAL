import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandlers.js';
import seedAdmin, { seedSampleUser } from './utils/seedAdmin.js';

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

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

export default app;


