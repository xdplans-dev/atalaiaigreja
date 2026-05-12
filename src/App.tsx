import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MinisterialTrail from './components/MinisterialTrail';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import PrayerRequestPage from './pages/PrayerRequestPage';
import PrayerWallPage from './pages/PrayerWallPage';
import AdminPrayersPage from './pages/admin/AdminPrayersPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trail" element={<MinisterialTrail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/oracao" element={<PrayerRequestPage />} />
        <Route path="/mural-oracao" element={<PrayerWallPage />} />
        <Route path="/admin/pedidos-oracao" element={<AdminPrayersPage />} />
      </Routes>
    </Router>
  );
}
