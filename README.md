<div align="center">
  
# NBA Fantasy Basketball Assistant

***

🏀 _A full-stack AI application for fantasy basketball enthusiasts._ 🏀

![9ed13d1846a5f262edaea59c29483c02](https://github.com/naishasinha/NBA-Fantasy-Assistant/assets/117387359/b33e4381-c769-42e4-b8f5-d794aebb213b)


***
## Overview 

<div align = "left">
The NBA Fantasy Basketball Assistant is a full-stack AI application designed to provide in-depth analysis and actionable insights for fantasy basketball enthusiasts. Leveraging detailed NBA game statistics, this tool aims to enhance users' decision-making by predicting team performances, analyzing matchups, and offering personalized recommendations.

</div>

## Core Features

<div align = "left">
  
### 📊 Team Performance Analysis
  
→ **Historical Data Insights**: _Analyze historical data over the last nine seasons to predict future team performances._ <br>
→ **Current Form**: _Calculate rolling averages of key statistics over recent games to determine current form and identify trends._

### 🏆 Matchup Analyzer 
→ **Historical Matchup Performance**: _Analyze historical matchups between teams to predict outcomes and evaluate matchup strengths and weaknesses._ <br>
→ **Performance Trends Against Specific Opponents**: _Highlight performance trends against specific types of opponents (e.g., teams with strong defense or high-scoring offenses)._

### 📝 Customizable Recommendations 
→ **User Criteria-Based Recommendations**: _Allow users to prioritize specific statistics and receive tailored recommendations._
</div>

***
## Project Details

### Development Progress:
	
This project is designed for continuous enhancement and improvement. Therefore, a chart has been added to track the development and completion progress of each project element, highlighting the future updates I plan to implement for improvement. <br>


| Component    | Progress |
| -------- | ------- |
| App Interface (Full-Stack) | ✅ Completed UI/UX Design Implementation <br> ✅ Client successfully displays and interacts with server mock data <br> ✅ Seamlessly implements dynamic internal page changes |
| Machine Learning Prediction Model | ✅ Initial model complete with 63% accuracy <br> ⚠️ Working to [improve current accuracy] |
| Integration of ML Results and Pandas Manipulation Data with Server | ⚠️ In Progress |

| 📅 **Current Task** 📅 |
| -------- |
| Develop a JSON file that generates up-to-date performance and matchup analysis based on the mock data format. |

<br>

### Noteworthy Description Files:
<table>
  <tr>
    <th>ML-Model</th>
    <td> 
      <ul>
        <li>
          <strong>ML-Model <a href = "ML-Model/README.md">README.md</a> file: </strong> <br> Provides details and explanations behind the web scraping and predictor model training process
        </li>  
      </ul>
    </td>
  </tr>
  
  <tr>
    <th>Client</th>
    <td>
      <ul>
        <li>
          <strong>Client <a href = "client/README.md">README.md</a> file: </strong> <br> Provides details on navigating and utilizing the React App
        </li>  
      </ul>
    </td>
  </tr>
</table>

<br>

### Full Directory Tree:

<div align="left">

```
nba-fantasy-assistant/
├── ML-model/
│   ├── README.md
│   ├── Create_NBADataset.ipynb   # Code for creating CSVs (Jupyter Notebook)
│   ├── Retrieve_NBAData.ipynb    # Web Scraping Code (Jupyter Notebook)
│   ├── NBA_PredictionModel1.ipynb # Base ML Model
│   ├── nba_data/
│   │   ├── .ipynb_checkpoints/
│   │   ├── scores/               # All individual box scores across seasons
│   │   ├── standings/            # All standings (by month) across seasons
│   │   ├── ...                   # Other miscellaneous csv files
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.css
│   │   │   ├── Header.css
│   │   │   ├── Modal.css
│   │   │   ├── Modal.js
│   │   │   ├── NavButton.css
│   │   │   ├── NavButton.js
│   │   ├── images/               # All images used for app
│   │   ├── pages/
│   │   │   ├── Home.js           # Main (Home) Page
│   │   │   ├── Home.css
│   │   │   ├── TeamPerformanceAnalysis.js
│   │   │   ├── MatchupAnalyzer.js
│   │   │   ├── FantasyRecommendations.js
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   ├── package.json
│   ├── README.md                # React App Explanation  
├── server/
│   ├── index.js
│   ├── package.json
├── README.md                    # Main Project File README
├── LICENSE
```
  
</div>

<br>

### Tech Stack:
<div align="center">
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183914128-3fc88b4a-4ac1-40e6-9443-9a30182379b7.png" alt="Jupyter Notebook" title="Jupyter Notebook"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/192158954-f88b5814-d510-4564-b285-dff7d6400dad.png" alt="HTML" title="HTML"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183898674-75a4a1b1-f960-4ea9-abcb-637170a00a75.png" alt="CSS" title="CSS"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/117447155-6a868a00-af3d-11eb-9cfe-245df15c9f3f.png" alt="JavaScript" title="JavaScript"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183897015-94a058a6-b86e-4e42-a37f-bf92061753e5.png" alt="React" title="React"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183568594-85e280a7-0d7e-4d1a-9028-c8c2209e073c.png" alt="Node.js" title="Node.js"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183859966-a3462d8d-1bc7-4880-b353-e2cbed900ed6.png" alt="Express" title="Express"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/182884177-d48a8579-2cd0-447a-b9a6-ffc7cb02560e.png" alt="mongoDB" title="mongoDB"/></code>
	<code><img width="50" src="https://user-images.githubusercontent.com/25181517/183423507-c056a6f9-1ba8-4312-a350-19bcbc5a8697.png" alt="Python" title="Python"/></code>
</div>

<br>

**Other tools for ML Model:**
`NumPy`
`Pandas`
`Scikit-learn`
`BeautifulSoup`

<br>

### Running the Application:

Main Directory Command: `cd NBA-Fantasy-Assistant`

<div align="left">

#### Front-End
1. Navigate to the `client` directory:

```
cd client
```

2. Install dependencies:

```
npm install
```

3. Start the React App:

```
npm start
```

#### Back-End
1. Navigate to the `server` directory:

```
cd server
```

2. Install dependencies:

```
npm install
```

2. Start the server:

```
node index.js
```

</div>

**Open your browser and go to `http://localhost:3000` to view the application.**

***
#### This project is [licensed](LICENSE) under the `MIT License`.
##### _Copyright (c) 2024 Naisha Sinha_

***
</div>
