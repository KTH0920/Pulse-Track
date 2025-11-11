const cron = require('node-cron');
const MarketData = require('../models/MarketData');
const Watchlist = require('../models/Watchlist');
const financialApiService = require('./financialApiService');
const socketService = require('./socketService');
const alertService = require('./alertService');

class CronService {
  constructor() {
    this.tasks = [];
  }

  /**
   * Initialize all cron jobs
   */
  initialize() {
    // Fetch market data every 5 minutes (configurable via env)
    const schedule = process.env.DATA_FETCH_SCHEDULE || '*/5 * * * *';

    const dataFetchTask = cron.schedule(schedule, async () => {
      console.log('Running scheduled market data fetch...');
      await this.fetchAndUpdateMarketData();
    });

    this.tasks.push(dataFetchTask);

    // Clean old market data daily at midnight
    const cleanupTask = cron.schedule('0 0 * * *', async () => {
      console.log('Running daily cleanup...');
      await this.cleanupOldData();
    });

    this.tasks.push(cleanupTask);

    console.log('Cron jobs initialized');
  }

  /**
   * Fetch market data for all symbols in watchlists
   */
  async fetchAndUpdateMarketData() {
    try {
      // Get unique symbols from all watchlists
      const watchlists = await Watchlist.find().distinct('symbol');

      if (watchlists.length === 0) {
        console.log('No symbols to fetch');
        return;
      }

      console.log(`Fetching data for ${watchlists.length} symbols...`);

      // Fetch data for all symbols
      const marketDataPromises = watchlists.map(symbol =>
        financialApiService.getQuote(symbol).catch(err => {
          console.error(`Error fetching ${symbol}:`, err.message);
          return null;
        })
      );

      const results = await Promise.all(marketDataPromises);

      // Save to database and emit via socket
      for (const data of results) {
        if (!data) continue;

        try {
          // Save to database
          await MarketData.create({
            symbol: data.symbol,
            price: data.price,
            open: data.open,
            high: data.high,
            low: data.low,
            volume: data.volume,
            changePercent: data.changePercent,
          });

          // Emit real-time update via Socket.io
          socketService.emitPriceUpdate(data.symbol, data);

          // Check price alerts
          await alertService.checkPriceAlerts(data.symbol, data.price);

        } catch (error) {
          console.error(`Error processing ${data.symbol}:`, error.message);
        }
      }

      console.log(`Market data updated for ${results.filter(r => r).length} symbols`);
    } catch (error) {
      console.error('Error in fetchAndUpdateMarketData:', error);
    }
  }

  /**
   * Clean up old market data (keep last 90 days)
   */
  async cleanupOldData() {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await MarketData.deleteMany({
        timestamp: { $lt: ninetyDaysAgo },
      });

      console.log(`Cleaned up ${result.deletedCount} old market data records`);
    } catch (error) {
      console.error('Error in cleanupOldData:', error);
    }
  }

  /**
   * Stop all cron tasks
   */
  stopAll() {
    this.tasks.forEach(task => task.stop());
    console.log('All cron tasks stopped');
  }

  /**
   * Manually trigger market data fetch
   */
  async triggerDataFetch() {
    console.log('Manually triggering data fetch...');
    await this.fetchAndUpdateMarketData();
  }
}

module.exports = new CronService();
