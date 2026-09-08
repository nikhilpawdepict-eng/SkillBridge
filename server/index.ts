import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabaseIfEmpty } from './seed/seedData.js';

// Modular Route Handlers
import { authRouter } from './routes/authRoutes.js';
import { academicRouter } from './routes/academicRoutes.js';
import { skillRouter } from './routes/skillRoutes.js';
import { clubRouter } from './routes/clubRoutes.js';
import { doubtRouter } from './routes/doubtRoutes.js';
import { placementRouter } from './routes/placementRoutes.js';
import { scholarshipRouter } from './routes/scholarshipRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';

// Initialize Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillbridge';

// Global Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SkillBridge Central API Server',
    database: 'MongoDB',
    compassUri: MONGODB_URI,
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRouter);
app.use('/api/academic', academicRouter);
app.use('/api/skills', skillRouter);
app.use('/api/clubs', clubRouter);
app.use('/api/doubts', doubtRouter);
app.use('/api/placements', placementRouter);
app.use('/api/scholarships', scholarshipRouter);
app.use('/api/chat', chatRouter);

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Initialize Database & Start Server
const startServer = async () => {
  const isConnected = await connectDB();
  if (isConnected) {
    await seedDatabaseIfEmpty();
  }

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 SkillBridge Backend Server is LIVE!`);
    console.log(`🌐 Server URL:        http://localhost:${PORT}`);
    console.log(`📡 API Health Check:  http://localhost:${PORT}/api/health`);
    console.log(`📦 MongoDB Database:  skillbridge`);
    console.log(`🧭 MongoDB Compass:   ${MONGODB_URI}`);
    console.log(`======================================================\n`);
  });
};

startServer();
