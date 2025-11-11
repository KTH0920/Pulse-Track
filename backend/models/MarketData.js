const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  price: {
    type: Number,
    required: true,
  },
  open: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  changePercent: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient time-series queries
marketDataSchema.index({ symbol: 1, timestamp: -1 });

module.exports = mongoose.model('MarketData', marketDataSchema);
