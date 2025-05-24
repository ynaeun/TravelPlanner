import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ background: '#3b5998', color: '#fff', padding: '1rem' }}>
    <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>홈</Link>
    <Link to="/planner" style={{ color: '#fff', marginRight: '1rem' }}>AI 플래너</Link>
  </nav>
);

export default Navbar;