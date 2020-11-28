let teamList = `<option value=""></option> 
<option value="AtlantaHawks">Atlanta Hawks</option> 
<option value="BostonCeltics">Boston Celtics</option> 
<option value="BrooklynNets">Brooklyn Nets</option> 
<option value="CharlotteHornets">Charlotte Hornets</option> 
<option value="ChicagoBulls">Chicago Bulls</option> 
<option value="ClevelandCavaliers">Cleveland Cavaliers</option> 
<option value="DallasMavericks">Dallas Mavericks</option> 
<option value="DenverNuggets">Denver Nuggets</option> 
<option value="DetroitPistons">Detroit Pistons</option> 
<option value="GoldenStateWarriors">Golden State Warriors</option> 
<option value="HoustonRockets">Houston Rockets</option> 
<option value="IndianaPacers">Indiana Pacers</option> 
option value="LosAngelesClippers">Los Angeles Clippers</option> 
<option value="LosAngelesLakers">Los Angeles Lakers</option> 
<option value="MemphisGrizzlies">Memphis Grizzlies</option> 
<option value="MiamiHeat">Miami Heat</option> 
<option value="MilwaukeeBucks">Milwaukee Bucks</option> 
<option value="MinnesotaTimberwolves">Minnesota Timberwolves</option> 
<option value="NewOrleansPelicans">New Orleans Pelicans</option> 
<option value="NewYorkKnicks">New York Knicks</option> 
<option value="OklahomaCityThunder">Oklahoma City Thunder</option> 
<option value="OrlandoMagic">Orlando Magic</option> 
<option value="Philadelphia76ers">Phildelphia 76ers</option> 
<option value="PhoenixSuns">Phoenix Suns</option> 
<option value="PortlandTrailBlazers">Portland Trail Blazers</option> 
<option value="SacramentoKings">Sacramento Kings</option> 
<option value="SanAntonioSpurs">San Antonio Spurs</option> 
<option value="TorontoRaptors">Toronto Raptors</option> 
<option value="UtahJazz">Utah Jazz</option> 
<option value="WashingtonWizards">Washington Wizards</option>`

function querySelector(teamNumber) {
    // This function queries the selector to return the team Name for logo files and data.
    selectElement = document.querySelector(`#team${teamNumber}`);
    teamName = selectElement.options[selectElement.selectedIndex].value;
    return teamName
}

function getTeamLogo(teamNumber) {
    // This function returns the image file from the team selector by calling the flask endpoint for the image.
    teamName = querySelector(teamNumber)
    if (teamName === '') {
        return ''
    }
    let imageHTML = `<img id="team${teamNumber}Icon" src="icons/${teamName}.gif" alt=${teamName} width="300" height="200"></img>`
    return imageHTML;
}

function getTeamStats(teamNumber) {
    // This function is a stub until we get the data for real stats.  Hardcoded html for now.
    teamName = querySelector(teamNumber)
    if (teamName === '') {
        return ''
    }
    let teamStatsHTML = `<br><stats will be entered here.  Using this 'teamName' to call data source when
        ready.  <br><br><h3> Sample Stats:</h3> <h4>Team Roster:<br><br></h4>Ali "the monster" Anderson - Center
        <br> Rhyce "cake" Erickson - Forward
        <br> Cynthia "bubble tea" Kunakom - Guard
        <br> json - Floor polisher`
    return teamStatsHTML;
}

function getTeamOptionManager(teamNumber) {
    // This function will populate all the html for logo and stats or whatever else we may write.
    document.getElementById(`Team${teamNumber}Logo`).innerHTML = getTeamLogo(teamNumber);
    document.getElementById(`Team${teamNumber}Stats`).innerHTML = getTeamStats(teamNumber);
    // Add more stats stuff here
}

function getTeamInnerHTML(teamNumber) {
    // Initial function to manage the selector and call other functions for data/images
    let teamHTML = `<p> Select a team 
    <select id="team${teamNumber}" onfocusout="getTeamOptionManager(${teamNumber})"> ${teamList}</select> 
    </p> `
    return teamHTML
}

// Rhyce's code

function getWinningTeamName()
    {
        let winner = "<h3>winning team name will go here</h3>"
        return winner
    }

function getWinningTeamLogo()
    {
        let winningLogo =  "<img src = '#' alt = 'winning team logo will go here'></img>"
        return winningLogo
    }


var predict = d3.select(".button")
predict.on("click", function() 
    {
        console.log("The predict button has been clicked")
        document.getElementById("winning_team_name").innerHTML = getWinningTeamName()
        document.getElementById("winning_team_logo").innerHTML = getWinningTeamLogo()
    });

// End Rhyce's code

document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);

