import React, { useState } from 'react';
import '../components/Header.css';
import './TeamPerformanceAnalysis.css';
import NavButton from '../components/NavButton';
import '../components/Form.css';
import logo from '../images/tpa.png';
import Modal from '../components/Modal.js';

function TeamPerformanceAnalysis() {
  const [teamName, setTeamName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchTeamData = async () => {
    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    const encodedTeamName = encodeURIComponent(teamName.trim());

    try {
      const response = await fetch(`http://localhost:4000/api/teams/${encodedTeamName}`);
      if (!response.ok) throw new Error(`Network error: ${response.statusText}`);

      const teamData = await response.json();
      console.log("✅ Team Data Fetched: ", teamData);

      if (!teamData.name || !teamData.performanceData) {
        throw new Error("Incomplete data received from server.");
      }

      setData(teamData);
      setShowModal(true);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Could not fetch team data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchTeamData();
  };

  return (
    <div>
      <header>
        <img src={logo} alt="NBA Logo" className="nbalogo" />
      </header>

      <div>
        <NavButton path="/" label="⇦ Return to Home" className="backbutton" />

        <div className="inner">
          <h2>ENTER A TEAM</h2>
          <p style={{ fontSize: "80%" }}>
            → Analyze historical data over the last nine seasons to predict future team performances.
            <br /> → Identify rolling averages of key statistics over recent games to determine current form and trends.
          </p>
          <hr />

          <form onSubmit={handleSubmit}>
            <label htmlFor="team-input" className="form-label">Team Name:</label>
            <input
              id="team-input"
              type="text"
              placeholder="Format: [City] [Team]"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="team-input"
            />
            <p>
              <strong>Example:</strong> New York Knicks
            </p>
            <button type="submit" className="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>

          {error && <p className="error-box">{error}</p>}
        </div>

        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          {data ? (
            <div className="mainPage">
              <h1>{data.name}</h1>
              <hr />
              <p>Scroll through this module to see your team's relevant performance insights.</p>
              <hr />

              <h3>HISTORICAL DATA INSIGHTS</h3>
              {data.performanceData?.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.performanceData.map((season, index) => (
                        <tr key={index}>
                          <td>{season.season}</td>
                          <td>{season.wins}</td>
                          <td>{season.losses}</td>
                          <td>{season.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No historical data available.</p>
              )}

              <hr />
              <h3>CURRENT FORM</h3>
              {data.currentForm ? (
                <>
                  <h4>Last 10 Games:</h4>
                  {data.currentForm.last10Games?.length > 0 ? (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Game</th>
                            <th>Points</th>
                            <th>Outcome</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.currentForm.last10Games.map((game, index) => (
                            <tr key={index}>
                              <td>{game.game}</td>
                              <td>{game.points}</td>
                              <td>{game.outcome}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No recent game data available.</p>
                  )}

                  <h4>Rolling Averages:</h4>
                  {data.currentForm.rollingAverages ? (
                    <div className="table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Statistic</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(data.currentForm.rollingAverages).map(([stat, value], index) => (
                            <tr key={index}>
                              <td>{stat}</td>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No rolling averages available.</p>
                  )}
                </>
              ) : (
                <p>No current form data available.</p>
              )}
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TeamPerformanceAnalysis;
