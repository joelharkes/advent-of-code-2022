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