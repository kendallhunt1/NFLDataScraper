const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
var dotenv = require('dotenv').config();
const axios = require('axios');

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
// const ConversionSchema = new Schema({
//     fullSeasonConversionStats: Array
// })


// Model
const SingleGame = mongoose.model('SingleGame', SingleGameSchema);
const FullSeasonStats = mongoose.model('FullSeasonStats', FullSeasonSchema);
// const SeasonConversionStats = mongoose.model('ConversionStats', ConversionSchema);

const SeasonSingleGames = [];
const fullSeason = [];
// const fullSeasonConversionStats = [];
const yearDetails = [];
let dummyData = [];
// let conversionDummyData = [];
var done = false;

async function main(team, year) {

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
 await page.setDefaultNavigationTimeout(45000);
 const url = await `https://www.pro-football-reference.com/teams/${team}/${year}.htm`;
 await page.goto(url, {waitUnitl: 'domcontentloaded'});

 const fullSeasonRows = await page.$$('#team_stats tbody tr');
 const fullSeasonConversionRates = await page.$$('#team_conversions tbody tr');
 const singleGameRows = await page.$$('#games tbody tr');

 const yearCoachX = await page.$x('//*[@id="meta"]/div[2]/p[2]/a');
 const yearCoach = await page.evaluate(el => el.textContent, yearCoachX[0]);

 const yearOCX = await page.$x('//*[@id="meta"]/div[2]/p[8]/a');
 const yearOC = await page.evaluate(el => el.textContent, yearOCX[0]);

 const yearDCX = await page.$x('//*[@id="meta"]/div[2]/p[9]/a');
 const yearDC = await page.evaluate(el => el.textContent, yearDCX[0]);

//  const yearGMX = await page.$x('//*[@id="meta"]/div[2]/p[13]/a');
//  const yearGM = await page.evaluate(el => el.textContent, yearGMX[0]);

 const yearStadiumX = await page.$x('//*[@id="meta"]/div[2]/p[11]/a');
 const yearStadium = await page.evaluate(el => el.textContent, yearStadiumX[0]);

 const yearOffensiveSchemeX = await page.$x('//*[@id="meta"]/div[2]/p[14]/text()');
 const yearOffensiveScheme = await page.evaluate(el => el.textContent, yearOffensiveSchemeX[0]);

 const yearDefensiveAlignmentX = await page.$x('//*[@id="meta"]/div[2]/p[15]/text()');
 const yearDefensiveAlignment = await page.evaluate(el => el.textContent, yearDefensiveAlignmentX[0]);

 await yearDetails.push([
    {year},
    {yearCoach},
    {yearOC},
    {yearDC},
    // {yearGM},
    {yearStadium},
    {yearOffensiveScheme},
    {yearDefensiveAlignment}
 ])

    for (let k = 0; k < fullSeasonRows.length; k++) {
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
        
        // Cut off for drive statistics


        let numberOfDrives = await fullSeasonRow.$eval('td:nth-of-type(23)', element => element.textContent);
        numberOfDrives = parseInt(numberOfDrives);
    
        let driveTDPercentage = await fullSeasonRow.$eval('td:nth-of-type(24)', element => element.textContent);
        driveTDPercentage = parseInt(driveTDPercentage);
    
        let driveTurnoverPercentage = await fullSeasonRow.$eval('td:nth-of-type(25)', element => element.textContent);
        driveTurnoverPercentage = parseInt(driveTurnoverPercentage);
    
        let averageDriveStartYardline = await fullSeasonRow.$eval('td:nth-of-type(26)', element => element.textContent);
    
        let averageTimePerDrive = await fullSeasonRow.$eval('td:nth-of-type(27)', element => element.textContent);
    
        let averagePlaysPerDrive = await fullSeasonRow.$eval('td:nth-of-type(28)', element => element.textContent);
        averagePlaysPerDrive = parseInt(averagePlaysPerDrive);
    
        let averageYardsPerDrive = await fullSeasonRow.$eval('td:nth-of-type(29)', element => element.textContent);
        averageYardsPerDrive = parseInt(averageYardsPerDrive);
    
        let averagePointsPerDrive = await fullSeasonRow.$eval('td:nth-of-type(30)', element => element.textContent);
        averagePointsPerDrive = parseInt(averagePointsPerDrive);
    
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
    
        await dummyData.push(
            fullSeasonStatistics
        )
    }
    const teamStats = await dummyData[0];
    let opponentStats = await dummyData[1];
    await opponentStats.shift();
    await fullSeason.push({yearDetails}, {teamStats}, {opponentStats});

    // for (let t = 0; t < fullSeasonConversionRates.length; t++) {
    // const conversionRow = fullSeasonConversionRates[t];

    // let thirdDownAttempts = await conversionRow.$eval('td:nth-of-type(1)', element => element.textContent);
    // thirdDownAttempts = parseInt(thirdDownAttempts);

    // let thirdDownConversions = await conversionRow.$eval('td:nth-of-type(2)', element => element.textContent);
    // thirdDownConversions = parseInt(thirdDownConversions);

    // let thirdDownConversionRate = await conversionRow.$eval('td:nth-of-type(3)', element => element.textContent);
    // thirdDownConversionRate = parseInt(thirdDownConversionRate);

    // let fourthDownAttempts = await conversionRow.$eval('td:nth-of-type(4)', element => element.textContent);
    // fourthDownAttempts = parseInt(fourthDownAttempts);

    // let fourthDownConversions = await conversionRow.$eval('td:nth-of-type(5)', element => element.textContent);
    // fourthDownConversions = parseInt(fourthDownConversions);

    // let fourthDownConversionRate = await conversionRow.$eval('td:nth-of-type(6)', element => element.textContent);
    // fourthDownConversionRate = parseInt(fourthDownConversionRate);

    // let redZoneAppearances = await conversionRow.$eval('td:nth-of-type(7)', element => element.textContent);
    // redZoneAppearances = parseInt(redZoneAppearances);

    // let redZoneTDs = await conversionRow.$eval('td:nth-of-type(8)', element => element.textContent);
    // redZoneTDs = parseInt(redZoneTDs);

    // let redZoneTDRate = await conversionRow.$eval('td:nth-of-type(9)', element => element.textContent);
    // thirdDownAttempts = parseInt(thirdDownAttempts);

    // await conversionDummyData.push([
    //     {thirdDownAttempts},
    //     {thirdDownConversions},
    //     {thirdDownConversionRate},
    //     {fourthDownAttempts},
    //     {fourthDownConversions},
    //     {fourthDownConversionRate},
    //     {redZoneAppearances},
    //     {redZoneTDs},
    //     {redZoneTDRate}
    // ])
    
    // }
    // const teamConversions = await conversionDummyData[0];
    // const opponentConversions = await conversionDummyData[1];
    // await fullSeasonConversionStats.push({teamConversions}, {opponentConversions})

    for (let j = 0; j < singleGameRows.length; j++) {
        const singleGameRow = singleGameRows[j];
        const singleGameWeek = 'th:nth-of-type(1)';
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


        let gameWeek = await singleGameRow.$eval(singleGameWeek, element => element.textContent);
        gameWeek = parseInt(gameWeek);

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
        {gameWeek},
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

    const singleGameData = await {SeasonSingleGames};
    const fullSeasonData = await {fullSeason};
    // const seasonConversionData = await {fullSeasonConversionStats};
    
    const newSingleGameStats = await new SingleGame(singleGameData);
    const newFullSeasonStats = await new FullSeasonStats(fullSeasonData);
    // const newFullSeasonConversions = await new SeasonConversionStats(seasonConversionData);

    await newSingleGameStats.save((error) => {
        if (error || SeasonSingleGames.length < 5) {
        console.log('Something Went Wrong', error.message);
        return;
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

    // await newFullSeasonConversions.save((error) => {
    //     if (error) {
    //     console.log('Something went wrong', error.message)
    //     } else {
    //     console.log(`${team} ${year} conversions Uploaded.`)
    //     }
    // })
    done = await true;

 await browser.close();
}

async function run(team, year, year2) {
    await main(team, year);
    if (done === false) {
        console.log("Waiting...");
    } if (done === true) {
        main(team, year2);
    }
}
run("atl", "2004", "2005");

// await main("atl", "1998")
// .then(main("atl", "1997"))
// main("atl", "1990");
// main("atl", "1991");
// main("atl", "1992");
// main("atl", "1994");
// main("atl", "1995");
// main("atl", "1996");
// main("atl", "1998");
// main();

// // Years with drive stats
// main("atl", "2001")
// main("atl", "2002");
// main("atl", "2003");
// main("atl", "2004");
// main("atl", "2005");
// main("atl", "2006");
// main("atl", "2007");
// main("atl", "2008");
// main("atl", '2009');
// main("atl", "2010");
// main("atl", "2011");
// main("atl", "2012");
// main("atl", "2013");
// main("atl", "2014");
// main("atl", "2015");
// main("atl", "2016");
// main("atl", "2017");
// main("atl", "2018");
// main("atl", "2019");
// main("atl", "2021");