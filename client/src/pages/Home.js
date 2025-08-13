// client/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Add a CSS file for Home-specific styles if needed
import logo from '../images/nba-header.png';

import performance from '../images/performance_a.png';
import matchup from '../images/matchup_a.png';
import recommendations from '../images/fantasy_rec.png';

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <img src={logo} alt="NBALogo" className="nbalogo"/>
      </header>
      <div className="nav-buttons">
        
        <Link to="/kobe">
          <img src={performance} alt="kobe" className="main-buttons"/>
        </Link>

        <Link to="/michael">
          <img src={matchup} alt="michael" className="main-buttons"/>
        </Link>

        <Link to="/lebron">
          <img src={recommendations} alt="lebron" className="main-buttons"/>
        </Link>

       </div>
    </div>
  );
}

export default Home;
