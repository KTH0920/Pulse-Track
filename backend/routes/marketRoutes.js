const express = require('express');
const router = express.Router();
const {
  getMarketData,
  getHistoricalData,
  searchSymbols,
  getBulkMarketData,
} = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

router.get('/search', protect, searchSymbols);
router.post('/bulk', protect, getBulkMarketData);
router.get('/:symbol', protect, getMarketData);
router.get('/:symbol/history', protect, getHistoricalData);

module.exports = router;
