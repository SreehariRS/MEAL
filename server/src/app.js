import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandlers.js';
import { getCorsOrigin } from './middlewares/corsConfig.js';

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// CORS
const corsOrigin = getCorsOrigin();
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

export default app;


