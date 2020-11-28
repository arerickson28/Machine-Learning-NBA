function querySelector(teamNumber) {
    // This function queries the selector to return the team Name for logo files and data.
    let selectElement = document.querySelector(`#team${teamNumber}`);
    let teamName = selectElement.options[selectElement.selectedIndex].value;
    let teamNameFull = selectElement.options[selectElement.selectedIndex].text;

    return {'teamName': teamName, 'teamNameFull': teamNameFull};
}

function getTeamLogo(teamNumber) {
    // This function returns the image file from the team selector by calling the flask endpoint for the image.
    let teamName = querySelector(teamNumber)['teamName'];
    if (teamName === '') {
        return '';
    }
    let imageHTML = `<img id="team${teamNumber}Icon" src="getTeamLogo/${teamName}" alt=${teamName} width="225" height="150"></img>`;
    return imageHTML;
}

function getTeamStats(teamNumber) {
    // This function is a stub until we get the data for real stats.  Hardcoded html for now.
    
    let teamName = querySelector(teamNumber)['teamName'];
    if (teamName === '') {
        return '';
    }

    let teamStats = $.ajax({type: "GET", 
        dataType: 'json',
        url: `/getTeamStats/${teamName}`, 
        async: false}).responseJSON;

    let playerHTML = `<table>
    <tr> <th>Name</th> <th>Age</th> <th>Ht (cm)</th> 
    <th>Wt (kg)</th> <th>College</th> <th>Draft Year</th></tr>`;

    for (i = 0; i < teamStats.length; i++) {
        playerHTML += `<tr>
        <td>${teamStats[i]['player_name']}</td> 
        <td>${teamStats[i]['age']} </td>
        <td>${Math.round(teamStats[i]['player_height'])}</td> 
        <td>${Math.round(teamStats[i]['player_weight'])}</td>
        <td>${teamStats[i]['college']} </td>
        <td>${teamStats[i]['draft_year']} </td>
        </tr>`;
    }

    playerHTML += `</table>`;

    return playerHTML;
}

function getTeamOptionManager(teamNumber) {
    // This function will populate all the html for logo and stats or whatever else we may write.
    document.getElementById(`Team${teamNumber}Logo`).innerHTML = getTeamLogo(teamNumber);
    document.getElementById(`Team${teamNumber}Stats`).innerHTML = getTeamStats(teamNumber);
}

function getTeamInnerHTML(teamNumber) {
    // Initial function to manage the selector and call other functions for data/images
    let teamHTML = `<p><select id="team${teamNumber}" onChange="getTeamOptionManager(${teamNumber})"> ${teamList}</select></p> `;
    return teamHTML;
}

function getWinningTeamLogo(winningName)
    {
        // let teamName = querySelector(teamNumber);

        let winningLogo =  `<img id="winning_team_logo" src="getTeamLogo/${winningName}" alt=${winningName} width="225" height="150"></img>`;
        // "<img src = '#' alt = 'winning team logo will go here'></img>"
        return winningLogo
    }

var predict = d3.select(".button")
predict.on("click", function() 
    {
        let HomeTeam = querySelector(1)['teamName'];
        let VisitingTeam = querySelector(2)['teamName'];

        //Todo: handle exception in the case of no or only one team is selected (be nice)
        //Rearrange webpage

        // var url = `getWinner/${HomeTeam}&${VisitingTeam}`;
        // d3.json(url, function (json) {
        //     console.log(json)
        // });

        let winnerDetails = $.ajax({type: "GET", 
        dataType: 'json',
        url: `/getWinner/${HomeTeam}&${VisitingTeam}`,
        async: false}).responseJSON;

        winningName = winnerDetails["winner"];
        console.log(HomeTeam, VisitingTeam, winningName)

        if (winningName === HomeTeam) {
            teamNumber = 1;
            teamSide = 'home team';
        }

        else {
            teamNumber = 2;
            teamSide = 'visiting team';
        }
        let fullTeamName = querySelector(teamNumber)['teamNameFull'];

        document.getElementById("winning_team_name").innerHTML = `<h2>${fullTeamName}</h2>`;
        document.getElementById("winning_team_logo").innerHTML = getWinningTeamLogo(winningName);
        document.getElementById("homeORvisit").innerHTML = `Congratulations!  The ${teamSide} will win 
            with ${winnerDetails['accuracy']}% accuracy.`;
    });

document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);