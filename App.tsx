import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Trainer from './pages/Trainer';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import Analysis from './pages/Analysis';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;