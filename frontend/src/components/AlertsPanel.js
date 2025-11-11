import React, { useState, useEffect } from 'react';
import { alertsApi } from '../services/api';
import './AlertsPanel.css';

const AlertsPanel = ({ selectedSymbol }) => {
  const [alerts, setAlerts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await alertsApi.getAll();
      setAlerts(response.data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();

    if (!selectedSymbol) {
      setError('Please select a symbol from watchlist');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await alertsApi.create({
        symbol: selectedSymbol,
        targetPrice: parseFloat(targetPrice),
        condition,
      });

      setTargetPrice('');
      setCondition('above');
      setShowAddForm(false);
      loadAlerts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create alert');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await alertsApi.delete(id);
      loadAlerts();
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleToggleActive = async (alert) => {
    try {
      await alertsApi.update(alert._id, { active: !alert.active });
      loadAlerts();
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const activeAlerts = alerts.filter(a => a.active && !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h2>Price Alerts</h2>
        <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕' : '+'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-alert-form" onSubmit={handleAddAlert}>
          <div className="form-info">
            {selectedSymbol ? (
              <span>Create alert for <strong>{selectedSymbol}</strong></span>
            ) : (
              <span className="warning">Select a symbol first</span>
            )}
          </div>

          <div className="form-row">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Target Price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" disabled={loading || !selectedSymbol}>
            {loading ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      )}

      <div className="alerts-content">
        <div className="alerts-section">
          <h3>Active Alerts ({activeAlerts.length})</h3>
          <div className="alerts-list">
            {activeAlerts.length === 0 ? (
              <div className="empty-state">
                <p>No active alerts</p>
                <small>Create an alert to get notified</small>
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert._id} className="alert-item active">
                  <div className="alert-header">
                    <strong>{alert.symbol}</strong>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="alert-details">
                    <span className={`condition ${alert.condition}`}>
                      {alert.condition === 'above' ? '▲' : '▼'} {alert.condition}
                    </span>
                    <span className="target-price">${alert.targetPrice.toFixed(2)}</span>
                  </div>
                  <div className="alert-actions">
                    <button
                      className="btn-toggle"
                      onClick={() => handleToggleActive(alert)}
                    >
                      Pause
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {triggeredAlerts.length > 0 && (
          <div className="alerts-section">
            <h3>Triggered Alerts ({triggeredAlerts.length})</h3>
            <div className="alerts-list">
              {triggeredAlerts.map((alert) => (
                <div key={alert._id} className="alert-item triggered">
                  <div className="alert-header">
                    <strong>{alert.symbol}</strong>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="alert-details">
                    <span className={`condition ${alert.condition}`}>
                      {alert.condition === 'above' ? '▲' : '▼'} {alert.condition}
                    </span>
                    <span className="target-price">${alert.targetPrice.toFixed(2)}</span>
                  </div>
                  <div className="triggered-info">
                    Triggered on {new Date(alert.triggeredAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
