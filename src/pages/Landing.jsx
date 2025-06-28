import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaChartLine, FaDatabase, FaShieldAlt, FaRocket } from 'react-icons/fa';
import '../Styles/HeroAnalysis.css';
import '../Styles/Landing.css';
import Sidebar from '../components/Sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import Card from '../pages/Card.jsx';
import '../Styles/Card.css';

function RotatingBox() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]}>
      <boxGeometry />
      <meshStandardMaterial color={'#00ADB5'} />
    </mesh>
  );
}

const DataDashboard = ({ jsonData }) => {
  if (!jsonData || jsonData.length === 0) {
    return <div className="loading-message">No data available. Please upload JSON file.</div>;
  }

  // Calculate statistics
  const intensities = jsonData.map(item => item.intensity || 0);
  const avgIntensity = intensities.length > 0 
    ? (intensities.reduce((a, b) => a + b, 0) / intensities.length).toFixed(1)
    : 0;

  const topicCounts = jsonData.reduce((acc, item) => {
    acc[item.topic] = (acc[item.topic] || 0) + 1;
    return acc;
  }, {});
  const topTopic = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const sectorCounts = jsonData.reduce((acc, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + 1;
    return acc;
  }, {});
  const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const likelihoods = jsonData.map(item => item.likelihood || 0);
  const avgLikelihood = likelihoods.length > 0
    ? (likelihoods.reduce((a, b) => a + b, 0) / likelihoods.length).toFixed(1)
    : 0;

  const regions = new Set(jsonData.map(item => item.region));
  const recentItems = jsonData.filter(item => {
    const year = new Date(item.added).getFullYear();
    return !isNaN(year) && year >= 2020;
  }).length;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Advanced Analytics Dashboard</h2>
      <div className="setcards">
        <Card 
          title="Intensity Analysis"
          data={{
            average: avgIntensity,
            max: Math.max(...intensities),
            min: Math.min(...intensities),
            chartData: jsonData.slice(0, 7).map(item => item.intensity || 0)
          }}
        />
        <Card 
          title="Topic Distribution"
          data={{
            topTopic: topTopic,
            count: topicCounts[topTopic],
            chartData: Object.values(topicCounts).slice(0, 7)
          }}
        />
        <Card 
          title="Sector Overview"
          data={{
            topSector: topSector,
            percentage: `${((sectorCounts[topSector] / jsonData.length) * 100).toFixed(1)}%`,
            chartData: Object.values(sectorCounts).slice(0, 7)
          }}
        />
        <Card 
          title="Risk Assessment"
          data={{
            avgLikelihood: avgLikelihood,
            highRisk: jsonData.filter(item => item.likelihood >= 4).length,
            chartData: jsonData.slice(0, 7).map(item => item.likelihood || 0)
          }}
        />
        <Card 
          title="Regional Data"
          data={{
            regions: regions.size,
            primaryRegion: jsonData[0]?.region || 'N/A',
            chartData: Array(7).fill(0).map((_, i) => 
              jsonData.filter(item => item.region && item.region.includes('America')).length
            )
          }}
        />
        <Card 
          title="Recent Activity"
          data={{
            recentItems: recentItems,
            years: new Set(jsonData.map(item => new Date(item.added).getFullYear())).size,
            chartData: Array(7).fill(0).map((_, i) => 
              jsonData.filter(item => new Date(item.added).getFullYear() === 2016 + i).length
            )
          }}
        />
      </div>
    </div>
  );
};

const Landing = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = sessionStorage.getItem('jsonData');
    if (savedData) {
      setJsonData(JSON.parse(savedData));
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (Array.isArray(json) && json[0]?.topic && json[0]?.intensity) {
          sessionStorage.setItem('jsonData', JSON.stringify(json));
          setJsonData(json);
          setActiveSection('statistics');
        } else {
          alert("Invalid JSON structure. Please upload a valid data file.");
        }
      } catch (err) {
        alert("Error parsing JSON. Make sure it's a valid JSON file.");
      }
    };

    if (selectedFile) {
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div className="main">
      <div className="visualizer-container">
        <div className="sperator">
          <Sidebar active={activeSection} setActive={setActiveSection} />
        </div>
        <div className="seperate">
          {activeSection === 'overview' && (
            <>
              <div className="hero-layout">
                <div className="analytics-column">
                  <div className="hero-analysis">
                    <div className="hero-content">
                      <h1>Advanced Data Intelligence</h1>
                      <p className="subtitle">
                        Transform information into actionable insights with our analytics engine
                      </p>
                      
                      <div className="metrics-grid">
                        {[
                          { 
                            title: "Data Trends", 
                            value: "1.2M+", 
                            change: "+12.5%", 
                            icon: <FaChartLine className="analysis-icon" />,
                            description: "Quarterly dataset growth"
                          },
                          { 
                            title: "Processed Records", 
                            value: "24.7B", 
                            change: "+8.3%", 
                            icon: <FaDatabase className="analysis-icon" />,
                            description: "Total analyzed points"
                          },
                          { 
                            title: "Security Score", 
                            value: "98.6%", 
                            change: "+2.1%", 
                            icon: <FaShieldAlt className="analysis-icon" />,
                            description: "Enterprise protection"
                          },
                          { 
                            title: "Performance", 
                            value: "0.9s", 
                            change: "-35%", 
                            icon: <FaRocket className="analysis-icon" />,
                            description: "Query response time"
                          }
                        ].map((metric, index) => (
                          <div key={index} className="metric-card">
                            <div className="metric-header">
                              {metric.icon}
                              <h3>{metric.title}</h3>
                            </div>
                            <div className="metric-value">
                              <span className="primary-value">{metric.value}</span>
                              <span className={`change-badge ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                                {metric.change}
                              </span>
                            </div>
                            <p className="metric-description">{metric.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'statistics' && <DataDashboard jsonData={jsonData} />}

          {activeSection === 'logistics' && (
            <div className="section-full">
              <h2>📦 Logistics Section</h2>
              <p>Logistics insights and visualizations will be shown here.</p>
            </div>
          )}

          {activeSection === 'login' && (
            <div className="section-full">
              <h2>🔐 Login</h2>
              <form className="login-form">
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;