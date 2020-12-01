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

    let playerHTML = `<table id = team${teamNumber}Table>
    <tr> <th>Name</th> <th>Age</th> <th>Ht (cm)</th> 
    <th>Wt (kg)</th> <th>College</th> <th>Draft Year</th>
    <th> Input Time to Play</th></tr>`;

    for (i = 0; i < teamStats.length; i++) {
        playerHTML += `<tr>
        <td>${teamStats[i]['player_name']}</td> 
        <td>${teamStats[i]['age']} </td>
        <td>${Math.round(teamStats[i]['player_height'])}</td> 
        <td>${Math.round(teamStats[i]['player_weight'])}</td>
        <td>${teamStats[i]['college']} </td>
        <td>${teamStats[i]['draft_year']} </td>
        <td><input type="number" id="time${i}"></td>
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
        

        if (HomeTeam == ''|| VisitingTeam == '')

                {
                    document.getElementById("TwoTeamsNeeded").innerHTML = `<h2>Please Select Two Teams To Make A Prediction</h2>` ;
                    document.getElementById("winning_team_name").innerHTML = `` ;
                    document.getElementById("winning_team_logo").innerHTML = `` ;
                    document.getElementById("homeORvisit").innerHTML = `` ;

                } else  {
                    // getting results for both teams selected

                    for (z = 1; z<3; z++) {
                    var myTab = document.getElementById(`team${z}Table`);
                    let weightedAge = 0;
                    let weightedHt = 0;
                    let weightedWt= 0;

                    // This is reading the stats selected on the page along with the user input times.
                    for (i = 1; i < myTab.rows.length; i++) {
                        var playerTime = document.getElementById(`time${i-1}`);

                        // Adding up all the time-weighted params
                    
                        var objCells = myTab.rows.item(i).cells;
                        weightedAge += playerTime.value/48*objCells.item(1).innerHTML ;
                        weightedHt += playerTime.value/48*objCells.item(2).innerHTML ;
                        weightedWt += playerTime.value/48*objCells.item(3).innerHTML ;
                    }
                    // If home or visiting team calc the average of each Param.
                    if (z === 1) {
                        homeHeightAvg= weightedHt/5;
                        homeWeightAvg=weightedWt/5;
                        homeAgeAvg=weightedAge/5;
                    } else {
                        visHeightAvg= weightedHt/5;
                        visWeightAvg=weightedWt/5;
                        visAgeAvg=weightedAge/5;
                    }
                }

                    let winnerDetails = $.ajax({type: "GET", 
                    dataType: 'json',
                    url: `/getWinner/${HomeTeam}&${VisitingTeam}&${homeHeightAvg}&${homeWeightAvg}
                    &${homeAgeAvg}&${visHeightAvg}&${visWeightAvg}&${visAgeAvg}`,
                    async: false}).responseJSON;

            
                    winningName = winnerDetails["winner"];
            
                    if (winningName === HomeTeam) {
                        teamNumber = 1;
                        teamSide = 'home team';
                    } else {
                        teamNumber = 2;
                        teamSide = 'visiting team';
                    }

                    let fullTeamName = querySelector(teamNumber)['teamNameFull'];

                    document.getElementById("TwoTeamsNeeded").innerHTML = `` ;
                    document.getElementById("winning_team_name").innerHTML = `<h2>${fullTeamName}</h2>`;
                    document.getElementById("winning_team_logo").innerHTML = getWinningTeamLogo(winningName);
                    document.getElementById("homeORvisit").innerHTML = `Congratulations!  The ${teamSide} will win 
                        with ${Math.round(winnerDetails['accuracy'])}% accuracy.`;
                }
    });

document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);