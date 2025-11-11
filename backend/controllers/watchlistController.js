const Watchlist = require('../models/Watchlist');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { symbol, name, addedPrice, notes } = req.body;

    // Check if already in watchlist
    const existingItem = await Watchlist.findOne({
      user: req.user._id,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Symbol already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      user: req.user._id,
      symbol: symbol.toUpperCase(),
      name,
      addedPrice,
      notes,
    });

    res.status(201).json(watchlistItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update watchlist item
// @route   PUT /api/watchlist/:id
// @access  Private
const updateWatchlistItem = async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findById(req.params.id);

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    // Check ownership
    if (watchlistItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, notes, addedPrice } = req.body;

    watchlistItem.name = name || watchlistItem.name;
    watchlistItem.notes = notes !== undefined ? notes : watchlistItem.notes;
    watchlistItem.addedPrice = addedPrice !== undefined ? addedPrice : watchlistItem.addedPrice;

    const updatedItem = await watchlistItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete watchlist item
// @route   DELETE /api/watchlist/:id
// @access  Private
const deleteWatchlistItem = async (req, res) => {
  try {
    const watchlistItem = await Watchlist.findById(req.params.id);

    if (!watchlistItem) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }

    // Check ownership
    if (watchlistItem.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await watchlistItem.deleteOne();
    res.json({ message: 'Watchlist item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  deleteWatchlistItem,
};
