import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MinisterialTrail from './components/MinisterialTrail';
import Login from './components/Login';
import Admin from './components/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trail" element={<MinisterialTrail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
