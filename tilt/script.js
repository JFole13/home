function fetchSports(sport){
    
    let sportParameter

    if(sport == 'nfl'){
        sportParameter = 'americanfootball_nfl'
    }else if(sport == 'ncaaf'){
        sportParameter = 'americanfootball_ncaaf'
    }else if(sport == 'nhl'){
        sportParameter = 'icehockey_nhl'
    }else{
        sportParameter = 'americanfootball_nfl'
    }

    document.getElementById('bottom-container').innerHTML =''

    let request = new Request(' https://api.the-odds-api.com/v4/sports/' + sportParameter + 
    '/odds/?apiKey=ba16d4f2dce32fba348781944c768fc2&regions=us&markets=h2h%2Cspreads%2Ctotals&oddsFormat=american')

    fetch(request, {
        method: 'get'
    }).then(function(response) {
        return response.json()
    }).then(function(j) {
        console.log(j)
        generateGameContainers(j)
    }).catch(function(err) {
        console.log('error: ' + err.stack)
    })
}

//let sportsname = 'nhl'
let sportsname = 'nfl'
//let sportsname = 'ncaaf'

fetchSports(sportsname)

function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {

      x.style.display = "block";
      x.style.transition = "all 2s ease"
    }
  }

function generateGameContainers(data){
    for(let i = 0; i < data.length; i++){
        let gameContainer = document.createElement('div')
        gameContainer.id = 'game-container-' + i
        document.getElementById('bottom-container').appendChild(gameContainer)
        gameContainer.classList.add('game-container')

        let awayTeamNameContainer = document.createElement('div')
        awayTeamNameContainer.id = 'away-team-name-container-' + i
        document.getElementById('game-container-' + i).appendChild(awayTeamNameContainer)
        awayTeamNameContainer.classList.add('team-name-container')

        let awayTeamSpreadContainer = document.createElement('div')
        awayTeamSpreadContainer.id = 'away-team-spread-container-' + i
        document.getElementById('game-container-' + i).appendChild(awayTeamSpreadContainer)
        awayTeamSpreadContainer.classList.add('away-team-spread-container')

        let overTotalContainer = document.createElement('div')
        overTotalContainer.id = 'over-total-container-' + i 
        document.getElementById('game-container-' + i).appendChild(overTotalContainer)
        overTotalContainer.classList.add('over-total-container')

        let awayTeamMoneylineContainer = document.createElement('div')
        awayTeamMoneylineContainer.id = 'away-team-moneyline-container-' + i
        document.getElementById('game-container-' + i).appendChild(awayTeamMoneylineContainer)
        awayTeamMoneylineContainer.classList.add('away-team-moneyline-container')

        let homeTeamNameContainer = document.createElement('div')
        homeTeamNameContainer.id = 'home-team-name-container-' + i
        document.getElementById('game-container-' + i).appendChild(homeTeamNameContainer)
        homeTeamNameContainer.classList.add('team-name-container')

        let homeTeamSpreadContainer = document.createElement('div')
        homeTeamSpreadContainer.id = 'home-team-spread-container-' + i
        document.getElementById('game-container-' + i).appendChild(homeTeamSpreadContainer)
        homeTeamSpreadContainer.classList.add('home-team-spread-container')

        let underTotalContainer = document.createElement('div')
        underTotalContainer.id = 'under-total-container-' + i
        document.getElementById('game-container-' + i).appendChild(underTotalContainer)
        underTotalContainer.classList.add('under-total-container')

        let homeTeamMoneylineContainer = document.createElement('div')
        homeTeamMoneylineContainer.id = 'home-team-moneyline-container-' + i
        document.getElementById('game-container-' + i).appendChild(homeTeamMoneylineContainer)
        homeTeamMoneylineContainer.classList.add('home-team-moneyline-container')
    }

    populateGames(data)

}

