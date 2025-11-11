const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: [true, 'Please add a symbol'],
    uppercase: true,
    trim: true,
  },
  targetPrice: {
    type: Number,
    required: [true, 'Please add a target price'],
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: [true, 'Please specify condition'],
  },
  triggered: {
    type: Boolean,
    default: false,
  },
  triggeredAt: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
priceAlertSchema.index({ user: 1, symbol: 1, active: 1 });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
