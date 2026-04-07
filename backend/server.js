import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';
import rateLimit from 'express-rate-limit';

// Import database initialization
import initializeDatabase from './database/init-mysql.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import aggregationRoutes from './routes/aggregationRoutes.js';

// Import services
import branchService from './services/branchService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;

// Initialize database on startup
console.log('🚀 Starting Super Admin Dashboard...');
await initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Super Admin Dashboard API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/aggregate', aggregationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Schedule health checks for all branches (every 5 minutes)
const healthCheckInterval = process.env.HEALTH_CHECK_INTERVAL || 5;
cron.schedule(`*/${healthCheckInterval} * * * *`, async () => {
  console.log('🔍 Running scheduled health checks for all branches...');
  try {
    await branchService.checkAllBranchesHealth();
    console.log('✅ Health checks completed');
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║        🎓 SUPER ADMIN DASHBOARD - ALKHWARIZMI 🎓          ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔍 Health checks: Every ${healthCheckInterval} minutes`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  - POST   /api/auth/login');
  console.log('  - POST   /api/auth/register');
  console.log('  - GET    /api/auth/me');
  console.log('  - GET    /api/branches');
  console.log('  - POST   /api/branches');
  console.log('  - GET    /api/branches/:id');
  console.log('  - PUT    /api/branches/:id');
  console.log('  - DELETE /api/branches/:id');
  console.log('  - POST   /api/branches/:id/test');
  console.log('  - GET    /api/branches/:id/health');
  console.log('  - GET    /api/aggregate/overview');
  console.log('  - GET    /api/aggregate/students');
  console.log('  - GET    /api/aggregate/staff');
  console.log('  - GET    /api/aggregate/attendance');
  console.log('  - GET    /api/aggregate/finance');
  console.log('  - GET    /api/aggregate/academics');
  console.log('  - GET    /api/aggregate/classes');
  console.log('  - GET    /api/aggregate/schedule');
  console.log('  - GET    /api/aggregate/faults');
  console.log('  - GET    /api/aggregate/communications');
  console.log('  - GET    /api/aggregate/comparison');
  console.log('');
  console.log('✅ Ready to accept connections');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
