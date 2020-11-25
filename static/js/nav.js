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
    let imageHTML = `<img id="team${teamNumber}Icon" src="getTeamLogo/${teamName}" alt=${teamName} width="300" height="200"></img>`
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
    <select id="team${teamNumber}" onChange="getTeamOptionManager(${teamNumber})"> ${teamList}</select> 
    </p> `
    return teamHTML
}
document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);