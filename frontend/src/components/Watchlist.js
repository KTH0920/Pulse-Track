import React, { useState, useEffect } from 'react';
import { watchlistApi, marketApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import './Watchlist.css';

const Watchlist = ({ onSymbolSelect, selectedSymbol }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { priceUpdates, subscribeToSymbol, unsubscribeFromSymbol } = useSocket();

  useEffect(() => {
    loadWatchlist();
  }, []);

  useEffect(() => {
    // Subscribe to all watchlist symbols for real-time updates
    watchlist.forEach(item => {
      subscribeToSymbol(item.symbol);
    });

    return () => {
      // Cleanup: unsubscribe on unmount
      watchlist.forEach(item => {
        unsubscribeFromSymbol(item.symbol);
      });
    };
  }, [watchlist]);

  useEffect(() => {
    // Update prices when socket data arrives
    setPrices(prev => ({
      ...prev,
      ...priceUpdates,
    }));
  }, [priceUpdates]);

  const loadWatchlist = async () => {
    try {
      const response = await watchlistApi.getAll();
      setWatchlist(response.data);

      // Fetch initial prices
      if (response.data.length > 0) {
        const symbols = response.data.map(item => item.symbol);
        const pricesResponse = await marketApi.getBulk(symbols);
        const pricesMap = {};
        pricesResponse.data.forEach(item => {
          pricesMap[item.symbol] = item;
        });
        setPrices(pricesMap);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    }
  };

  const handleAddSymbol = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await watchlistApi.add({
        symbol: newSymbol.toUpperCase(),
        name: newName,
      });

      setNewSymbol('');
      setNewName('');
      setShowAddForm(false);
      loadWatchlist();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add symbol');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await watchlistApi.delete(id);
      loadWatchlist();
    } catch (error) {
      console.error('Error removing symbol:', error);
    }
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '--';
  };

  const formatChange = (changePercent) => {
    if (!changePercent) return '--';
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <h2>My Watchlist</h2>
        <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-symbol-form" onSubmit={handleAddSymbol}>
          <input
            type="text"
            placeholder="Symbol (e.g., AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name (e.g., Apple Inc.)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          {error && <div className="form-error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
      )}

      <div className="watchlist-items">
        {watchlist.length === 0 ? (
          <div className="empty-state">
            <p>No symbols in watchlist</p>
            <small>Click + to add your first symbol</small>
          </div>
        ) : (
          watchlist.map((item) => {
            const priceData = prices[item.symbol];
            const isSelected = selectedSymbol === item.symbol;
            const isPositive = priceData?.changePercent >= 0;

            return (
              <div
                key={item._id}
                className={`watchlist-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSymbolSelect(item.symbol)}
              >
                <div className="item-header">
                  <div>
                    <strong>{item.symbol}</strong>
                    <button
                      className="btn-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="item-name">{item.name}</div>
                </div>
                <div className="item-price">
                  <span className="price">{formatPrice(priceData?.price)}</span>
                  <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
                    {formatChange(priceData?.changePercent)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Watchlist;
