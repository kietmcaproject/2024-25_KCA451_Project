// client/src/components/NavButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavButton.css';

function NavButton({ path, label }) {
  return (
    <Link to={path} className="nav-button">
      {label}
    </Link>
  );
}

export default NavButton;
