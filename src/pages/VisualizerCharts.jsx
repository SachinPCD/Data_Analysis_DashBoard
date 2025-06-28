// VisualizerCharts.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement,
  ArcElement,
  RadarController,
  RadialLinearScale
} from 'chart.js';
import { Bar, Line, Pie, Radar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import '../Styles/VisualizerCharts.css';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PointElement,
  ArcElement,
  zoomPlugin,
  RadarController,
  RadialLinearScale
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: '#ffffff' }
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.7)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff'
    },
    zoom: {
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'xy'
      },
      pan: {
        enabled: true,
        mode: 'xy'
      }
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#ffffff'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};

const VisualizerCharts = () => {
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    end_year: '',
    topic: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    swot: '',
    country: '',
    city: ''
  });

  useEffect(() => {
    fetch('/data/upload.json') 
      .then(response => response.json())
      .then(data => {
        setOriginalData(data);
        setFilteredData(data);
      })
      .catch(err => console.error('Failed to load data:', err));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = originalData.filter((item) => {
      return Object.keys(newFilters).every(
        (key) => newFilters[key] === '' || item[key] === newFilters[key]
      );
    });

    setFilteredData(filtered);
  };

  const getChartData = (key, label) => {
    const grouped = {};
    filteredData.forEach((item) => {
      const topic = item.topic || 'Unknown';
      if (!grouped[topic]) grouped[topic] = 0;
      grouped[topic] += item[key] || 0;
    });

    return {
      labels: Object.keys(grouped),
      datasets: [
        {
          label,
          data: Object.values(grouped),
          backgroundColor: 'rgba(0, 173, 181, 0.6)',
          borderColor: '#00adb5',
          borderWidth: 1
        }
      ]
    };
  };

  const uniqueValues = (key) => [
    ...new Set(originalData.map((item) => item[key]).filter(Boolean))
  ];

  return (
    <div className="dashboard-container">
      <h2>📊 Data Dashboard with Filters</h2>

      <div className="filters-container">
        {Object.keys(filters).map((key) => (
          <select key={key} name={key} value={filters[key]} onChange={handleFilterChange}>
            <option value="">All {key.replace('_', ' ')}</option>
            {uniqueValues(key).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="chart-grid">
        <div className="chart-container">
          <h4>Intensity by Topic</h4>
          <Bar data={getChartData('intensity', 'Intensity')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h4>Likelihood by Topic</h4>
          <Line data={getChartData('likelihood', 'Likelihood')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h4>Relevance by Topic</h4>
          <Pie data={getChartData('relevance', 'Relevance')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h4>End Year Distribution</h4>
          <Bar data={getChartData('end_year', 'End Year')} options={chartOptions} />
        </div>
        <div className="chart-container">
          <h4>Radar of Intensity</h4>
          <Radar data={getChartData('intensity', 'Intensity')} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default VisualizerCharts;
