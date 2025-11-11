const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket
  }

  initialize(server) {
    this.io = socketIo(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication middleware for Socket.io
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;

        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId}`);
      this.connectedUsers.set(socket.userId, socket);

      // Join user's personal room
      socket.join(`user_${socket.userId}`);

      // Subscribe to symbol updates
      socket.on('subscribe_symbol', (symbol) => {
        socket.join(`symbol_${symbol.toUpperCase()}`);
        console.log(`User ${socket.userId} subscribed to ${symbol}`);
      });

      // Unsubscribe from symbol updates
      socket.on('unsubscribe_symbol', (symbol) => {
        socket.leave(`symbol_${symbol.toUpperCase()}`);
        console.log(`User ${socket.userId} unsubscribed from ${symbol}`);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        this.connectedUsers.delete(socket.userId);
      });
    });

    console.log('Socket.io initialized');
  }

  /**
   * Emit price update to all users subscribed to a symbol
   * @param {string} symbol - Stock symbol
   * @param {Object} data - Market data
   */
  emitPriceUpdate(symbol, data) {
    if (this.io) {
      this.io.to(`symbol_${symbol.toUpperCase()}`).emit('price_update', {
        symbol: symbol.toUpperCase(),
        ...data,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Send price alert notification to specific user
   * @param {string} userId - User ID
   * @param {Object} alert - Alert details
   */
  emitAlertNotification(userId, alert) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('price_alert', {
        type: 'price_alert',
        ...alert,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Broadcast market data to all connected clients
   * @param {Object} data - Market data
   */
  broadcastMarketData(data) {
    if (this.io) {
      this.io.emit('market_update', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get count of connected users
   */
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is connected
   * @param {string} userId - User ID
   */
  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new SocketService();
