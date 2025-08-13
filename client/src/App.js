import {useEffect, useState} from 'react'
import axios from 'axios'
import TeamPerformanceAnalysis from './pages/TeamPerformanceAnalysis';
import MatchupAnalyzer from './pages/MatchupAnalyzer';
import FantasyRecommendations from './pages/FantasyRecommendations';
import Home from './pages/Home';
import './components/Header.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  const [data, setData] = useState("")
  useEffect(() => {
    console.log("Fetching data from server...")
    axios.get('/api/teams').then(res => {
      console.log("Data fetched from server: ", res.data)
      setData(res.data.data);
    });
  }, [])
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kobe" element={<TeamPerformanceAnalysis />} />
          <Route path="/michael" element={<MatchupAnalyzer />} />
          <Route path="/lebron" element={<FantasyRecommendations />} />
        </Routes>
    </Router>
  );
}

export default App;
