require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const socketService = require('./services/socketService');
const cronService = require('./services/cronService');

// Import routes
const authRoutes = require('./routes/authRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const alertRoutes = require('./routes/alertRoutes');
const marketRoutes = require('./routes/marketRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/market', marketRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PulseTrack API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      watchlist: '/api/watchlist',
      alerts: '/api/alerts',
      market: '/api/market',
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize Socket.io
socketService.initialize(server);

// Initialize Cron jobs
cronService.initialize();

// Server configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║            🚀 PulseTrack Server Running           ║
║                                                   ║
║  Environment: ${process.env.NODE_ENV || 'development'}                       ║
║  Port: ${PORT}                                    ║
║  Socket.io: Enabled                               ║
║  Cron Jobs: Active                                ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  cronService.stopAll();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = { app, server };
