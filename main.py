from flask import current_app as app
from flask import render_template, Flask, jsonify, redirect, send_file
import pandas as pd
import json

# Setup Flask Local Serve
app = Flask(__name__)


@app.route('/')
def home():
    """Landing page."""
    return render_template("index.html",
                           title="NBA Game Predictor",
                           description="Predict matchups from your favorite NBA teams")


# Use the <qid> as the param if needed.  Not sure how many endpoint we will need yet
@app.route('/data_api')
def data_api():
    """Put DocStrings in here"""
    return None


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

@app.route('/favicon')
def favicon():
    """Returns the site favicon"""
    return send_file(f'icons/basketball.png', mimetype='image/gif')

if __name__ == "__main__":
    app.run(debug=True)
