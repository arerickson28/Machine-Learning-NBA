from flask import current_app as app
from flask import render_template, Flask, jsonify, redirect, send_file
import pandas as pd
import json
from tensorflow.keras.models import load_model
from pickle import load

# Setup Flask Local Serve
app = Flask(__name__)


@app.route('/')
def home():
    """Landing page."""
    return render_template("index.html",
                           title="NBA Game Predictor",
                           description="Predict matchups from your favorite NBA teams")

@app.route('/team')
def team():
    """Team page."""
    return render_template("team.html")

@app.route('/getTeamLogo/<teamName>')
def return_team_logo(teamName):
    """Returns the team logo when called from the javascript file"""
    return send_file(f'icons/{teamName}.gif', mimetype='image/gif')


@app.route('/getTeamStats/<teamName>')
def return_team_stats(teamName):
    """Returns the team Stats when called from the javascript file"""
    teamFile = pd.read_csv('data/NBAPlayerAges.csv')

    teamPlayers = teamFile[(teamFile['season'] == '2019-20') & (teamFile['team_abbreviation'] == f'{teamName}')]
    teamPlayers= teamPlayers.drop(columns = 'Unnamed: 0')

    player_stats = teamPlayers.to_json(orient = "records")
    parsed = json.loads(player_stats)
    team_json = json.dumps(parsed, indent=4) 

    return  team_json


@app.route('/getWinner/<homeTeam>&<visitingTeam>')
def getWinner(homeTeam, visitingTeam):

    # TODO:  Cynthia and Ali will write code to take team abbreviations, and get Stats, load model, pass stats into model, and return
    # and object containing, winner (char(3)), (Accuracy)
    # {'winner': 'BOS', 'accuracy': 0.92763845297436592743659723645}

    # Load csv
    teamFile = pd.read_csv('data/NBAPlayerAges.csv')
    teamFile.drop(columns = 'Unnamed: 0', inplace=True)
    
    # Filter on season and team abbrevs
    home_team = teamFile[(teamFile['season'] == '2019-20') & (teamFile['team_abbreviation'] == f'{homeTeam}')]
    visiting_team = teamFile[(teamFile['season'] == '2019-20') & (teamFile['team_abbreviation'] == f'{visitingTeam}')]
    print(home_team)
    print(visiting_team)

    # Taking the mean of the all the put of home team and visiting team
    homeTeamAvg = home_team.mean()
    visitTeamAvg = visiting_team.mean()

    # Defining the data row to be input for model
    homeHeightAvg = homeTeamAvg['player_height']
    homeWeightAvg = homeTeamAvg['player_weight']
    homeAgeAvg = homeTeamAvg['age']
    visHeightAvg = visitTeamAvg['player_height']
    visWeightAvg = visitTeamAvg['player_weight']
    visAgeAvg = visitTeamAvg['age']

    dictRow = {'homeTeamHeightAverage': homeHeightAvg, 'homeTeamWeightAverage': homeWeightAvg,
                'homeTeamAgeAverage': homeAgeAvg, 'visitorTeamHeightAverage': visHeightAvg,
                'visitorTeamWeightAverage': visWeightAvg, 'visitorTeamAgeAverage': visAgeAvg}

    # Turn this into data frame
    predict_this_df = pd.DataFrame([dictRow])
    data_row = predict_this_df.iloc[0].values
    reshape_datarow = data_row.reshape(1, -1)

    # Load the model
    model = load_model('model/saved_deep_neural_game.h5')
    # Load scaler for the model
    scaler = load(open('model/scaler.pkl', 'rb'))

    # transform the test dataset
    X_test_scaled = scaler.transform(reshape_datarow)

    # Evaluate the model using the training data
    predictions = model.predict(X_test_scaled)
    predictions_round = model.predict(X_test_scaled).round()
    print(f'Predictions: {predictions}')
    print(f'Predictions rounded: {predictions_round}')

    # if first index is 0, home team wins, if first index is 1, home team loss
    homeTeamOutcome = predictions_round[0][0] 
    winner = ''
    print(f'homeTeamOutcome variable: {homeTeamOutcome}')

    if homeTeamOutcome == 0.0:
        winner = homeTeam
        print(f'Home team wins: {winner}')
    else:
        winner = visitingTeam
        print(f'Visitor team wins: {winner}')

    # Gives the higher probability as output
    probability_first = predictions[0][0]
    probability_second = predictions[0][1]
    print(f'Probability first: {probability_first}')
    print(f'Probability second: {probability_second}')

    if probability_first < probability_second:
        accuracy = probability_second
        print(f'Accuracy: {accuracy}')
    else:
        accuracy = probability_first
        print(f'Accuracy: {accuracy}')

    accuracyRounded = round(accuracy,2) *100
    # Return it the way JASON WANTS IT
    return {'winner': winner, 'accuracy': accuracyRounded}

@app.route('/favicon')
def favicon():
    """Returns the site favicon"""
    return send_file(f'icons/basketball.png', mimetype='image/gif')

if __name__ == "__main__":
    app.run(debug=True)