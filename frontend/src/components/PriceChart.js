import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { marketApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import './PriceChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ symbol }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30');
  const { priceUpdates } = useSocket();

  useEffect(() => {
    if (symbol) {
      loadHistoricalData();
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    // Update current price from socket
    if (priceUpdates[symbol]) {
      setCurrentPrice(priceUpdates[symbol]);
    }
  }, [priceUpdates, symbol]);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const response = await marketApi.getHistory(symbol, '1day', parseInt(timeframe));
      setHistoricalData(response.data);

      // Set initial current price from latest data
      if (response.data.length > 0) {
        const latest = response.data[response.data.length - 1];
        setCurrentPrice({
          price: latest.close,
          changePercent: ((latest.close - latest.open) / latest.open) * 100,
        });
      }
    } catch (error) {
      console.error('Error loading historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: historicalData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: `${symbol} Price`,
        data: historicalData.map(d => d.close),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(0);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '--';
  };

  const formatChange = (changePercent) => {
    if (!changePercent) return '--';
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const isPositive = currentPrice?.changePercent >= 0;

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <h2>{symbol}</h2>
          {currentPrice && (
            <div className="current-price-info">
              <span className="current-price">{formatPrice(currentPrice.price)}</span>
              <span className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                {formatChange(currentPrice.changePercent)}
              </span>
            </div>
          )}
        </div>

        <div className="timeframe-selector">
          <button
            className={timeframe === '7' ? 'active' : ''}
            onClick={() => setTimeframe('7')}
          >
            7D
          </button>
          <button
            className={timeframe === '30' ? 'active' : ''}
            onClick={() => setTimeframe('30')}
          >
            1M
          </button>
          <button
            className={timeframe === '90' ? 'active' : ''}
            onClick={() => setTimeframe('90')}
          >
            3M
          </button>
        </div>
      </div>

      <div className="chart-wrapper">
        {historicalData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="no-data">No historical data available</div>
        )}
      </div>

      {historicalData.length > 0 && (
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Open</span>
            <span className="stat-value">${historicalData[historicalData.length - 1]?.open.toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">High</span>
            <span className="stat-value">${Math.max(...historicalData.map(d => d.high)).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low</span>
            <span className="stat-value">${Math.min(...historicalData.map(d => d.low)).toFixed(2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Volume</span>
            <span className="stat-value">{(historicalData[historicalData.length - 1]?.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
