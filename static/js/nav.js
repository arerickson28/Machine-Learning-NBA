function querySelector(teamNumber) {
    // This function queries the selector to return the team Name for logo files and data.
    let selectElement = document.querySelector(`#team${teamNumber}`);
    let teamName = selectElement.options[selectElement.selectedIndex].value;
    let teamNameFull = selectElement.options[selectElement.selectedIndex].text;

    return { 'teamName': teamName, 'teamNameFull': teamNameFull };
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

    let teamStats = $.ajax({
        type: "GET",
        dataType: 'json',
        url: `/getTeamStats/${teamName}`,
        async: false
    }).responseJSON;

    let playerHTML = `<br><table id = team${teamNumber}Table class="table">
    <tr> <th>Name</th> <th>Age</th> <th>Ht (cm)</th> 
    <th>Wt (kg)</th> <th>College</th> <th>Draft Year</th>
    <th id="playtime${teamNumber}">Input time (min)</th></tr>`;

    for (i = 0; i < teamStats.length; i++) {
        playerHTML += `<tr>
        <td>${teamStats[i]['player_name']}</td> 
        <td>${teamStats[i]['age']} </td>
        <td>${Math.round(teamStats[i]['player_height'])}</td> 
        <td>${Math.round(teamStats[i]['player_weight'])}</td>
        <td>${teamStats[i]['college']} </td>
        <td>${teamStats[i]['draft_year']} </td>
        <td><input type="float" id="time${teamNumber}-${i}" class="inputClass"></td>
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

function getWinningTeamLogo(winningName) {
    // let teamName = querySelector(teamNumber);

    let winningLogo = `<img id="winning_team_logo" src="getTeamLogo/${winningName}" alt=${winningName} width="225" height="150"></img>`;
    // "<img src = '#' alt = 'winning team logo will go here'></img>"
    return winningLogo
}



function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}

function bounce(timeFraction) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}



var predict = d3.select(".button")
predict.on("click", function () {
    errors = document.getElementById("MinutesNeeded").innerHTML;

    if (errors !== '') {

        document.getElementById("TwoTeamsNeeded").innerHTML = `<h3>Please Fix your errors in red below</h3>`;
        document.getElementById("winning_team_name").innerHTML = ``;
        document.getElementById("winning_team_logo").innerHTML = ``;
        document.getElementById("homeORvisit").innerHTML = ``;
    } else {

        let HomeTeam = querySelector(1)['teamName'];
        let VisitingTeam = querySelector(2)['teamName'];

        console.log("hey hey you you")

        let to = field1.clientHeight - ball1.clientHeight;

        animate({
            duration: 2000,
            timing: makeEaseOut(bounce),
            draw(progress) {
                ball1.style.top = to * progress + 'px'
            }
        });

        let too = field2.clientHeight - ball2.clientHeight;

        animate({
            duration: 2000,
            timing: makeEaseOut(bounce),
            draw(progress) {
                ball2.style.top = too * progress + 'px'
            }
        });

        if (HomeTeam == '' || VisitingTeam == '') {
            document.getElementById("TwoTeamsNeeded").innerHTML = `<h3>Please Select Two Teams To Make A Prediction</h3>`;
            document.getElementById("winning_team_name").innerHTML = ``;
            document.getElementById("winning_team_logo").innerHTML = ``;
            document.getElementById("homeORvisit").innerHTML = ``;

        } else {
            // getting results for both teams selected

            for (z = 1; z < 3; z++) {
                var myTab = document.getElementById(`team${z}Table`);
                let weightedAge = 0;
                let weightedHt = 0;
                let weightedWt = 0;

                // This is reading the stats selected on the page along with the user input times.
                for (i = 1; i < myTab.rows.length; i++) {
                    var playerTime = document.getElementById(`time${z}-${i - 1}`);

                    // Adding up all the time-weighted params

                    var objCells = myTab.rows.item(i).cells;
                    weightedAge += playerTime.value / 48 * objCells.item(1).innerHTML;
                    weightedHt += playerTime.value / 48 * objCells.item(2).innerHTML;
                    weightedWt += playerTime.value / 48 * objCells.item(3).innerHTML;
                }
                // If home or visiting team calc the average of each Param.
                if (z === 1) {
                    homeHeightAvg = weightedHt / 5;
                    homeWeightAvg = weightedWt / 5;
                    homeAgeAvg = weightedAge / 5;
                } else {
                    visHeightAvg = weightedHt / 5;
                    visWeightAvg = weightedWt / 5;
                    visAgeAvg = weightedAge / 5;
                }
            }

            let winnerDetails = $.ajax({
                type: "GET",
                dataType: 'json',
                url: `/getWinner/${HomeTeam}&${VisitingTeam}&${homeHeightAvg}&${homeWeightAvg}
                    &${homeAgeAvg}&${visHeightAvg}&${visWeightAvg}&${visAgeAvg}`,
                async: false
            }).responseJSON;

            winningName = winnerDetails["winner"];

            if (winningName === HomeTeam) {
                teamNumber = 1;
                teamSide = 'home team';
            } else {
                teamNumber = 2;
                teamSide = 'visiting team';
            }

            let fullTeamName = querySelector(teamNumber)['teamNameFull'];
            // If time is not entered for each team, warn the user
            if (document.getElementById("playtime1").innerHTML == 'Input time (min)' || document.getElementById("playtime2").innerHTML == 'Input time (min)') {
                document.getElementById("TwoTeamsNeeded").innerHTML = `<h3>Please input the time for the players</h3>`;
            }
            else {
                document.getElementById("TwoTeamsNeeded").innerHTML = ``;
                document.getElementById("winning_team_name").innerHTML = `<h2>${fullTeamName}</h2>`;
                document.getElementById("winning_team_logo").innerHTML = getWinningTeamLogo(winningName);
                document.getElementById("homeORvisit").innerHTML = `Congratulations!  The ${teamSide} will win 
                        with ${Math.round(winnerDetails['accuracy'])}% accuracy.`;
            }
        }
    }
});

document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);


document.body.addEventListener('focusout', function (evt) {
    if (evt.target.className === 'inputClass') {
        var myTab1 = document.getElementById(`team1Table`);
        totalPlayerTime1 = 0;
        var myTab2 = document.getElementById(`team2Table`);
        totalPlayerTime2 = 0;

        document.getElementById("TwoTeamsNeeded").innerHTML = ``;
        if (!myTab1 || !myTab2) {
            document.getElementById("TwoTeamsNeeded").innerHTML = `<h3>Please Select Two Teams When Entering Time</h3>`;
        }

        if (myTab1) {
            for (i = 1; i < myTab1.rows.length; i++) {
                rowTime1 = document.getElementById(`time1-${i - 1}`).value;
                rowTime1 = rowTime1 || 0;
                if (rowTime1 > 48 || rowTime1 < 0) {
                    document.getElementById(`time1-${i - 1}`).style.borderColor = 'red';
                }
                if (rowTime1 <= 48 & rowTime1 >= 0) {
                    document.getElementById(`time1-${i - 1}`).style.borderColor = 'grey';
                }
                totalPlayerTime1 += parseFloat(rowTime1);
            }
        }

        if (myTab2) {
            for (i = 1; i < myTab2.rows.length; i++) {
                rowTime2 = document.getElementById(`time2-${i - 1}`).value;
                rowTime2 = rowTime2 || 0;
                if (rowTime2 > 48 || rowTime2 < 0) {
                    document.getElementById(`time2-${i - 1}`).style.borderColor = 'red';
                }
                if (rowTime2 <= 48 & rowTime1 >= 0) {
                    document.getElementById(`time2-${i - 1}`).style.borderColor = 'grey';
                }

                totalPlayerTime2 += parseFloat(rowTime2);
            }
        }

        document.getElementById('playtime1').innerHTML = `Input time (${totalPlayerTime1} min)`;
        document.getElementById('playtime2').innerHTML = `Input time (${totalPlayerTime2} min)`;

        // Warn the user to add up the input time to 240 for each team
        document.getElementById("MinutesNeeded").innerHTML = ``;
        if (totalPlayerTime1 != 240) {
            document.getElementById("MinutesNeeded").innerHTML = `<h3 class='text-left'>⊲Please make sure the minutes are added up to 240</h3>`;
            document.getElementById('playtime1').innerHTML = `<div class="time">Input time (${totalPlayerTime1} min)</div>`;
        }

        if (totalPlayerTime2 != 240) {
            document.getElementById("MinutesNeeded").innerHTML = `<h3 class='text-right'>Please make sure the minutes are added up to 240⊳</h3>`;
            document.getElementById('playtime2').innerHTML = `<div class="time">Input time (${totalPlayerTime2} min)</div>`;

        }

        if (totalPlayerTime1 != 240 && totalPlayerTime2 != 240) {
            document.getElementById("MinutesNeeded").innerHTML = `<h3>⊲Please make sure the minutes are added up to 240⊳</h3>`;
            document.getElementById('playtime2').innerHTML = `<div class="time">Input time (${totalPlayerTime2} min)</div>`;

        }

    }

}, false);

// Add Bloopers!
function bloopFunc() {
    var b1 = document.getElementById("blooper1");
    b1.innerHTML = `<p class="card-text" onclick="unclick()">Know your place, peasant!</p>`;

    var b2 = document.getElementById("blooper2");
    b2.innerHTML = `<p class="card-text" onclick="unclick()">Bow down before me, you fool!</p>`;

    var b3 = document.getElementById("blooper3");
    b3.innerHTML = `<p class="card-text" onclick="unclick()">Hold your tongue, imbecile!</p>`;

    var b4 = document.getElementById("blooper4");
    b4.innerHTML = `<p class="card-text" onclick="unclick()">I will not tolerate you savages!</p>`;
}

function unclick() {
    document.getElementById("blooper1").innerHTML = ``;
    document.getElementById("blooper2").innerHTML = ``;
    document.getElementById("blooper3").innerHTML = ``;
    document.getElementById("blooper4").innerHTML = ``;
}
