import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import Watchlist from './Watchlist';
import PriceChart from './PriceChart';
import AlertsPanel from './AlertsPanel';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { connected, alerts, clearAlerts } = useSocket();
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>PulseTrack</h1>
          <span className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Live' : '○ Offline'}
          </span>
        </div>
        <div className="header-right">
          <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
            🔔
            {alerts.length > 0 && <span className="notification-badge">{alerts.length}</span>}
          </div>
          <span className="user-name">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {showNotifications && alerts.length > 0 && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={clearAlerts} className="btn-clear">
              Clear All
            </button>
          </div>
          <div className="notifications-list">
            {alerts.map((alert, index) => (
              <div key={index} className="notification-item">
                <strong>{alert.symbol}</strong>
                <p>{alert.message}</p>
                <small>{new Date(alert.timestamp).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="left-panel">
          <Watchlist onSymbolSelect={setSelectedSymbol} selectedSymbol={selectedSymbol} />
        </div>

        <div className="center-panel">
          {selectedSymbol ? (
            <PriceChart symbol={selectedSymbol} />
          ) : (
            <div className="chart-placeholder">
              <h2>Select a symbol from your watchlist</h2>
              <p>View real-time price updates and historical charts</p>
            </div>
          )}
        </div>

        <div className="right-panel">
          <AlertsPanel selectedSymbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
