require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const predictionsFilePath = path.join(__dirname, '..', 'ML-Model', 'predictions.csv');

// GET: All Predictions
app.get('/api/predictions', (req, res) => {
  if (!fs.existsSync(predictionsFilePath)) {
    console.error("❌ Error: predictions.csv not found at", predictionsFilePath);
    return res.status(404).json({ error: "Predictions file not found" });
  }

  const predictions = [];

  fs.createReadStream(predictionsFilePath)
    .pipe(csv())
    .on('data', (row) => {
      predictions.push({
        Team: row.team,
        Season: row.season,
        Date: row.date,
        "Actual Result": row.actual === '1' ? '✅ Win' : '❌ Loss',
        "Predicted Result": row.prediction === '1' ? '✅ Win' : '❌ Loss',
      });
    })
    .on('end', () => {
      console.log("📊 Loaded predictions:", predictions.length);
      res.json(predictions);
    })
    .on('error', (err) => {
      console.error("❌ Error reading CSV:", err.message);
      res.status(500).json({ error: "Failed to read predictions.csv" });
    });
});

// GET: Matchup Predictions Between Two Teams
app.get('/api/matchup/:team1/:team2', (req, res) => {
  const { team1, team2 } = req.params;

  if (!fs.existsSync(predictionsFilePath)) {
    console.error("❌ Error: predictions.csv not found at", predictionsFilePath);
    return res.status(404).json({ error: "Predictions file not found" });
  }

  const predictions = [];

  fs.createReadStream(predictionsFilePath)
    .pipe(csv())
    .on('data', (row) => {
      if (
        (row.team === team1 && row.opponent === team2) ||
        (row.team === team2 && row.opponent === team1)
      ) {
        predictions.push({
          Team1: row.team,
          Team2: row.opponent,
          Date: row.date,
          "Predicted Result": row.prediction === '1' ? '✅ Win' : '❌ Loss',
          "Actual Result": row.actual === '1' ? '✅ Win' : '❌ Loss',
        });
      }
    })
    .on('end', () => {
      console.log(`📊 Matchup Predictions Fetched for ${team1} vs. ${team2}:`, predictions.length);
      if (predictions.length === 0) {
        return res.status(404).json({ error: "No predictions found for this matchup." });
      }
      res.json(predictions);
    })
    .on('error', (err) => {
      console.error("❌ Error reading CSV:", err.message);
      res.status(500).json({ error: "Failed to read predictions.csv" });
    });
});

