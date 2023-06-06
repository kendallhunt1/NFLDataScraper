const puppeteer = require('puppeteer');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();
const PORT = process.env.PORT || 8080;
var dotenv = require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/NFLGameStats', {
 useNewUrlParser: true,
 useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
 console.log('Mongoose is connected!');
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.listen(PORT, console.log(`Server is starting at ${PORT}`));

// Schema
const Schema = mongoose.Schema;

// Schema will have all data to send to DB
const SingleGameSchema = new Schema({
 SeasonSingleGames: Array
})
const FullSeasonSchema = new Schema({
 fullSeason: Array
})

// Model
const SingleGame = mongoose.model('SingleGame', SingleGameSchema);
const FullSeasonStats = mongoose.model('FullSeasonStats', FullSeasonSchema);


// All of the Statistcs I want to keep, and use in my equations:

// ------ FULL SEASON STATS ------ ASSUME ALL STATS INCLUDE GIVEN TEAM, & OPPOSING TEAMS -----
 // -- Total Points Scored By Offense/Total Points Scored by Opposing Teams (PF)
 // -- Total Yds of offense/opposing offense (Yds)
 // -- Total Plays (Ply), yards per play (y/p), turnovers (TO), fumbles lost (FL), 
 // -- 1st downs (1stD), Completions (Cmp), Passed Attempted (Att), Pass Yards, passing tds, 
 // -- INTs, yards gained per attempt, 1st downs from passing ATTs, 
 // -- rushing Atts/yds/TD/Yds per attempt/1st downs, 
 // -- penalties, yds from penalties/1st downs from penalties, # of drives, 
 // -- percentage of drives ending in a score, % of drives ending in TOs, 
 // -- average yds per drive, average PTs per drive

// ------ STATS PER GAME ------ ASSUME ALL STATS INCLUDE GIVEN TEAM, & OPPOSING TEAMS -----

let SeasonSingleGames = [];
let fullSeason = [];

