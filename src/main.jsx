import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import VisualizerCharts from './pages/VisualizerCharts';
import Landing from './pages/Landing.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/charts" element={<VisualizerCharts />} />
          <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
    </BrowserRouter>
  </StrictMode>
);