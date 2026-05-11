import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MinisterialTrail from './components/MinisterialTrail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trail" element={<MinisterialTrail />} />
      </Routes>
    </Router>
  );
}