function populateGames(data){
    let isHome = false
    let draftKingsIndex;

    for(let i = 0; i < data.length; i++){
        let isHome = false;

        let awayPicture = document.createElement('img')
        let awayName = document.createElement('p')
        awayPicture.src = 'images/' + getPicture(i, isHome, data) + '.svg'
        awayName.innerHTML = abbreviateStates(i, isHome, data)
        document.getElementById('away-team-name-container-' + i).appendChild(awayPicture)
        document.getElementById('away-team-name-container-' + i).appendChild(awayName)


        let awaySpread = document.createElement('p')
        let awaySpreadOdds = document.createElement('p')

        //checks if draftkings is available
        for(let j = 0; j < data[i].bookmakers.length; j++){
            if(data[i].bookmakers[j].key == 'draftkings'){
                draftKingsIndex = j
                break
            }else{
                draftKingsIndex = null
            }
        } 

        
        let spreadsIndex

        // makes sure draftkings is available 
        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

            // finds index of spread market (if any)
            for(let j = 0; j < data[i].bookmakers[draftKingsIndex].markets.length; j++){
                if(data[i].bookmakers[draftKingsIndex].markets[j].key == 'spreads'){
                    spreadsIndex = j;
                }
            }

            // if spreads exists
            if(spreadsIndex != undefined){

                // Outcome value flips so this is to check the current team and match its odds
                if(data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].name == data[i].away_team){
                    awaySpread.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].point
                    awaySpreadOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].price
                }else{
                    awaySpread.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[1].point
                    awaySpreadOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[1].price
                }
            }else{
                awaySpread.innerHTML = 'N/A'
                awaySpreadOdds.innerHTML = 'N/A'
            }

            if(awaySpread.innerHTML > 0){
                awaySpread.innerHTML = '+' + awaySpread.innerHTML
            }

        }else{
            awaySpread.innerHTML = 'N/A'
            awaySpreadOdds.innerHTML = 'N/A'
        }
       

        awaySpreadOdds.classList.add('odds')
        document.getElementById('away-team-spread-container-' + i).appendChild(awaySpread)
        document.getElementById('away-team-spread-container-' + i).appendChild(awaySpreadOdds)

        let overTotal = document.createElement('p')
        let overOdds = document.createElement('p')
        let totalsIndex
        // makes sure draftkings is available 
        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

             // finds index of total market (if any)
            for(let j = 0; j < data[i].bookmakers[draftKingsIndex].markets.length; j++){
                if(data[i].bookmakers[draftKingsIndex].markets[j].key == 'totals'){
                    totalsIndex = j;
                }
            }
            
            if(totalsIndex != undefined){
                overTotal.innerHTML = 'o' + data[i].bookmakers[draftKingsIndex].markets[totalsIndex].outcomes[0].point
                overOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[totalsIndex].outcomes[0].price
            }else{
                overTotal.innerHTML = 'N/A'
                overOdds.innerHTML = 'N/A'
            }

            if(overOdds.innerHTML > 0){
                overOdds.innerHTML = '+' + overOdds.innerHTML
            }

        }else{
            overTotal.innerHTML = 'N/A'
            overOdds.innerHTML = 'N/A'
        }

        overOdds.classList.add('odds')
        document.getElementById('over-total-container-' + i).appendChild(overTotal)
        document.getElementById('over-total-container-' + i).appendChild(overOdds)

        let awayMoneyline = document.createElement('p')
        let moneylineIndex

        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

            // finds index of ml market (if any)
            for(let j = 0; j < data[i].bookmakers[draftKingsIndex].markets.length; j++){
                if(data[i].bookmakers[draftKingsIndex].markets[j].key == 'h2h'){
                    moneylineIndex = j;
                }
            }

            if(moneylineIndex != undefined){
                if(data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[0].name == data[i].away_team){
                    awayMoneyline.innerHTML = data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[0].price
                }else{
                    awayMoneyline.innerHTML = data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[1].price
                }
            }else{
                awayMoneyline.innerHTML = 'N/A'
            }

            if(awayMoneyline.innerHTML > 0){
                awayMoneyline.innerHTML = '+' + awayMoneyline.innerHTML
            }

        }else{
            awayMoneyline.innerHTML = 'N/A'
        }

        awayMoneyline.classList.add('odds')
        document.getElementById('away-team-moneyline-container-' + i).appendChild(awayMoneyline)

        isHome = true;

        let homePicture = document.createElement('img')
        let homeName = document.createElement('p')
        homePicture.src = 'images/' + getPicture(i, isHome, data) + '.svg'
        homeName.innerHTML = abbreviateStates(i, isHome, data)
        document.getElementById('home-team-name-container-' + i).appendChild(homePicture)
        document.getElementById('home-team-name-container-' + i).appendChild(homeName)

        let homeSpread = document.createElement('p')
        let homeSpreadOdds = document.createElement('p')

        // makes sure draftkings is available
        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

            // if spreads exists
            if(spreadsIndex != undefined){

                // Outcome value flips so this is to check the current team and match its odds
                if(data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].name == data[i].home_team){
                    homeSpread.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].point
                    homeSpreadOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[0].price
                }else{
                    homeSpread.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[1].point
                    homeSpreadOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[spreadsIndex].outcomes[1].price
                }
            }else{
                homeSpread.innerHTML = 'N/A'
                homeSpreadOdds.innerHTML = 'N/A'
            }

            if(homeSpread.innerHTML > 0){
                homeSpread.innerHTML = '+' + homeSpread.innerHTML
            }

        }else{
            homeSpread.innerHTML = 'N/A'
            homeSpreadOdds.innerHTML = 'N/A'
        }

        homeSpreadOdds.classList.add('odds')
        document.getElementById('home-team-spread-container-' + i).appendChild(homeSpread)
        document.getElementById('home-team-spread-container-' + i).appendChild(homeSpreadOdds)

        let underTotal = document.createElement('p')
        let underOdds = document.createElement('p')
        
        // makes sure draftkings is available
        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

            if(totalsIndex != undefined){
                underTotal.innerHTML = 'u' + data[i].bookmakers[draftKingsIndex].markets[totalsIndex].outcomes[1].point
                underOdds.innerHTML = data[i].bookmakers[draftKingsIndex].markets[totalsIndex].outcomes[1].price
            }else{
                underTotal.innerHTML = 'N/A'
                underOdds.innerHTML = 'N/A'
            }

            if(underOdds.innerHTML > 0){
                underOdds.innerHTML = '+' + underOdds.innerHTML
            }

        }else{
            underTotal.innerHTML = 'N/A'
            underOdds.innerHTML = 'N/A'
        }

        underOdds.classList.add('odds')
        document.getElementById('under-total-container-' + i).appendChild(underTotal)
        document.getElementById('under-total-container-' + i).appendChild(underOdds)

        let homeMoneyline = document.createElement('p')

        // makes sure draftkings is available
        if(draftKingsIndex != null && data[i].bookmakers.length != 0){

            if(moneylineIndex != undefined){
                if(data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[0].name == data[i].home_team){
                    homeMoneyline.innerHTML = data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[0].price
                }else{
                    homeMoneyline.innerHTML = data[i].bookmakers[draftKingsIndex].markets[moneylineIndex].outcomes[1].price
                }
            }else{
                homeMoneyline.innerHTML = 'N/A'
            }

            if(homeMoneyline.innerHTML > 0){
                homeMoneyline.innerHTML = '+' + homeMoneyline.innerHTML
            }

        }else{
            homeMoneyline.innerHTML = 'N/A'
        }

        homeMoneyline.classList.add('odds')
        document.getElementById('home-team-moneyline-container-' + i).appendChild(homeMoneyline)
    }
}

