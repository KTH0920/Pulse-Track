const MarketData = require('../models/MarketData');
const financialApiService = require('../services/financialApiService');

// @desc    Get current market data for a symbol
// @route   GET /api/market/:symbol
// @access  Private
const getMarketData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await financialApiService.getQuote(symbol.toUpperCase());
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get historical market data for charting
// @route   GET /api/market/:symbol/history
// @access  Private
const getHistoricalData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1day', limit = 30 } = req.query;

    // Try to get from database first
    const dbData = await MarketData
      .find({ symbol: symbol.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    if (dbData.length >= limit) {
      return res.json(dbData.reverse());
    }

    // If not enough data in DB, fetch from API
    const apiData = await financialApiService.getHistoricalData(symbol, interval, limit);
    res.json(apiData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search for stock symbols
// @route   GET /api/market/search
// @access  Private
const searchSymbols = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = await financialApiService.searchSymbols(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get market data for multiple symbols (for watchlist)
// @route   POST /api/market/bulk
// @access  Private
const getBulkMarketData = async (req, res) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ message: 'Symbols array required' });
    }

    const data = await financialApiService.getBulkQuotes(symbols);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMarketData,
  getHistoricalData,
  searchSymbols,
  getBulkMarketData,
};
