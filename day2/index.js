const fs = require('fs');

var text = fs.readFileSync(__dirname + '/data.txt', 'utf-8');
var fights = text.split("\n");

var scores = {
    X: 1,
    Y: 2,
    Z: 3
}
// Rock AX, paper BY, sissors CZ
var outcomes = {
    "A X" : 3,
    "A Y" : 6,
    "A Z" : 0,
    "B X" : 0,
    "B Y" : 3,
    "B Z" : 6,
    "C X" : 6,
    "C Y" : 0,
    "C Z" : 3,
}

function getPoints(fight){
    var [action, reaction] = fight.split(" ");
    return outcomes[fight] + scores[reaction];
}

var fightScores = fights.map(getPoints);
var totalScore = fightScores.reduce((a,b)=> a+b, 0);
console.log(totalScore);

// part 2

var actions = [
    ['A', 'X'],
    ['B', 'Y'],
    ['C', 'Z']
];

function getPointsForResults(fight){
    var [action, reaction] = fight.split(" ");
    var index = actions.findIndex(x=> x[0] == action);

    // if i have to lose take the previous action.
    if(reaction === 'X'){
        index--;
    }
    // if i have to win, take the next action.
    if(reaction === 'Z'){
        index++;
    }
    var toChooseIndex = (index+3) % 3;
    var actionToChoose = actions[toChooseIndex][1];
    return getPoints(action + ' ' + actionToChoose);
}

var fightScores = fights.map(getPointsForResults);
var totalScore = fightScores.reduce((a,b)=> a+b, 0);
console.log(totalScore);