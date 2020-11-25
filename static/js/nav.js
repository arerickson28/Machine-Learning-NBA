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
    let imageHTML = `<img id="team${teamNumber}Icon" src="getTeamLogo/${teamName}" alt=${teamName} width="225" height="150"></img>`
    return imageHTML;
}

function getTeamStats(teamNumber) {
    // This function is a stub until we get the data for real stats.  Hardcoded html for now.
    
    teamName = querySelector(teamNumber)
    if (teamName === '') {
        return ''
    }


    // This is where I am having trouble with variable Scope.  I cannot get teamStats populated to the for loop
    // below.  I get one iteration behind.  I know it is global in scope but I cannot figure out how to return
    // a local variable within this function.  Site ServiceWorkerMessageEvent, but is always one selection in behind.
    
    d3.json(`/getTeamStats/${teamName}`).then(function (data) {
        teamStats = data;
        console.log(teamStats)
    })

    playerHTML = ``
    for (i = 0; i < teamStats.length; i++) {
        playerHTML += `${teamStats[i]['player_name']}, ${teamStats[i]['age']} 
        - ${Math.round(teamStats[i]['player_height'])}cm; ${Math.round(teamStats[i]['player_weight'])}kg. <br>`

    }
    return playerHTML;
}

function getTeamOptionManager(teamNumber) {
    // This function will populate all the html for logo and stats or whatever else we may write.
    document.getElementById(`Team${teamNumber}Logo`).innerHTML = getTeamLogo(teamNumber);
    document.getElementById(`Team${teamNumber}Stats`).innerHTML = getTeamStats(teamNumber);
    // Add more stats stuff here
}

function getTeamInnerHTML(teamNumber) {
    // Initial function to manage the selector and call other functions for data/images
    let teamHTML = `<p><select id="team${teamNumber}" onChange="getTeamOptionManager(${teamNumber})"> ${teamList}</select></p> `
    return teamHTML
}
document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);