const PriceAlert = require('../models/PriceAlert');

// @desc    Get user's price alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create price alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const { symbol, targetPrice, condition } = req.body;

    const alert = await PriceAlert.create({
      user: req.user._id,
      symbol: symbol.toUpperCase(),
      targetPrice,
      condition,
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update price alert
// @route   PUT /api/alerts/:id
// @access  Private
const updateAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Check ownership
    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { targetPrice, condition, active } = req.body;

    alert.targetPrice = targetPrice || alert.targetPrice;
    alert.condition = condition || alert.condition;
    alert.active = active !== undefined ? active : alert.active;

    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete price alert
// @route   DELETE /api/alerts/:id
// @access  Private
const deleteAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    // Check ownership
    if (alert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await alert.deleteOne();
    res.json({ message: 'Alert removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};
