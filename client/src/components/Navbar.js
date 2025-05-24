import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/festivals">Festival List</Link> 
    <Link to="/planner">AI Planner</Link>
  </nav>
);

export default Navbar;