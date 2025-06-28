import React, { useState } from 'react';
import '../Styles/Card.css';

const Card = ({ 
  title = 'Data Dashboard',
  data = {
    average: 0,
    max: 0,
    min: 0,
    chartData: []
  }
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const calculateTrend = (values) => {
    if (values.length < 2) return { direction: '→', value: '' };
    const last = values[values.length - 1];
    const prev = values[values.length - 2];
    const change = ((last - prev) / prev) * 100;
    return {
      direction: last > prev ? '↑' : last < prev ? '↓' : '→',
      value: isNaN(change) ? '' : `${Math.abs(change).toFixed(1)}%`
    };
  };

  const trend = calculateTrend(data.chartData || []);

  return (
    <div 
      className={`card-container ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          <div className="card-menu">⋯</div>
        </div>

        <div className="card-content">
          <div className="visualization-area">
            {data.chartData && data.chartData.length > 0 ? (
              <div className="graph-bars">
                {data.chartData.map((value, i) => (
                  <div 
                    key={i}
                    className="graph-bar"
                    style={{ 
                      height: `${(value / Math.max(...data.chartData, 1)) * 100}%`,
                      background: value > (Math.max(...data.chartData) * 0.7) ? 
                        'linear-gradient(to top, #f08a5d, #f9ed69)' : 
                        'linear-gradient(to top, #00adb5, #a3f7bf)'
                    }}
                  >
                    <span className="bar-value">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No chart data available</div>
            )}
            {trend.direction && (
              <div className="graph-trend">
                Trend: <span className={`trend-${trend.direction}`}>
                  {trend.direction} {trend.value}
                </span>
              </div>
            )}
          </div>

          <div className="metrics-grid">
            {Object.entries(data).map(([key, value]) => {
              if (key === 'chartData') return null;
              return (
                <div key={key} className="metric-card">
                  <div className="metric-title">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="metric-value">{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;