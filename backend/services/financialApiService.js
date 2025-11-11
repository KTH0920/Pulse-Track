const axios = require('axios');

/**
 * Financial API Service
 *
 * This service integrates with external financial APIs
 * Example uses a generic API structure - adapt to your specific provider:
 * - Alpha Vantage
 * - Twelve Data
 * - Polygon.io
 * - Yahoo Finance API
 * - IEX Cloud
 */

class FinancialApiService {
  constructor() {
    this.apiKey = process.env.FINANCIAL_API_KEY;
    this.baseUrl = process.env.FINANCIAL_API_BASE_URL || 'https://api.example.com';
  }

  /**
   * Fetch current market data for a symbol
   * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'GOOGL')
   * @returns {Object} Market data including price, volume, etc.
   */
  async getQuote(symbol) {
    try {
      // Example implementation - adjust based on your API provider
      // const response = await axios.get(`${this.baseUrl}/quote/${symbol}`, {
      //   params: { apikey: this.apiKey }
      // });

      // For demonstration, return mock data
      // Replace this with actual API call
      const mockData = this.generateMockData(symbol);

      return {
        symbol: symbol.toUpperCase(),
        price: mockData.price,
        open: mockData.open,
        high: mockData.high,
        low: mockData.low,
        volume: mockData.volume,
        changePercent: mockData.changePercent,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch market data for ${symbol}`);
    }
  }

  /**
   * Fetch multiple quotes at once
   * @param {Array} symbols - Array of stock symbols
   * @returns {Array} Array of market data objects
   */
  async getBulkQuotes(symbols) {
    try {
      const promises = symbols.map(symbol => this.getQuote(symbol));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching bulk quotes:', error.message);
      throw error;
    }
  }

  /**
   * Fetch historical data for charting
   * @param {string} symbol - Stock symbol
   * @param {string} interval - Time interval (1min, 5min, 1day, etc.)
   * @param {number} limit - Number of data points
   * @returns {Array} Array of historical data points
   */
  async getHistoricalData(symbol, interval = '1day', limit = 30) {
    try {
      // Example implementation - adjust based on your API provider
      // const response = await axios.get(`${this.baseUrl}/time_series`, {
      //   params: {
      //     symbol,
      //     interval,
      //     outputsize: limit,
      //     apikey: this.apiKey
      //   }
      // });

      // For demonstration, return mock historical data
      return this.generateMockHistoricalData(symbol, limit);
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
      throw new Error(`Failed to fetch historical data for ${symbol}`);
    }
  }

  /**
   * Search for stock symbols
   * @param {string} query - Search query
   * @returns {Array} Array of matching symbols
   */
  async searchSymbols(query) {
    try {
      // Example implementation
      // const response = await axios.get(`${this.baseUrl}/search`, {
      //   params: { query, apikey: this.apiKey }
      // });

      // Mock search results
      return [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' },
      ].filter(item =>
        item.symbol.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching symbols:', error.message);
      throw error;
    }
  }

  // Helper method to generate mock data for demonstration
  generateMockData(symbol) {
    const basePrice = Math.random() * 1000 + 100;
    const variation = basePrice * 0.05;

    return {
      price: parseFloat((basePrice + (Math.random() - 0.5) * variation).toFixed(2)),
      open: parseFloat((basePrice - Math.random() * variation * 0.5).toFixed(2)),
      high: parseFloat((basePrice + Math.random() * variation).toFixed(2)),
      low: parseFloat((basePrice - Math.random() * variation).toFixed(2)),
      volume: Math.floor(Math.random() * 10000000),
      changePercent: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)),
    };
  }

  // Helper method to generate mock historical data
  generateMockHistoricalData(symbol, days) {
    const data = [];
    let basePrice = Math.random() * 1000 + 100;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const variation = basePrice * 0.03;
      const open = basePrice;
      const close = parseFloat((basePrice + (Math.random() - 0.5) * variation).toFixed(2));
      const high = parseFloat(Math.max(open, close) * (1 + Math.random() * 0.02)).toFixed(2);
      const low = parseFloat(Math.min(open, close) * (1 - Math.random() * 0.02)).toFixed(2);

      data.push({
        date: date.toISOString(),
        open,
        high: parseFloat(high),
        low: parseFloat(low),
        close,
        volume: Math.floor(Math.random() * 10000000),
      });

      basePrice = close;
    }

    return data;
  }
}

module.exports = new FinancialApiService();
