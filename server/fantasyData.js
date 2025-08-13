// server/fantasyData.js

const fantasyTips = {
  "Optimal Lineup Suggestions": [
    "Start your top scorers regardless of matchup.",
    "Look for high pace games to exploit offensive stats.",
    "Avoid players on back-to-backs due to rest concerns.",
    "Start players facing weaker defenses.",
    "Use dual-position players for lineup flexibility.",
  ],
  "Trading/Free Agency Advice": [
    "Trade for underperforming stars before they bounce back.",
    "Watch injury reports for waiver wire steals.",
    "Sell high on players who are overachieving unsustainably.",
    "Pick up role players getting increased minutes.",
    "Avoid trading for players with long-term injury risks.",
  ],
};

function getRandomTips(option) {
  const tips = fantasyTips[option];
  if (!tips) return [];
  const shuffled = [...tips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

module.exports = { getRandomTips };