// GET: Static Team Info
const teamsData = {
  'New York Knicks': {
    name: 'New York Knicks',
    performanceData: [
      { season: '2024', wins: 40, losses: 42, points: 120 },
      { season: '2023', wins: 50, losses: 32, points: 125 },
    ],
    currentForm: {
      last10Games: [
        { game: 'Knicks vs Lakers', points: 118, outcome: 'Win' },
        { game: 'Knicks vs Celtics', points: 105, outcome: 'Loss' },
      ],
      rollingAverages: {
        pointsPerGame: 115,
        assistsPerGame: 22,
        reboundsPerGame: 45,
      },
    },
  },
  'Los Angeles Lakers': {
  name: 'Los Angeles Lakers',
  performanceData: [
    { season: '2024', wins: 52, losses: 30, points: 130 },
    { season: '2023', wins: 48, losses: 34, points: 122 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Lakers vs Warriors', points: 115, outcome: 'Win' },
      { game: 'Lakers vs Clippers', points: 102, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 117,
      assistsPerGame: 24,
      reboundsPerGame: 49,
    },
  },
},

'Golden State Warriors': {
  name: 'Golden State Warriors',
  performanceData: [
    { season: '2024', wins: 47, losses: 35, points: 128 },
    { season: '2023', wins: 51, losses: 31, points: 131 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Warriors vs Suns', points: 121, outcome: 'Win' },
      { game: 'Warriors vs Nuggets', points: 113, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 120,
      assistsPerGame: 27,
      reboundsPerGame: 43,
    },
  },
},

'Boston Celtics': {
  name: 'Boston Celtics',
  performanceData: [
    { season: '2024', wins: 55, losses: 27, points: 126 },
    { season: '2023', wins: 53, losses: 29, points: 123 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Celtics vs Bucks', points: 119, outcome: 'Win' },
      { game: 'Celtics vs Nets', points: 110, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 116,
      assistsPerGame: 25,
      reboundsPerGame: 46,
    },
  },
},

'Milwaukee Bucks': {
  name: 'Milwaukee Bucks',
  performanceData: [
    { season: '2024', wins: 50, losses: 32, points: 127 },
    { season: '2023', wins: 52, losses: 30, points: 128 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Bucks vs 76ers', points: 124, outcome: 'Win' },
      { game: 'Bucks vs Heat', points: 109, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 121,
      assistsPerGame: 26,
      reboundsPerGame: 47,
    },
  },
},

'Miami Heat': {
  name: 'Miami Heat',
  performanceData: [
    { season: '2024', wins: 45, losses: 37, points: 119 },
    { season: '2023', wins: 44, losses: 38, points: 117 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Heat vs Bulls', points: 115, outcome: 'Win' },
      { game: 'Heat vs Raptors', points: 101, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 112,
      assistsPerGame: 23,
      reboundsPerGame: 44,
    },
  },
},
'Dallas Mavericks': {
  name: 'Dallas Mavericks',
  performanceData: [
    { season: '2024', wins: 49, losses: 33, points: 125 },
    { season: '2023', wins: 42, losses: 40, points: 118 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Mavericks vs Spurs', points: 126, outcome: 'Win' },
      { game: 'Mavericks vs Nuggets', points: 111, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 119,
      assistsPerGame: 24,
      reboundsPerGame: 42,
    },
  },
},

'Phoenix Suns': {
  name: 'Phoenix Suns',
  performanceData: [
    { season: '2024', wins: 46, losses: 36, points: 123 },
    { season: '2023', wins: 45, losses: 37, points: 120 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Suns vs Kings', points: 118, outcome: 'Win' },
      { game: 'Suns vs Lakers', points: 106, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 117,
      assistsPerGame: 25,
      reboundsPerGame: 45,
    },
  },
},

'Denver Nuggets': {
  name: 'Denver Nuggets',
  performanceData: [
    { season: '2024', wins: 54, losses: 28, points: 129 },
    { season: '2023', wins: 53, losses: 29, points: 127 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Nuggets vs Jazz', points: 120, outcome: 'Win' },
      { game: 'Nuggets vs Thunder', points: 108, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 122,
      assistsPerGame: 28,
      reboundsPerGame: 50,
    },
  },
},

'Philadelphia 76ers': {
  name: 'Philadelphia 76ers',
  performanceData: [
    { season: '2024', wins: 48, losses: 34, points: 121 },
    { season: '2023', wins: 50, losses: 32, points: 124 },
  ],
  currentForm: {
    last10Games: [
      { game: '76ers vs Knicks', points: 113, outcome: 'Loss' },
      { game: '76ers vs Pacers', points: 122, outcome: 'Win' },
    ],
    rollingAverages: {
      pointsPerGame: 118,
      assistsPerGame: 26,
      reboundsPerGame: 46,
    },
  },
},

'Chicago Bulls': {
  name: 'Chicago Bulls',
  performanceData: [
    { season: '2024', wins: 40, losses: 42, points: 117 },
    { season: '2023', wins: 38, losses: 44, points: 115 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Bulls vs Pistons', points: 112, outcome: 'Win' },
      { game: 'Bulls vs Heat', points: 108, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 113,
      assistsPerGame: 22,
      reboundsPerGame: 41,
    },
  },
},
'Miami Heat': {
  name: 'Miami Heat',
  performanceData: [
    { season: '2024', wins: 44, losses: 38, points: 116 },
    { season: '2023', wins: 43, losses: 39, points: 114 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Heat vs Celtics', points: 110, outcome: 'Loss' },
      { game: 'Heat vs Hornets', points: 120, outcome: 'Win' },
    ],
    rollingAverages: {
      pointsPerGame: 113,
      assistsPerGame: 24,
      reboundsPerGame: 43,
    },
  },
},

'Boston Celtics': {
  name: 'Boston Celtics',
  performanceData: [
    { season: '2024', wins: 58, losses: 24, points: 132 },
    { season: '2023', wins: 57, losses: 25, points: 130 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Celtics vs Heat', points: 124, outcome: 'Win' },
      { game: 'Celtics vs Nets', points: 116, outcome: 'Win' },
    ],
    rollingAverages: {
      pointsPerGame: 127,
      assistsPerGame: 29,
      reboundsPerGame: 48,
    },
  },
},

'Brooklyn Nets': {
  name: 'Brooklyn Nets',
  performanceData: [
    { season: '2024', wins: 36, losses: 46, points: 112 },
    { season: '2023', wins: 44, losses: 38, points: 117 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Nets vs Hawks', points: 107, outcome: 'Loss' },
      { game: 'Nets vs Celtics', points: 111, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 109,
      assistsPerGame: 21,
      reboundsPerGame: 42,
    },
  },
},

'Golden State Warriors': {
  name: 'Golden State Warriors',
  performanceData: [
    { season: '2024', wins: 47, losses: 35, points: 124 },
    { season: '2023', wins: 44, losses: 38, points: 122 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Warriors vs Suns', points: 121, outcome: 'Win' },
      { game: 'Warriors vs Clippers', points: 119, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 123,
      assistsPerGame: 30,
      reboundsPerGame: 44,
    },
  },
},

'Atlanta Hawks': {
  name: 'Atlanta Hawks',
  performanceData: [
    { season: '2024', wins: 39, losses: 43, points: 114 },
    { season: '2023', wins: 41, losses: 41, points: 116 },
  ],
  currentForm: {
    last10Games: [
      { game: 'Hawks vs Nets', points: 113, outcome: 'Win' },
      { game: 'Hawks vs Bucks', points: 107, outcome: 'Loss' },
    ],
    rollingAverages: {
      pointsPerGame: 115,
      assistsPerGame: 23,
      reboundsPerGame: 42,
    },
  },
},

};

app.get('/api/teams/:teamName', (req, res) => {
  const teamName = decodeURIComponent(req.params.teamName);

  if (teamsData[teamName]) {
    res.json(teamsData[teamName]);
  } else {
    res.status(404).json({ error: "Team not found" });
  }
});


// const option = decodeURIComponent(req.params.option).toLowerCase();

// if (option === 'optimal lineup suggestions') {
//   return res.json([
//     "🔥 Start Nikola Jokic – high assist rate and usage.",
//     "🚀 Add Tyrese Maxey – favorable matchups this week.",
//     "⚠️ Bench Zion Williamson – limited minutes expected."
//   ]);
// } else if (option === 'trading/free agency advice') {
//   return res.json([
//     "📈 Trade for Jaren Jackson Jr. – undervalued in most leagues.",
//     "📉 Drop RJ Barrett – inconsistent performance lately.",
//     "🔄 Swap Myles Turner if you're lacking rebounds/blocks."
//   ]);
// } else {
//   return res.status(404).json({ error: "Invalid fantasy option selected." });
// }
const fantasyRecommendations = {
  "Optimal Lineup Suggestions": [
    "Start Nikola Jokic for consistent double-doubles.",
    "Use Jayson Tatum for balanced scoring and rebounding.",
    "Keep Shai Gilgeous-Alexander for efficient point production."
  ],
  "Trading/Free Agency Advice": [
    "Trade injured stars early to maintain fantasy momentum.",
    "Pick up emerging rookies like Scoot Henderson.",
    "Avoid players with low usage rate despite high minutes."
  ]
};

app.get('/api/fantasy/:option', (req, res) => {
  const { option } = req.params;
  const decodedOption = decodeURIComponent(option);

  const tips = fantasyRecommendations[decodedOption];

  if (!tips) {
    return res.status(404).json({ error: 'No recommendations found for this option.' });
  }

  return res.json(tips);
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend server running at http://localhost:${PORT}`));
