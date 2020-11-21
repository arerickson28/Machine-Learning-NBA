let teamList = `
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

function getTeamOption(teamNumber) {
    selectElement = document.querySelector(`#team${teamNumber}`);

    output = selectElement.options[selectElement.selectedIndex].value;
    let teamImage = `../icons/${output}.gif`

    // this line can be replaced when we have stats
    document.querySelector(`#output${teamNumber}`).textContent = output;

    let imageHTML = `<img id="team${teamNumber}Icon" src="icons/${output}.gif" alt=${output} width="304" height="228"></img>`
    document.getElementById(`Team${teamNumber}Logo`).innerHTML = imageHTML;
}

function getTeamInnerHTML(teamNumber) {
    let teamHTML = `<p> Select a team 
    <select id="team${teamNumber}" onfocusout="getTeamOption(${teamNumber})"> ${teamList}</select> 
    </p> 
    
    <p> 
    Insert Team Stats here:  
    <span id="output${teamNumber}"></span> 
    </p>`
    return teamHTML
}

document.getElementById('Team1Selector').innerHTML = getTeamInnerHTML(1);
document.getElementById('Team2Selector').innerHTML = getTeamInnerHTML(2);