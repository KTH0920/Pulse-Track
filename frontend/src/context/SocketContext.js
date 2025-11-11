import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [alerts, setAlerts] = useState([]);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

    const newSocket = io(WS_URL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    newSocket.on('price_update', (data) => {
      setPriceUpdates((prev) => ({
        ...prev,
        [data.symbol]: data,
      }));
    });

    newSocket.on('price_alert', (alert) => {
      setAlerts((prev) => [alert, ...prev]);

      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Price Alert', {
          body: alert.message,
          icon: '/logo192.png',
        });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, isAuthenticated]);

  const subscribeToSymbol = (symbol) => {
    if (socket && connected) {
      socket.emit('subscribe_symbol', symbol);
    }
  };

  const unsubscribeFromSymbol = (symbol) => {
    if (socket && connected) {
      socket.emit('unsubscribe_symbol', symbol);
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    socket,
    connected,
    priceUpdates,
    alerts,
    subscribeToSymbol,
    unsubscribeFromSymbol,
    clearAlerts,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
