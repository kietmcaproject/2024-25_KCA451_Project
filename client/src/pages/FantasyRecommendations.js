// FantasyRecommendations.jsx

import React, { useState } from 'react';
import NavButton from '../components/NavButton';
import logo from "../images/Fr.png";
import './FantasyRecommendations.css';

const options = [
  "Optimal Lineup Suggestions",
  "Trading/Free Agency Advice"
];

function FantasyRecommendations() {
  const [option, setOption] = useState('');
  const [tips, setTips] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fantasyRec = (selectedOption) => {
    const encodedOption = encodeURIComponent(selectedOption.trim());
    setLoading(true);
    fetch(`http://localhost:4000/api/fantasy/${encodedOption}`)
      .then(res => {
        if (!res.ok) throw new Error("Something went wrong!");
        return res.json();
      })
      .then(data => {
        setTips(data);
        setError('');
      })
      .catch(err => {
        console.error("❌ Error fetching fantasy recommendations:", err);
        setTips([]);
        setError("Error fetching data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!option) {
      setError("⚠️ Please select an option.");
      setTips([]);
      return;
    }
    fantasyRec(option);
  };

  return (
    <div className="fantasy-recommendations scrollable">
      <header>
        <img src={logo} alt="NBA Logo" className="nbalogo" />
      </header>

      <NavButton path="/" label="⇦ Return to Home" className="backbutton" />

      <div className="inner">
        <h2>🏀 Fantasy Assistant</h2>
        <p style={{ fontSize: "80%" }}>
          → Prioritize specific statistics and receive tailored recommendations
        </p>
        <hr />

        <form onSubmit={handleSubmit}>
          <select
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="team-input"
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <br /><br />
          <button type="submit" className="submit">Submit</button>
        </form>

        {loading && <p>⏳ Loading recommendations...</p>}
        {error && <p className="error">{error}</p>}

        {tips.length > 0 && (
          <div className="results">
            <h3>🧠 Fantasy Recommendations:</h3>
            <ul>
              {tips.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
              ))}
            </ul>
            <button className="submit" onClick={() => fantasyRec(option)}>
              🔁 Refresh Tips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FantasyRecommendations;