function getPicture(index, isHome, data){

    let team

    if(isHome){
        team = data[index].home_team
    }else{
        team = data[index].away_team
    }

    return team
}

function abbreviateStates(index, isHome, data){

    let team

    if(isHome){
        team = data[index].home_team
    }else{
        team = data[index].away_team
    }

    switch(team){
        case 'Arizona Cardinals':
            return 'AZ Cardinals'
        case 'Atlanta Falcons':
            return 'ATL Falcons'
        case 'Baltimore Ravens':
            return 'BAL Ravens'
        case 'Buffalo Bills':
            return 'BUF Bills'
        case 'Carolina Panthers':
            return 'CAR Panthers'
        case 'Chicago Bears':
            return 'CHI Bears'
        case 'Cincinnati Bengals':
            return 'CIN Bengals'
        case 'Cleveland Browns':
            return 'CLE Browns'
        case 'Dallas Cowboys':
            return 'DAL Cowboys'
        case 'Denver Broncos':
            return 'DEN Broncos'
        case 'Detroit Lions':
            return 'DET Lions'
        case 'Green Bay Packers':
            return 'GB Packers'
        case 'Houston Texans':
            return 'HOU Texans'
        case 'Indianapolis Colts':
            return 'IND Colts'
        case 'Jacksonville Jaguars':
            return 'JAX Jaguars'
        case 'Kansas City Chiefs':
            return 'KC Chiefs'
        case 'Las Vegas Raiders':
            return 'LV Raiders'
        case 'Los Angeles Chargers':
            return 'LA Chargers'
        case 'Los Angeles Rams':
            return 'LA Rams'
        case 'Miami Dolphins':
            return 'MIA Dolphins'
        case 'Minnesota Vikings':
            return 'MIN Vikings'
        case 'New England Patriots':
            return 'NE Patriots'
        case 'New Orleans Saints':
            return 'NO Saints'
        case 'New York Giants':
            return 'NY Giants'
        case 'New York Jets':
            return 'NY Jets'
        case 'Philadelphia Eagles':
            return 'PHI Eagles'
        case 'Pittsburgh Steelers':
            return 'PIT Steelers'
        case 'San Francisco 49ers':
            return 'SF 49ers'
        case 'Seattle Seahawks':
            return 'SEA Seahawks'
        case 'Tampa Bay Buccaneers':
            return 'TB Buccaneers'
        case 'Tennessee Titans':
            return 'TEN Titans'
        case 'Washington Football Team':
            return 'WFT'
        case 'AIC Yellow Jackets':
            return 'AIC'
        case 'Air Force Falcons':
            return 'Air Force'
        case 'Alabama A&M Bulldogs':
            return 'Alabama A&M'
        case 'Alabama Crimson Tide':
            return 'Alabama'
        case 'Alabama Huntsville Chargers':
            return 'Alabama Huntsville'
        case 'Alabama State Hornets':
            return 'Alabama State'
        case 'Alaska Anchorage Seawolves':
            return 'Alaska Anchorage'
        case 'Alaska Nanooks':
            return 'Alaska'
        case 'Albany Great Danes':
            return 'Albany'
        case 'Alcorn State Braves':
            return 'Alcorn State'
        case 'American Eagles':
            return 'American Eagles'
        case 'Appalachian State Mountaineers':
            return 'Appalachian St'
        case 'Arizona Wildcats':
            return 'Arizona'
        case 'Arizona State Sun Devils':
            return 'Arizona State'
        case 'Akron Zips':
            return 'Akron'
        case 'Arkansas PB Golden Lions':
            return 'Arkansas PB'
        case 'Arkansas Razorbacks':
            return 'Arkansas'
        case 'Arkansas State Red Wolves':
            return 'Arkansas State'
        case 'Army Black Knights':
            return 'Army'
        case 'Auburn Tigers':
            return 'Auburn'
        case 'Austin Peay Governers':
            return 'Austin Peay'
        case 'Ball State Cardinals':
            return 'Ball State'
        case 'Baylor Bears':
            return 'Baylor'
        case 'Belmont Bruins':
            return 'Belmont'
        case 'Bemidji State Beavers':
            return 'Bemidji State'
        case 'Bentley Falcons':
            return 'Bentley'
        case 'Bethune Cookman Wildcats':
            return 'Bethune Cookman'
        case 'Binghamton Bearcats':
            return 'Binghamton'
        case 'Bluefield State College':
            return 'Bluefield State'
        case 'Boise State Broncos':
            return 'Boise State'
        case 'Boston College Eagles':
            return 'Boston College'
        case 'Boston University Terriers':
            return 'Boston'
        case 'Bowling Green Falcons':
            return 'Bowling Green'
        case 'Bradley Braves':
            return 'Bradley'
        case 'Brown Bears':
            return 'Brown'
        case 'Bryant Bulldogs':
            return 'Bryant'
        case 'Bucknell Bison':
            return 'Bucknell'
        case 'Buffalo Bulls':
            return 'Buffalo'
        case 'Butler Bulldogs':
            return 'Butler'
        case 'BYU Cougars':
            return 'BYU'
        case 'Cal Poly Mustangs':
            return 'Cal Poly'
        case 'Cal State Fullerton Titans':
            return 'Cal State Fullerton'
        case 'UC Davis Aggies':
            return 'UC Davis'
        case 'California Golden Bears':
            return 'California'
        case 'California Irvine Anteaters':
            return 'California Irvine'
        case 'California Riverside Highlanders':
            return 'Cali Riverside'
        case 'Campbell Fighting Camels':
            return 'Campbell'
        case 'Canisius Golden Griffins':
            return 'Canisius'
        case 'Cenetary Gentlemen':
            return 'Cenetary'
        case 'Central Arkansas Bears':
            return 'Central Arkansas'
        case 'Central Connecticut Blue Devils':
            return 'Central CT'
        case 'Central Michigan Chippewas':
            return 'Central MI'
        case 'Charlotte 49ers':
            return 'Charlotte'
        case 'Chattanooga Mocs':
            return 'Chattanooga'
        case 'Chicago State Cougars':
            return 'Chicago State Cougars'
        case 'Cincinnati Bearcats':
            return 'Cincinnati'
        case 'Clarkson Golden Knights':
            return 'Clarkson'
        case 'Clemson Tigers':
            return 'Clemson'
        case 'Cleveland State Vikings':
            return 'Cleveland State'
        case 'Coastal Carolina Chanticleers':
            return 'C Carolina'
        case 'Colgate Raiders':
            return 'Colgate'
        case 'College of Charleston Cougars':
            return 'Charleston'
        case 'Colorado Buffaloes':
            return 'Colorado'
        case 'Colorado College Tigers':
            return 'Colorado College'
        case 'Colorado State Rams':
            return 'Colorado State'
        case 'Columbia Lions':
            return 'Columbia'
        case 'Coppin State Eagles':
            return 'Coppin State'
        case 'Cornell Bid Red':
            return 'Cornell'
        case 'Creighton Bluejays':
            return 'Creighton'
        case 'CSU Bakersfield Roadrunners':
            return 'CSU Bakersfield'
        case 'CSU Buccaneers':
            return 'CSU'
        case 'Dartmouth Big Green':
            return 'Dartmouth'
        case 'Davidson Wildcats':
            return 'Davidson'
        case 'Dayton Flyers':
            return 'Dayton'
        case 'Delaware Blue Hens':
            return 'Delaware'
        case 'Delaware State Hornets':
            return 'Deleware State'
        case 'Denver Pioneers':
            return 'Denver'
        case 'DePaul Blue Demons':
            return 'DePaul'
        case 'Detroit Titans':
            return 'Detroit'
        case 'Dixie State Trailblazers':
            return 'Dixie State'
        case 'Drake Bulldogs':
            return 'Drake'
        case 'Drexel Dragons':
            return 'Drexel Dragons'
        case 'Duke Blue Devils':
            return 'Duke'
        case 'Duquesne Dukes':
            return 'Duquesne'
        case 'East Carolina Pirates':
            return 'East Carolina'
        case 'Eastern Illinois Panthers':
            return 'Eastern Illinois'
        case 'Eastern Kentucky Colonels':
            return 'Eastern Kentucky'
        case 'Eastern Michigan Eagles':
            return 'Eastern MI'
        case 'Eastern Washington Eagles':
            return 'Eastern WA'
        case 'Elon Phoenix':
            return 'Elon'
        case 'ETSU Buccaneers':
            return 'ETSU'
        case 'Evansville Purple Aces':
            return 'Evansville'
        case 'Fairfield Stags':
            return 'Fairfield'
        case 'Fairleigh Dickinson Knights':
            return 'Fairleigh'
        case 'Ferris State Bulldogs':
            return 'Ferris State'
        case 'Florida A&M Rattlers':
            return 'Florida A&M'
        case 'Florida Atlantic Owls':
            return 'Florida Atlantic'
        case 'Florida Gators':
            return 'Florida'
        case 'Florida Gulf Coast Eagles':
            return 'FGC'
        case 'Florida International Panthers':
            return 'FL Inter'
        case 'Florida State Seminoles':
            return 'Florida State'
        case 'Fordham Rams':
            return 'Fordham'
        case 'Fresno State Bulldogs':
            return 'Fresno State'
        case 'Furman Pelicans':
            return 'Furman'
        case 'Gardner Webb Bulldogs':
            return 'Gardner Webb'
        case 'George Mason Patriots':
            return 'George Mason'
        case 'George Washington Colonials':
            return 'George Washington'
        case 'Georgetown Hoyas':
            return 'Georgetown'
        case 'Georgia Bulldogs':
            return 'Georgia'
        case 'Georgia Southern Eagles':
            return 'GA Southern'
        case 'Georgia State Panthers':
            return 'Georgia State'
        case 'Georgia Tech Yellow Jackets':
            return 'Georgia Tech'
        case 'Gonzaga Bulldogs':
            return 'Gonzaga'
        case 'Grambling State Tigers':
            return 'Grambling State'
        case 'Grand Canyon Antelopes':
            return 'Grand Canyon'
        case 'Hampton Pirates':
            return 'Hampton'
        case 'Hartford Hawks':
            return 'Hartford'
        case 'Harvard Crimson':
            return 'Harvard'
        case 'Hawaii Rainbow Warriors':
            return 'Hawaii'
        case 'High Point Panthers':
            return 'High Point'
        case 'Hofstra Pride':
            return 'Hofstra'
        case 'Holy Cross Crusaders':
            return 'Holy Cross'
        case 'Houston Cougars':
            return 'Houston'
        case 'Houston Baptist Huskies':
            return 'Houston Baptist'
        case 'Howard Bison':
            return 'Howard'
        case 'Idaho State Bengals':
            return 'Idaho State'
        case 'Idaho Vandals':
            return 'Idaho'
        case 'Idaho State Bengals':
            return 'Idaho State'
        case 'Illinois Chicago Flames':
            return 'Illinois Chicago'
        case 'Illinois Fighting Illini':
            return 'Illinois'
        case 'Incarnate Word Cardinals':
            return 'Incarnate Word'
        case 'Indiana Hoosiers':
            return 'Indiana'
        case 'Indiana State Sycamores':
            return 'Indiana State'
        case 'Iona Gaels':
            return 'Iona'
        case 'Iowa Hawkeyes':
            return 'Iowa'
        case 'Iowa State Cyclones':
            return 'Iowa State'
        case 'IUPUI Jaguars':
            return 'IUPUI'
        case 'Jackson State Tigers':
            return 'Jackson State'
        case 'Jacksonville Dolphins':
            return 'Jacksonville'
        case 'Jacksonville State Gamecocks':
            return 'Jacksonville St'
        case 'James Madison Dukes':
            return 'James Madison'
        case 'Kansas Jayhawks':
            return 'Kansas'
        case 'Kansas State Wildcats':
            return 'Kansas State'
        case 'Kennesaw State Owls':
            return 'Kennesaw State'
        case 'Kent State Golden Flashes':
            return 'Kent State';
        case 'Kentucky Wildcats':
            return 'Kentucky'
        case 'La Selle Explorers':
            return 'La Selle'
        case 'Lafayette Leopards':
            return 'Lafayette'
        case 'Lake Superior State Lakers':
            return 'Lake Superior St'
        case 'Lamar Cardinals':
            return 'Lamar'
        case 'Lehigh Mountain Hawks':
            return 'Lehigh'
        case 'Liberty Flames':
            return 'Liberty'
        case 'Lipscomb Bisons':
            return 'Bisons'
        case 'Little Rock Trojans':
            return 'Trojans'
        case 'LIU Brooklyn Blackbirds':
            return 'LIU Brooklyn'
        case 'Long Beach State 49ers':
            return 'Long Beach St'
        case 'Longwood Lancers':
            return 'Longwood'
        case 'Louisiana Ragin Cajuns':
            return 'Louisiana'
        case 'Louisiana Tech Bulldogs':
            return 'Louisiana Tech'
        case 'Louisville Cardinals':
            return 'Louisville'
        case 'Loyola Maryland Greyhounds':
            return 'Loyola Maryland'
        case 'Loyola Marymount Lions':
            return 'Loyola Mary'
        case 'Loyola Ramblers':
            return 'Loyola'
        case 'LSU Tigers':
            return 'LSU'
        case 'Maine Black Bears':
            return 'Maine'
        case 'Manhattan Jaspers':
            return 'Manhattan'
        case 'Marist Red Foxes':
            return 'Marist'
        case 'Marquette Golden Eagles':
            return 'Marquette'
        case 'Marshall Thundering Herd':
            return 'Marshall'
        case 'Maryland Eastern Shore Hawks':
            return 'Maryland Eastern'
        case 'Maryland Terrapins':
            return 'Maryland'
        case 'McNeese State Cowboys':
            return 'McNeese State'
        case 'Memphis Tigers':
            return 'Memphis'
        case 'Mercer Bears':
            return 'Mercer'
        case 'Mercyhurst Lakers':
            return 'Mercyhurst'
        case 'Merrimack Warriors':
            return 'Merrimack'
        case 'Miami (OH) RedHawks':
            return 'Miami (OH)'
        case 'Miami Hurricanes':
            return 'Miami'
        case 'Michigan State Spartans':
            return 'Michigan State'
        case 'Michigan Tech Huskies':
            return 'Michigan Tech'
        case 'Michigan Wolverines':
            return 'Michigan'
        case 'Middle Tennessee Blue Raiders':
            return 'Middle TN'
        case 'Minnesota Duluth Bulldogs':
            return 'Minnesota Duluth'
        case 'Minnesota Golden Gophers':
            return 'Minnesota'
        case 'Minnesota State Mavericks':
            return 'Minnesota State'
        case 'Mississippi Rebels':
            return 'Mississippi'
        case 'Mississippi State Bulldogs':
            return 'Mississippi St'
        case 'Missouri Tigers':
            return 'Missouri'
        case 'Missouri State Bears':
            return 'Missouri State'
        case 'Monmouth Hawks':
            return 'Monmouth'
        case 'Montana Grizzlies':
            return 'Montana'
        case 'Montana State Bobcats':
            return 'Montana State'
        case 'Morehead State Eagles':
            return 'Morehead State'
        case 'Morgan State Bears':
            return 'Morgan State'
        case 'Mount St':
            return 'Mount St'
        case 'Murray State Racers':
            return 'Murray State'
        case 'MVSU Delta Devils':
            return 'MVSU'
        case 'Navy Midshipmen':
            return 'Navy'
        case 'NC Greesboro Spartans':
            return 'NC Greensboro'
        case 'NC State Wolfpack':
            return 'NC State'
        case 'NC Wilmington Seahawks':
            return 'NC Wilmington'
        case 'NCCU Eagles':
            return 'NCCU'
        case 'Nebraska Cornhuskers':
            return 'Nebraska'
        case 'Nebraska Omaha Mavericks':
            return 'Nebraska Omaha'
        case 'Nevada Wolf Pack':
            return 'Nevada'
        case 'New Hampshire Wildcats':
            return 'New Hampshire'
        case 'New Mexico Lobos':
            return 'New Mexico'
        case 'New Mexico State Aggies':
            return 'NM State'
        case 'New Orleans Privateers':
            return 'New Orleans'
        case 'Niagara Purple Eagles':
            return 'Niagara'
        case 'Nicholls State Colonels':
            return 'Nicholls State'
        case 'NJIT Highlanders':
            return 'NJIT'
        case 'Norfolk State Spartans':
            return 'Norfolk State'
        case 'North Alabama Lions':
            return 'North Alabama'
        case 'North Carolina A&T Aggies':
            return 'NC A&T'
        case 'North Carolina Asheville Bulldogs':
            return 'NC Asheville';
        case 'North Carolina Tar Heels':
            return 'North Carolina'
        case 'North Dakota Fighting Hawks':
            return 'North Dakota'
        case 'North Dokata State Bison':
            return 'NDSU'
        case 'North Texas Mean Green':
            return 'North Texas'
        case 'Northeastern Huskies':
            return 'Northeastern'
        case 'Northern Arizona Lumberjacks':
            return 'Northern AZ'
        case 'Northen Colorado Bears':
            return 'Northen CO'
        case 'Northern Illinois Huskies':
            return 'Northern IL'
        case 'Northen Iowa Panthers':
            return 'UNI'
        case 'Northen Kentucky Norse':
            return 'Northern KY'
        case 'Northern Michigan Wildcats':
            return 'Northern MI'
        case 'Northwestern Wildcats':
            return 'Northwestern'
        case 'Northwestern State Demons':
            return 'Northwestern St'
        case 'Notre Dame Fighting Irish':
            return 'Notre Dame'
        case 'Oakland Golden Grizzlies':
            return 'Oakland'
        case 'Ohio Bobcats':
            return 'Ohio'
        case 'Ohio State Buckeyes':
            return 'Ohio State'
        case 'Oklahoma Sooners':
            return 'Oklahoma'
        case 'Oklahoma State Cowboys':
            return 'Oklahoma St'
        case 'Old Dominion Monarchs':
            return 'Old Dominion'
        case 'Ole Miss Rebels':
            return 'Ole Miss'
        case 'Oral Roberts Golden Eagles':
            return 'Oral Roberts'
        case 'Oregon Ducks':
            return 'Oregon'
        case 'Oregon State Beavers':
            return 'Oregon State'
        case 'Pacific Tigers':
            return 'Pacific'
        case 'Penn Quakers':
            return 'Quakers'
        case 'Penn State Nittany Lions':
            return 'Penn State'
        case 'Pepperdine Waves':
            return 'Pepperdine'
        case 'Pittsburgh Panthers':
            return 'Pittsburgh'
        case 'Portland Pilots':
            return 'Portland'
        case 'Portland State Vikings':
            return 'Portland State'
        case 'Prairie View A&M Panthers':
            return 'Prarie View A&M'
        case 'Presbyterian Blue Hose':
            return 'Presbyterian'
        case 'Princeton Tigers':
            return 'Princeton'
        case 'Providence Friars':
            return 'Providence'
        case 'Purdue Boilermakers':
            return 'Purdue'
        case 'Purdue Fort Wayne Mastodons':
            return 'Purdue Fort Wayne'
        case 'Quinnipiac Bobcats':
            return 'Quinnipiac'
        case 'Radford Highlanders':
            return 'Radford'
        case 'Rhode Island Rams':
            return 'Rhode Island'
        case 'Rice Owls':
            return 'Rice'
        case 'Richmond Spiders':
            return 'Richmond'
        case 'Rider Broncos':
            return 'Rider'
        case 'RIT Tigers':
            return 'RIT'
        case 'Robert Morris Colonials':
            return 'Robert Morris'
        case 'RPI Engineers':
            return 'RPI'
        case 'Rutgers Scarlet Knights':
            return 'Rutgers'
        case 'Sacramento State Hornets':
            return 'Sacramento State'
        case 'Sacred Heart Pioneers':
            return 'Sacred Heart'
        case 'Saint Francis Red Flash':
            return 'Saint Francis'
        case 'Saint Louis Billikens':
            return 'Saint Louis'
        case 'Saint Marys Gaels':
            return 'Saint Marys'
        case 'Saint Peters Peacocks':
            return 'Saint Peters'
        case 'Sam Houston State Bearkats':
            return 'Sam Houston St'
        case 'Samford Bulldogs':
            return 'Samford'
        case 'San Diego State Aztecs':
            return 'San Diego St'
        case 'San Diego Toreros':
            return 'San Diego'
        case 'San Francisco Dons':
            return 'San Francisco'
        case 'San Jose State Spartans':
            return 'San Jose State'
        case 'Santa Clara Broncos':
            return 'Santa Clara'
        case 'Savannah State Tigers':
            return 'Savannah St'
        case 'SE Missouri State Tigers':
            return 'SE Missouri'
        case 'Seattle Redhawks':
            return 'Seattle'
        case 'Seton Hall Pirates':
            return 'Seton Hall'
        case 'Siena Saints':
            return 'Siena'
        case 'SIU Edwardsville Cougars':
            return 'SIU Edwardsville'
        case 'SMU Mustangs':
            return 'SMU'
        case 'Sout Plains College':
            return 'Sout Plains'
        case 'South Alabama Jaguars':
            return 'South Alabama'
        case 'South Carolina Gamecocks':
            return 'South Carolina'
        case 'South Carolina State Bulldogs':
            return 'SCSU'
        case 'South Dakota Coyotes':
            return 'South Dakota'
        case 'South Dakota State Jackrabbits':
            return 'SDSU'
        case 'South Florida Bulls':
            return 'South Florida'
        case 'Southeastern Louisiana Lions':
            return 'Southeastern LA'
        case 'Southern Illinois Sulukis':
            return 'Southern IL'
        case 'Southern Jaguars':
            return 'Southern'
        case 'Southern Mississippi Golden Eagles':
            return 'Southern MS'
        case 'Southern Utah Thunderbirds':
            return 'Southern Utah'
        case 'St Bonaventure Bonnies':
            return 'St Bonaventure'
        case 'St Cloud State Huskies':
            return 'St Cloud State'
        case 'St Francis Terriers':
            return 'St Francis'
        case 'St Johns Red Storm':
            return 'St Johns';
        case 'St Josephs Hawks':
            return 'St Josephs'
        case 'Stanford Cardinal':
            return 'Stanford'
        case 'Stephen F':
            return 'Stephen F'
        case 'Stetson Hatters':
            return 'Stetson'
        case 'Stony Brook Seawolves':
            return 'Stony Brook'
        case 'Syracuse Orange':
            return 'Syracuse'
        case 'TCU Horned Frogs':
            return 'TCU'
        case 'Temple Owls':
            return 'Temple'
        case 'Tennessee Martin Skyhawks':
            return 'TN Martin'
        case 'Tennessee State Tigers':
            return 'TN State'
        case 'Tennessee Tech Golden Eagles':
            return 'TN Tech'
        case 'Tennessee Volunteers':
            return 'Tennesssee'
        case 'Texas A&M Aggies':
            return 'Texas A&M'
        case 'Texas A&M CC Islanders':
            return 'Texas A&M CC'
        case 'Texas Arlington Mavericks':
            return 'Texas Arlington'
        case 'Texas Longhorns':
            return 'Texas'
        case 'Texas Southern Tigers':
            return 'Texas Southern'
        case 'Texas State Bobcats':
            return 'Texas State'
        case 'Texas Tech Red Raiders':
            return 'Texas Tech'
        case 'The Citadel Bulldogs':
            return 'The Citadel'
        case 'Toledo Rockets':
            return 'Toledo'
        case 'Towson Tigers':
            return 'Towson'
        case 'Troy Trojans':
            return 'Troy'
        case 'Tulane Green Wave':
            return 'Tulane'
        case 'Tulsa Golden Hurricane':
            return 'Tulsa'
        case 'UAB Blazers':
            return 'UAB'
        case 'UCF Knights':
            return 'UCF'
        case 'UCLA Bruins':
            return 'UCLA'
        case 'UConn Huskies':
            return 'UConn'
        case 'UCSB Gauchos':
            return 'UCSB'
        case 'UL Monroe Warhawks':
            return 'UL Monroe'
        case 'UMass Lowell River Hawks':
            return 'UMass Lowell'
        case 'UMass Minutemen':
            return 'UMass'
        case 'UMBC Retrievers':
            return 'UMBC'
        case 'UMKC Kangaroos':
            return 'UMKC'
        case 'UNF Ospreys':
            return 'UNF'
        case 'Union Dutchmen':
            return 'Union'
        case 'UNLV Rebels':
            return 'UNLV'
        case 'USC Trojans':
            return 'USC'
        case 'USC Upstate Spartans':
            return 'USC Upstate'
        case 'Utah State Aggies':
            return 'Utah State'
        case 'Utah Utes':
            return 'Utah'
        case 'Utah Valley Wolverines':
            return 'Utah Valley'
        case 'UTEP Miners':
            return 'UTEP'
        case 'UTPB Falcons':
            return 'UTPB'
        case 'UTRGV Vaqueros':
            return 'UTRGV'
        case 'UTSA Roadrunners':
            return 'UTSA'
        case 'Valparaiso Crusaders':
            return 'Valparaiso'
        case 'Vanderbilt Commodores':
            return 'Vanderbilt'
        case 'Vermont Catamounts':
            return 'Vermont'
        case 'Villanova Wildcats':
            return 'Villanova'
        case 'Virginia Cavaliers':
            return 'Virginia'
        case 'Virginia Commonwealth Rams':
            return 'VA Commonwealth'
        case 'Virginia Tech Hokies':
            return 'Virginia Tech'
        case 'VMI Keydets':
            return 'VMI'
        case 'Wagner Seahawks':
            return 'Wagner'
        case 'Wake Forest Demon Deacons':
            return 'Wake Forest'
        case 'Washington Huskies':
            return 'Washington'
        case 'Washington State Cougars':
            return 'WA State'
        case 'Weber State Wildcats':
            return 'Weber State'
        case 'West Virginia Mountaineers':
            return 'West Virginia'
        case 'Western Carolina Catamounts':
            return 'Western Carolina'
        case 'Western Illinois Leathernecks':
            return 'Western IL'
        case 'Western Kentucky Hilltoppers':
            return 'Western KY'
        case 'Western Michigan Broncos':
            return 'Western MI'
        case 'Wichita State Shockers':
            return 'Wichita State'
        case 'William and Mary Tribe':
            return 'William and Mary'
        case 'Winthrop Eagles':
            return 'Winthrop'
        case 'Wisconsin Badgers':
            return 'Wisconsin'
        case 'Wisconsin Green Bay Phoenix':
            return 'WI Green Bay'
        case "Wisconsin Milwaukee Panthers":
            return 'WI Milwaukee'
        case 'Wofford Terriers':
            return 'Wofford'
        case 'Wright State Raiders':
            return 'Wright State'
        case 'Wyoming Cowboys':
            return 'Wyoming'
        case 'Xavier Musketeers':
            return 'Xavier'
        case 'Yale Bulldogs':
            return 'Yale'
        case 'Youngstown State Penguins':
            return 'Youngstown St'
        case 'Anaheim Ducks':
            return 'ANA Ducks'
        case 'Arizona Coyotes':
            return 'ARI Coyotes'
        case 'Boston Bruins':
            return 'BOS Bruins'
        case 'Buffalo Sabres':
            return 'BUF Sabres'
        case 'Calgary Flames':
            return 'CAL Flames'
        case 'Carolina Hurricanes':
            return 'Hurricanes'
        case 'Chicago Blackhawks':
            return 'Blackhawks'
        case 'Colorado Avalanche':
            return 'CO Avalanche'
        case 'Columbus Blue Jackets':
            return 'Blue Jackets'
        case 'Dallas Stars':
            return 'DAL Stars'
        case 'Detroit Red Wings':
            return 'DET Red Wings'
        case 'Edmonton Oilers':
            return 'EDM Oilers'
        case 'Florida Panthers':
            return 'FLA Panthers'
        case 'Los Angeles Kings':
            return 'LA Kings'
        case 'Minnesota Wild':
            return 'MN Wild'
        case 'Montréal Canadiens':
            return 'MTL Canadiens'
        case 'Nashville Predators':
            return 'NSH Predators'
        case 'New Jersey Devils':
            return 'NJ Devils'
        case 'New York Islanders':
            return 'NY Islanders'
        case 'New York Rangers':
            return 'NY Rangers'
        case 'Ottawa Senators':
            return 'OTT Senators'
        case 'Philadelphia Flyers':
            return 'PHI Flyers'
        case 'Pittsburgh Penguins':
            return 'PIT Penguins'
        case 'San Jose Sharks':
            return 'SJ Sharks'
        case 'Seattle Kraken':
            return 'SEA Kraken'
        case 'St Louis Blues':
            return 'STL Blues'
        case 'Tampa Bay Lightning':
            return 'TB Lightning'
        case 'Toronto Maple Leafs':
            return 'Maple Leafs'
        case 'Vancouver Canucks':
            return 'VAN Canucks'
        case 'Vegas Golden Knights':
            return 'Golden Knights'
        case 'Washington Capitals':
            return 'WAS Capitals'
        case 'Winnipeg Jets':
            return 'WPG Jets'
    }
}
  