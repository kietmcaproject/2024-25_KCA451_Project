import React, { useEffect, useState } from 'react';
import NavButton from '../components/NavButton';
import logo from '../images/ma.png';
import './MatchupAnalyzer.css';

function MatchupAnalyzer() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPredictions = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/predictions');
      if (!res.ok) throw new Error('Failed to fetch predictions');

      const data = await res.json();
      setPredictions(data);
    } catch (err) {
      console.error("❌ Prediction fetch error:", err);
      setError("Unable to load predictions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const filteredPredictions = predictions
  .filter((item) => item.Team.toLowerCase() === selectedTeam.toLowerCase())
  .sort((a, b) => new Date(b.Date) - new Date(a.Date)) // sort newest first
  .slice(0, 10); // take only 10


  const teamOptions = [...new Set(predictions.map(p => p.Team))];

  return (
    <div>
      <header>
        <img src={logo} alt="NBALogo" className="nbalogo" />
      </header>

      <NavButton path="/" label="⇦ Return to Home" className="backbutton" />

      <div className="inner">
        <h2>NBA Game Predictions</h2>
        <p>→ View AI-based predictions for upcoming NBA games.</p>
        <hr />

        <label>
          Filter by Team:
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="team-input"
          >
            <option value="">-- Select Team --</option>
            {teamOptions.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </label>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading predictions...</p>}

        {selectedTeam && filteredPredictions.length > 0 && (
  <div className="results">
    <h3>{selectedTeam} Predictions</h3>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {Object.keys(filteredPredictions[0]).map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPredictions.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((val, i) => (
                <td key={i}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        {selectedTeam && filteredPredictions.length === 0 && (
          <p>No predictions found for {selectedTeam}.</p>
        )}
      </div>
    </div>
  );
}

export default MatchupAnalyzer;
