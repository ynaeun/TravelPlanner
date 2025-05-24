import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FestivalList from './components/FestivalList';
import FestivalDetail from './components/FestivalDetail';
import TravelPlanner from './components/TravelPlanner';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/festivals" element={<FestivalList />} />
        <Route path="/festivals/:id" element={<FestivalDetail />} />
        <Route path="/planner" element={<TravelPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;