async function main(team, year, callback) {
  console.log("Executing main for year: ", year);
 const browser = await puppeteer.launch();
 const page = await browser.newPage();
 await page.setDefaultNavigationTimeout(0);
 const url = `https://www.pro-football-reference.com/teams/${team}/${year}.htm`;

 await page.goto(url, {waitUnitl: 'domcontentloaded'});
 const fullSeasonRows = await page.$$('#team_stats tbody tr');
 const singleGameRows = await page.$$('#games tbody tr');

 for (let k = 0; k < 2; k++) {
 const fullSeasonRow = fullSeasonRows[k];

 let pointsScored = await fullSeasonRow.$eval('td:nth-of-type(1)', element => element.textContent);
 pointsScored = parseInt(pointsScored);

 let totalYards = await fullSeasonRow.$eval('td:nth-of-type(2)', element => element.textContent);
 totalYards = parseInt(totalYards);

 let totalPlays = await fullSeasonRow.$eval('td:nth-of-type(3)', element => element.textContent);
 totalPlays = parseInt(totalPlays);

 let yardsPerPlay = await fullSeasonRow.$eval('td:nth-of-type(4)', element => element.textContent);
 yardsPerPlay = parseInt(yardsPerPlay);

 let turnovers = await fullSeasonRow.$eval('td:nth-of-type(5)', element => element.textContent);
 turnovers = parseInt(turnovers);

 let fumblesLost = await fullSeasonRow.$eval('td:nth-of-type(6)', element => element.textContent);
 fumblesLost = parseInt(fumblesLost);

 let firstDowns = await fullSeasonRow.$eval('td:nth-of-type(7)', element => element.textContent);
 firstDowns = parseInt(firstDowns);

 let passCompletions = await fullSeasonRow.$eval('td:nth-of-type(8)', element => element.textContent);
 passCompletions = parseInt(passCompletions);

 let passAttempts = await fullSeasonRow.$eval('td:nth-of-type(9)', element => element.textContent);
 passAttempts = parseInt(passAttempts);

 let passYards = await fullSeasonRow.$eval('td:nth-of-type(10)', element => element.textContent);
 passYards = parseInt(passYards);

 let passTDs = await fullSeasonRow.$eval('td:nth-of-type(11)', element => element.textContent);
 passTDs = parseInt(passTDs);

 let interceptionsThrown = await fullSeasonRow.$eval('td:nth-of-type(12)', element => element.textContent);
 interceptionsThrown = parseInt(interceptionsThrown);

 let averageYardsGainedPerPass = await fullSeasonRow.$eval('td:nth-of-type(13)', element => element.textContent);
 averageYardsGainedPerPass = parseInt(averageYardsGainedPerPass);

 let passingFirstDowns = await fullSeasonRow.$eval('td:nth-of-type(14)', element => element.textContent);
 passingFirstDowns = parseInt(passingFirstDowns);

 let rushingAttempts = await fullSeasonRow.$eval('td:nth-of-type(15)', element => element.textContent);
 rushingAttempts = parseInt(rushingAttempts);

 let rushingYards = await fullSeasonRow.$eval('td:nth-of-type(16)', element => element.textContent);
 rushingYards = parseInt(rushingYards);

 let rushingTDs = await fullSeasonRow.$eval('td:nth-of-type(17)', element => element.textContent);
 rushingTDs = parseInt(rushingTDs);

 let yardsPerRush = await fullSeasonRow.$eval('td:nth-of-type(18)', element => element.textContent);
 yardsPerRush = parseInt(yardsPerRush);

 let rushingFirstDowns = await fullSeasonRow.$eval('td:nth-of-type(19)', element => element.textContent);
 rushingFirstDowns = parseInt(rushingFirstDowns);

 let penalties = await fullSeasonRow.$eval('td:nth-of-type(20)', element => element.textContent);
 penalties = parseInt(penalties);

 let penaltyYards = await fullSeasonRow.$eval('td:nth-of-type(21)', element => element.textContent);
 penaltyYards = parseInt(penaltyYards);

 let penaltiesResultingInFirstDowns = await fullSeasonRow.$eval('td:nth-of-type(22)', element => element.textContent);
 penaltiesResultingInFirstDowns = parseInt(penaltiesResultingInFirstDowns);

 let numberOfDrives;
 try {
  numberOfDrives = await fullSeasonRow.$eval('td:nth-of-type(23)', element => element.textContent);
  numberOfDrives = parseInt(numberOfDrives);
 } catch (error) {
  numberOfDrives = null;
 }

 let driveTDPercentage;
try {
  driveTDPercentage = await fullSeasonRow.$eval('td:nth-of-type(24)', element => element.textContent);
  driveTDPercentage = parseInt(driveTDPercentage);
} catch (error) {
  driveTDPercentage = null;
}

let driveTurnoverPercentage;
try {
  driveTurnoverPercentage = await fullSeasonRow.$eval('td:nth-of-type(25)', element => element.textContent);
  driveTurnoverPercentage = parseInt(driveTurnoverPercentage);
} catch (error) {
  driveTurnoverPercentage = null;
}

let averageDriveStartYardline;
try {
  averageDriveStartYardline = await fullSeasonRow.$eval('td:nth-of-type(26)', element => element.textContent);
} catch (error) {
  averageDriveStartYardline = null;
}

let averageTimePerDrive;
try {
  averageTimePerDrive = await fullSeasonRow.$eval('td:nth-of-type(27)', element => element.textContent);
} catch (error) {
  averageTimePerDrive = null;
}

let averagePlaysPerDrive;
try {
  averagePlaysPerDrive = await fullSeasonRow.$eval('td:nth-of-type(28)', element => element.textContent);
  averagePlaysPerDrive = parseInt(averagePlaysPerDrive);
} catch (error) {
  averagePlaysPerDrive = null;
}

let averageYardsPerDrive;
try {
  averageYardsPerDrive = await fullSeasonRow.$eval('td:nth-of-type(29)', element => element.textContent);
  averageYardsPerDrive = parseInt(averageYardsPerDrive);
} catch (error) {
  averageYardsPerDrive = null;
}

let averagePointsPerDrive;
try {
  averagePointsPerDrive = await fullSeasonRow.$eval('td:nth-of-type(30)', element => element.textContent);
  averagePointsPerDrive = parseInt(averagePointsPerDrive);
} catch (error) {
  averagePointsPerDrive = null;
}

 let fullSeasonStatistics = await ([
 {team: team},
 {year: year},
 {pointsScored},
 {totalYards},
 {totalPlays},
 {yardsPerPlay},
 {turnovers},
 {fumblesLost},
 {firstDowns},
 {passAttempts},
 {passCompletions},
 {passYards},
 {passTDs},
 {interceptionsThrown},
 {averageYardsGainedPerPass},
 {passingFirstDowns},
 {rushingAttempts},
 {rushingYards},
 {yardsPerRush},
 {rushingFirstDowns},
 {rushingTDs},
 {penalties},
 {penaltyYards},
 {penaltiesResultingInFirstDowns},
 {numberOfDrives},
 {driveTDPercentage},
 {driveTurnoverPercentage},
 {averageDriveStartYardline},
 {averageTimePerDrive},
 {averagePlaysPerDrive},
 {averageYardsPerDrive},
 {averagePointsPerDrive}
])

 await fullSeason.push(
  {fullSeasonStatistics}
 )
 }

 for (let j = 0; j < singleGameRows.length; j++) {
 const singleGameRow = singleGameRows[j];
 const singleGameDay = 'td:nth-of-type(1)';
 const singleGameDate = 'td:nth-of-type(2)';
 const singleGameTimeOfDay = 'td:nth-of-type(3)';
 const singleGameWinOrLoss = 'td:nth-of-type(5)';
 const singleGameOT = 'td:nth-of-type(6)';
 const singleGameHomeOrAway = 'td:nth-of-type(8)';
 const singleGameOpponent = 'td:nth-of-type(9)';
 const singleGamePointsScored = 'td:nth-of-type(10)';
 const singleGamePointsAllowed = 'td:nth-of-type(11)';
 const singleGameOffensiveFirstDowns = 'td:nth-of-type(12)';
 const singleGameTotalYards = 'td:nth-of-type(13)';
 const singleGamePassYards = 'td:nth-of-type(14)';
 const singleGameRushYards = 'td:nth-of-type(15)';
 const singleGameOffensiveTOs = 'td:nth-of-type(16)';
 const singleGameFirstDownsAllowed = 'td:nth-of-type(17)';
 const singleGameTotalYardsAllowed = 'td:nth-of-type(18)';
 const singleGamePassYardsAllowed = 'td:nth-of-type(19)';
 const singleGameRushYardsAllowed = 'td:nth-of-type(20)';
 const singleGameTOsForced = 'td:nth-of-type(21)';
 // const singleGameExpectedPointsScored = 'td:nth-of-type(22)';
 // const singleGameExpectedPointsAllowed = 'td:nth-of-type(23)';
 // const singleGameExpectedSpecialTeamsPoints = 'td:nth-of-type(24)';
 

 // const singleGameWeekValue = await singleGameRow.$eval(singleGameWeek, element => element.textContent);
 const dayOfWeek = await singleGameRow.$eval(singleGameDay, element => element.textContent);

 const timeOfDay = await singleGameRow.$eval(singleGameTimeOfDay, element => element.textContent);

 const gameDate = await singleGameRow.$eval(singleGameDate, element => element.textContent);

 const winOrLoss = await singleGameRow.$eval(singleGameWinOrLoss, element => element.textContent);

 let OT = await singleGameRow.$eval(singleGameOT, element => element.textContent);
 if (OT === '') {
 OT = false;
 } else {
 OT = true;
 }

 let homeOrAway = await singleGameRow.$eval(singleGameHomeOrAway, element => element.textContent);
 if (homeOrAway === '') {
 homeOrAway = "Home";
 } else {
 homeOrAway = "Away"
 };

 const opponent = await singleGameRow.$eval(singleGameOpponent, element => element.textContent);

 let pointsScored = await singleGameRow.$eval(singleGamePointsScored, element => element.textContent);
 pointsScored = parseInt(pointsScored);

 let pointsAllowed = await singleGameRow.$eval(singleGamePointsAllowed, element => element.textContent);
 pointsAllowed = parseInt(pointsAllowed);

 let firstDowns = await singleGameRow.$eval(singleGameOffensiveFirstDowns, element => element.textContent);
 firstDowns = parseInt(firstDowns);

 let totalOffensiveYards = await singleGameRow.$eval(singleGameTotalYards, element => element.textContent);
 totalOffensiveYards = parseInt(totalOffensiveYards);

 let passYards = await singleGameRow.$eval(singleGamePassYards, element => element.textContent);
 passYards = parseInt(passYards);

 let rushYards = await singleGameRow.$eval(singleGameRushYards, element => element.textContent);
 rushYards = parseInt(rushYards);

 let turnovers = await singleGameRow.$eval(singleGameOffensiveTOs, element => element.textContent);
 if (turnovers === '') {
 turnovers = 0;
 } else {
 turnovers = parseInt(turnovers);
 }

 let firstDownsAllowed = await singleGameRow.$eval(singleGameFirstDownsAllowed, element => element.textContent);
 firstDownsAllowed = parseInt(firstDownsAllowed);

 let passYardsAllowed = await singleGameRow.$eval(singleGamePassYardsAllowed, element => element.textContent);
 passYardsAllowed = parseInt(passYardsAllowed);

 let rushYardsAllowed = await singleGameRow.$eval(singleGameRushYardsAllowed, element => element.textContent);
 rushYardsAllowed = parseInt(rushYardsAllowed);

 let totalYardsAllowed = await passYardsAllowed + rushYardsAllowed;

 let TOsForced = await singleGameRow.$eval(singleGameTOsForced, element => element.textContent);
 if (TOsForced === '') {
 TOsForced = 0;
 } else {
 TOsForced = parseInt(TOsForced);
 }

 const singleGame = await ([
 {dayOfWeek}, 
 {timeOfDay}, 
 {gameDate}, 
 {homeOrAway}, 
 {opponent}, 
 {winOrLoss}, 
 {pointsScored},
 {turnovers}, 
 {pointsAllowed}, 
 {rushYards}, 
 {passYards}, 
 {totalOffensiveYards}, 
 {firstDowns}, 
 {rushYardsAllowed}, 
 {passYardsAllowed}, 
 {firstDownsAllowed}, 
 {totalYardsAllowed},
 {pointsAllowed},
 {TOsForced}
 ])

 await SeasonSingleGames.push({singleGame});
 }

 const singleGameData = await {
 SeasonSingleGames
 };
 const fullSeasonData = await {
 fullSeason
 };
 
 const newSingleGameStats = new SingleGame(singleGameData);
 const newFullSeasonStats = new FullSeasonStats(fullSeasonData);

 await newSingleGameStats.save((error) => {
 if (error) {
 console.log('Something Went Wrong', error.message);
 } else {
 console.log(`${team} Single Games from ${year} Uploaded.`);
 }
 });

 await newFullSeasonStats.save((error) => {
 if (error) {
 console.log('Something went wrong', error.message)
 } else {
 console.log(`${team} ${year} Full Season Uploaded.`)
 }
 })
 SeasonSingleGames = [];
 fullSeason = []
 await browser.close();
 console.log(year + " finished.")
 callback();
}

const years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000",
"2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", 
"2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

// Define a function to execute the main function sequentially
function executeSequentially(buf, years, index, callback) {
  if (index >= years.length) {
    // All years have been processed, call the final callback
    callback();
    return;
  }

  const year = years[index];
  main(buf, year, () => {
    // Call the next iteration with the incremented index
    executeSequentially(buf, years, index + 1, callback);
  });
}

// Call the function to start the sequential execution
executeSequentially("atl", years, 0, () => {
  // All years have been processed
  console.log("Execution completed");
});
