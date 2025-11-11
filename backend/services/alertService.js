const PriceAlert = require('../models/PriceAlert');
const socketService = require('./socketService');

class AlertService {
  /**
   * Check and trigger price alerts for a symbol
   * @param {string} symbol - Stock symbol
   * @param {number} currentPrice - Current price
   */
  async checkPriceAlerts(symbol, currentPrice) {
    try {
      // Find all active alerts for this symbol
      const alerts = await PriceAlert.find({
        symbol: symbol.toUpperCase(),
        active: true,
        triggered: false,
      }).populate('user');

      if (alerts.length === 0) {
        return;
      }

      console.log(`Checking ${alerts.length} alerts for ${symbol} at price ${currentPrice}`);

      for (const alert of alerts) {
        let shouldTrigger = false;

        if (alert.condition === 'above' && currentPrice >= alert.targetPrice) {
          shouldTrigger = true;
        } else if (alert.condition === 'below' && currentPrice <= alert.targetPrice) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          // Mark alert as triggered
          alert.triggered = true;
          alert.triggeredAt = new Date();
          alert.active = false; // Deactivate after triggering
          await alert.save();

          // Send notification via Socket.io
          const notification = {
            alertId: alert._id,
            symbol: alert.symbol,
            targetPrice: alert.targetPrice,
            currentPrice: currentPrice,
            condition: alert.condition,
            message: `${alert.symbol} has ${alert.condition === 'above' ? 'risen above' : 'fallen below'} $${alert.targetPrice}. Current price: $${currentPrice}`,
          };

          socketService.emitAlertNotification(alert.user._id.toString(), notification);

          console.log(`Alert triggered for user ${alert.user._id}: ${notification.message}`);
        }
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  }

  /**
   * Get triggered alerts for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of alerts to return
   */
  async getTriggeredAlerts(userId, limit = 10) {
    try {
      return await PriceAlert.find({
        user: userId,
        triggered: true,
      })
        .sort({ triggeredAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting triggered alerts:', error);
      return [];
    }
  }

  /**
   * Reset a triggered alert to make it active again
   * @param {string} alertId - Alert ID
   */
  async resetAlert(alertId) {
    try {
      const alert = await PriceAlert.findById(alertId);

      if (!alert) {
        throw new Error('Alert not found');
      }

      alert.triggered = false;
      alert.triggeredAt = null;
      alert.active = true;

      await alert.save();

      return alert;
    } catch (error) {
      console.error('Error resetting alert:', error);
      throw error;
    }
  }
}

module.exports = new AlertService();
