<div align="center">

# Predictor Model: Details
  
</div>

***
## NBA Data Web Scraping:
**Basketball Data Source:** https://www.basketball-reference.com <br>
**Year Timeline**: 2015-16 till 2023-24 NBA Season (9 seasons) <br> <br>
For ML model training, it is best to use as many data points and datasets (season years) as possible for optimal accuracy. 
However, given the nature of the game, I had to also consider the relevance of the timeframe I was choosing (ex. a game from 20 years ago would not be relevant to predict a game from this year).
Using both technical research and my knowledge of the game, I decided to keep the [2015 - 2016 NBA Season](https://www.nba.com/news/history-season-review-2015-16) as the starting point of my web scraping as it marks several key trends and shifts in the NBA that are relevant to modern basketball, including:

- **Three-Point Revolution**: The emphasis on three-point shooting and "spreading the floor out" became much more pronounced around this time, largely influenced by the success of Stephen Curry and the Golden State Warriors in the 2014-15 season.
- **Advanced Metrics**: Increased reliance on advanced metrics and analytics to guide team strategies and player evaluations.
- **Player Mobility**: Greater player movement through free agency and trades, leading to the formation of super teams and significant shifts in team dynamics.
- **Rule Changes**: Various rule changes aimed at increasing the pace of the game and scoring.

***
## Machine Learning Model Training:

As of now, my base model has an accuracy of 63% using data from over 23,000+ games. My next steps to increase accuracy are: (1) use xgboost and/or random forest classifier, which is generally more powerful than ridge regression, (2) experiment with the different feature numbers, (3) utilize the backwards feature selector rather than forward.
***

I would like to credit Dataquest on YouTube for ML and web-scraping related lessons, which helped me gain a better understanding of developing the model.
