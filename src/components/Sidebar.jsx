import React from 'react';
import { motion } from 'framer-motion';
import '../Styles/Sidebar.css';
import { FaChartBar, FaBoxes, FaUserCircle } from 'react-icons/fa';

const Sidebar = ({ active, setActive }) => {
  const buttons = [
    { key: 'statistics', icon: <FaChartBar />, label: 'Statistics' },
    { key: 'logistics', icon: <FaBoxes />, label: 'Logistics' },
    { key: 'login', icon: <FaUserCircle />, label: 'Login' }
  ];

  return (
    <motion.div 
      className="sidebar-container"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 80 }}
    >
      <div className="logo">SachinPCD</div>
      <div className="sidebar-buttons">
        {buttons.map(({ key, icon, label }) => (
          <button 
            key={key} 
            className={`sidebar-btn ${active === key ? 'active' : ''}`}
            onClick={() => setActive(key)}
          >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;
