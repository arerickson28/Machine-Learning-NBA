# Machine-Learning-NBA
## UMN Data Visualization &amp; Analytics Bootcamp: Final Project  

For our final project, we use National Basketball Association player and team statistic data to explore machine learning concepts.  

### Purpose:  
To predict the outcome of basketball games using parameters such as player height, weight, age, and time spent contributing to game.  

### Project involves:  
* Datawork (Python)
  * API calls to https://www.balldontlie.io/#getting-started to retrieve data  
  * Kaggle CSV: https://www.kaggle.com/justinas/nba-height-and-weight-analysis
  * Cleaning Data  
  * Choosing data parameters for use in machine learning models  
    * Chosen: Player height, weight, and age weighted by playtime in game
  * Preparing a final dataset suitable for a Machine Learning Algorithm
  * Saving data to CSV

* Developing Machine Learning Models
  * Choosing models  
    * Chosen: Deep Neural Network
  * Training model  
  * Testing model  
  * Saving model and scaler (Pickle)

* Website Design  
  * Setting up Flask Server (Python)
  * HTML
  * CSS  
  * Javascript  
    * Calls Flask server to retrieve player stats and run machine learning model
    * User can create their own hypothetical match up and run the team stats through our model to predict a winner!
  * Hosting Website on Heroku
  
**INSTRUCTIONS**
  1. Clone this repository
  2. Navigate to the main project folder in a terminal
  3. Run `python app.py`
  4. Navigate to 127.0.0.1/5000 in your Chrome browser
  5. Follow instructions on the page and predict a winner!
  
We hope you have a BALL:basketball: playing around with our website!
  
  

